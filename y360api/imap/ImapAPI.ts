import Imap from "imap";
import { GenerateUserToken } from "./GenerateToken";
import { inspect } from "util";
import { email } from "./types/email";

const lastmail: email = {
    subject: 'test',
    body: 'test'
};

let to: string[] = [];


export const TestImap = async (userId: string): Promise<email> => {
    console.log('Test IMAP for:', userId);
    const imap = await prepareConnection(userId);

    imap.connect();
    await fetchMail(imap);
    while (lastmail.subject === 'test') {
        console.log('Waiting for mail...');
        await new Promise(f => setTimeout(f, 200));
    }
    return lastmail;
};


export const DeleteMailBySubject = async (userId: string, subject: string, from: string) => {
    console.log('Test IMAP Delete for:', userId);
    const imap = await prepareConnection(userId);
    imap.connect();
    await deleteMail(imap, subject, from);
};

export const GetMailToBySubject = async (userId: string, subject: string): Promise<string> => {
    console.log('Test IMAP Search for:', userId);
    const imap = await prepareConnection(userId);
    imap.connect();
    
    await searchSentMail(imap, subject);
    while (to.length < 1) {
        console.log('Waiting for mail...');
        await new Promise(f => setTimeout(f, 200));
    }
    return to[0];
};

const fetchMail = async (imap: Imap) => {
    imap.once('ready', () => {
        console.log("Connected");
        openInbox(imap, (err: Error, box: Imap.Box) => processMail(box, imap));
    });
};

const deleteMail = async (imap: Imap, subject: string, from: string) => {
    imap.once('ready', () => {
        console.log("Connected for delete");
        openInbox(imap, (err: Error, box: Imap.Box) => deleteMessage(box, imap, subject, from));
    });
};

const searchSentMail = async (imap: Imap, subject: string) => {
    imap.once('ready', () => {
        console.log("Connected for search");
//        imap.getBoxes((err, boxes) => {
//            console.log(inspect(boxes));
//        });
        openSent(imap, (err: Error, box: Imap.Box) => searchMessage(box, imap, subject));

    });
};


const deleteMessage = async (box: Imap.Box, imap: Imap, subject: string, from: string) => {
    imap.search(
        [
            "UNSEEN",
            ["SUBJECT", subject],
            ["FROM", from]
        ],
        (error, results) => {
            if (error) throw error;
            console.log("Found", results.length, "messages");

            for (const uid of results) {
                const mails = imap.fetch(uid, {
                    bodies: ""
                    // markSeen: true
                });
                mails.once("end", () => imap.end());

                mails.on("message", (message, seq) => {
                    console.log("Message %d", seq);
                    message.on("body", stream => {
                        let buffer = "";
                        stream.on("data", chunk => (buffer += chunk.toString("utf8")));
                        stream.once("end", () => imap.addFlags(uid, "Deleted", () => { imap.end(); }));
                    });
                });
            }
        });
};

const searchMessage = async (box: Imap.Box, imap: Imap, subject: string) => {
    imap.search(
        [
            ["SUBJECT", subject],
        ],
        (error, results) => {
            if (error) throw error;
            console.log("Found", results.length, "messages");
            if (results.length === 0) {
                console.log("No messages found");
                to = ['notfound'];
                imap.end();
            }


            for (const uid of results) {
                const mails = imap.fetch(uid, {
                    bodies: ""
                    // markSeen: true
                });
                mails.once("end", () => imap.end());

                mails.on("message", (message, seq) => {
                    console.log("Message %d", seq);
                    message.on("body", stream => {
                        let buffer = "";
                        stream.on("data", chunk => (buffer += chunk.toString("utf8")));
                        stream.once("end", () => {
                            const header = Imap.parseHeader(buffer);
                            if (header.to) {
                                console.log('To:', header.to);
                                to = header.to;
                            } else if (header.subject) {
                                console.log('Subject:', header.subject[0]);
                            }
                            imap.end();
                        });
                    });
                });
            }
        });
};

const processMail = async (box: Imap.Box, imap: Imap) => {


    const f = imap.seq.fetch(box.messages.total + ':*', {
        bodies: ['HEADER.FIELDS (FROM)', 'HEADER.FIELDS (SUBJECT)', 'HEADER.FIELDS (X-Mailer)', 'TEXT'],
        //bodies: '',
        struct: true
    });

    f.on('message', function (msg: Imap.ImapMessage, seqno) {
        console.log('Message #%d', seqno);
        const prefix = '(#' + seqno + ') ';
        msg.on('body', function (stream, info) {
            if (info.which === 'TEXT') {
                console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
            }

            let buffer = '';


            stream.on('data', function (chunk) {
                buffer += chunk.toString('utf8');

                lastmail.body = buffer;
            });
            stream.once('end', function () {
                //console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                //console.log(prefix + 'Bare header: ', Imap.parseHeader(buffer));
                const header = Imap.parseHeader(buffer);
                if (header.subject) {
                    console.log('Subject:', header.subject[0]);
                    lastmail.subject = header.subject[0];

                }

            });
        });
        msg.once('end', function () {
            console.log(prefix + 'Finished');
        });

    });
    f.once('error', function (err) {
        console.log('Fetch error: ' + err);

    });
    f.once('end', function () {
        console.log('Done fetching all messages!');
        imap.end();
        console.log('MAIL', lastmail);


    });

};

const prepareConnection = async (userId: string): Promise<Imap> => {
    const token = await GenerateUserToken(userId);
    const mailId = userId;
    const base64Encoded = Buffer.from([`user=${mailId}`, `auth=Bearer ${token}`, '', ''].join('\x01'), 'utf-8').toString('base64');

    const imap = new Imap({
        user: '',
        password: '',
        xoauth2: base64Encoded,
        host: 'imap.yandex.com',
        port: 993,
        tls: true,
        //debug: console.log,
        authTimeout: 25000,
        connTimeout: 30000
    });

    return imap;
};


const openInbox = (imap: Imap, cb: { (err: Error, box: Imap.Box): Promise<void>; (error: Error, mailbox: Imap.Box): void; }) => {
    imap.openBox('INBOX', false, cb);
};

const openSent = (imap: Imap, cb: { (err: Error, box: Imap.Box): Promise<void>; (error: Error, mailbox: Imap.Box): void; }) => {
    imap.openBox('Sent', true, cb);
};