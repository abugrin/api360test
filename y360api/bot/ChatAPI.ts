import { log } from "console";
import { ChatType, Delete, Send, Update } from ".";
import { ContentType, Method } from "@/y360api/types";

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

    

    sendMessage = async (text: string, update: Update) : Promise<Response> => {
        const send: Send = {
            text: text
        };

        if (update.chat.thread_id) {
            send.thread_id = update.chat.thread_id;
        }

        if (update.chat.type === ChatType.group) {
            send.chat_id = update.chat.id;
            
        } else {
            send.login = update.from.login;
        }
        console.log('Send message to: ', send);
        this.data.body = JSON.stringify(send);
        const res = await fetch(BOT_API_URL + '/bot/v1/messages/sendText', this.data);
        
        log(await res.json());
        return res;
         
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

    sendInlineMessage = async (text: string, update: Update) : Promise<Response> => {
        const send: Send = {
            chat_id: update.chat.id,
            text: text
        };
        
        this.data.body = JSON.stringify(send);
        
        const res = fetch(BOT_API_URL + '/bot/v1/messages/sendText', this.data);
     
        return res;
         
    };
}