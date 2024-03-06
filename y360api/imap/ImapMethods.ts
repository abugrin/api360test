'use server';

import { DeleteMailBySubject, GetMailToBySubject, TestImap } from "./ImapAPI";
import { email } from "./types/email";

export const TestConnection = async (userId: string): Promise<email> => {
    
    const res =  await TestImap(userId);
    console.log('Test IMAP', res);
    return res;
    
};

export const DeleteMail = async (userId: string, subject: string, from: string): Promise<boolean> => {
    
    console.log('Delete request Started for', userId);
    const processed: boolean = await DeleteMailBySubject(userId, subject, from);
    console.log('Delete request finished', userId, 'processed', processed);
    return processed;
};

export const SearchMail = async (userId: string, subject: string): Promise<string[]> => {
    
    const to: string = await GetMailToBySubject(userId, subject);
    if(to === 'notfound') {
        console.log('Not found');
        return [];
        
    } else {
        const toList = to.split(',');
        
        for(let i = 0; i < toList.length; i++) {
            toList[i] = toList[i].substring(toList[i].indexOf('<') + 1, toList[i].indexOf('>'));
            console.log('Found mail in mailbox', toList[i]);
        }
        return toList;
        
    }
    
};
