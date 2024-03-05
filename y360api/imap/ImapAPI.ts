import Imap from "imap";
import { GenerateUserToken } from "./GenerateToken";
import { inspect } from "util";


export default class ImapAPI {
    userId: string;
    constructor(userId: string) {
        this.userId = userId;
    }

    Test = async () => {
        const token = await GenerateUserToken(this.userId);
        //console.log('Generated token:', token);
        const mailId = 'iivanov@myandex360.ru';
        const base64Encoded = Buffer.from([`user=${mailId}`, `auth=Bearer ${token}`, '', ''].join('\x01'), 'utf-8').toString('base64');
        //console.log('Encoded:', base64Encoded);

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
        }
        );

        imap.once('ready', () => {

            console.log("Connected");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.openInbox(imap, (err, box: Imap.Box) => {
                const f = imap.seq.fetch(box.messages.total + ':*', {
                    bodies: ['HEADER.FIELDS (FROM)', 'HEADER.FIELDS (SUBJECT)', 'HEADER.FIELDS (X-Mailer)', 'TEXT'],
                    //bodies: '',
                    struct: true
                });

                f.on('message', function (msg, seqno) {
                    console.log('Message #%d', seqno);

                    const prefix = '(#' + seqno + ') ';
                    msg.on('body', function (stream, info) {
                        if (info.which === 'TEXT')
                            console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);

                        let buffer = '';
                        stream.on('data', function (chunk) {
                            buffer += chunk.toString('utf8');
                        });
                        stream.once('end', function () {
                            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                        });
                    });
                    msg.once('attributes', function (attrs) {
                        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
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
                });
            });

        });
        imap.connect();

    };

    openInbox = (imap: Imap, cb) => {
        imap.openBox('INBOX', true, cb);
    };


}

