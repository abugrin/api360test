import { log } from "console";
import { ChatType, Delete, Send, Update } from ".";
import { ContentType, Method } from "@/y360api/types";
import { Button } from "./types/button";

const BOT_API_URL = 'https://botapi.messenger.yandex.net';


export class BotChatAPI {
    botAuth: string;
    data: RequestInit;

    constructor(botAuth:string) {
        this.botAuth = botAuth;
        this.data = {
            method: Method.POST,
            headers: {
                'Authorization': this.botAuth,
                'Content-Type': ContentType.json
            },
            body: '',
            next: {
                revalidate: 0
            }
        };
    }

    postMessage = async (send: Send, update: Update) : Promise<Response> => {
        if (update.chat.thread_id) {
            send.thread_id = update.chat.thread_id;
        }

        if (update.chat.type === ChatType.group) {
            send.chat_id = update.chat.id;
            
        } else {
            send.login = update.from.login;
        }
        console.log('Send message to: ', JSON.stringify(send));
        this.data.body = JSON.stringify(send);
        const res = await fetch(BOT_API_URL + '/bot/v1/messages/sendText', this.data);
        
        log(await res.json());
        return res;
    };

    sendMessage = async (text: string, update: Update) : Promise<Response> => {
        const send: Send = {
            text: text,
            disable_web_page_preview: true
        };

        return this.postMessage(send, update);
         
    };

    deleteMessage = async (update: Update) : Promise<Response> => {
        const del: Delete = {
            chat_id: update.chat.id,
            message_id: update.message_id
        };

        log('Deleting message:', update.message_id);
    
        this.data.body = JSON.stringify(del);
        const res = fetch(BOT_API_URL + '/bot/v1/messages/delete', this.data);
     
        return res;
        
    };

    sendInlineKeyboard = async (text: string, buttons: Button[], update: Update) : Promise<Response> => {
        const send: Send = {
            text: text,
            inline_keyboard: buttons
        };

        return this.postMessage(send, update);
    };

    sendImage = async (imageBuffer: string, update: Update)  => {
        /*fs.readFile('./public/generated/fbvfplp1b7cmdgtqn48c.jpg', data => {
            console.log('Data: ', data);
        });*/
        const form_data = new FormData();
        const image_file = new Blob([Buffer.from(imageBuffer,"base64")]);
        console.log(image_file);
        //form_data.append('login', 'abugrin@myandex360.ru');
        
        if (update.chat.thread_id) {
            form_data.append('thread_id', update.chat.thread_id.toString());
        }

        if (update.chat.type === ChatType.group) {
            form_data.append('chat_id', update.chat.id);
            
        } else {
            form_data.append('login', update.from.login);
        }

        form_data.append('image', image_file, 'generated.jpg');

        const req = {
            method: Method.POST,
            headers: {
                'Authorization': this.botAuth,
                //'Content-Type':'multipart/form-data'
            },
            body: form_data,
            next: {
                revalidate: 0
            }
        };

        //console.log(req);

        const res = await fetch(BOT_API_URL + '/bot/v1/messages/sendImage', req);
        console.log(await res.json());
        

    };
}