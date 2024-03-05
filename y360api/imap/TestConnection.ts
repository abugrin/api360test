'use server';

import ImapAPI from "./ImapAPI";

export const TestConnection = async (userId: string) => {
    const imap = new ImapAPI(userId);
    const res = await imap.Test();

    return res;
    
};
