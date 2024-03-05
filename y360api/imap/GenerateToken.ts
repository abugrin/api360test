'use server';
import requestToken from "@/y360api/token/TokenAPI";

export const GenerateUserToken = async (userId: string): Promise<string> => {
    const client_id = '' + process.env.CLIENT_ID;
    const client_secret = '' + process.env.CLIENT_SECRET;
    const res = await requestToken(client_id, client_secret, userId);
        
    return res.access_token;
};

