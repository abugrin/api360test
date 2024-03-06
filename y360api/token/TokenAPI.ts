'use server';

import TokenResponse from "@/y360api/token/TokenResponse";
import { ContentType, Method } from "@/y360api/types";

const OAUTH_TOKEN_URL: string = 'https://oauth.yandex.ru/token';
const GRANT_TYPE: string = 'urn:ietf:params:oauth:grant-type:token-exchange';
const SUBJECT_TOKEN_TYPE_UID: string = 'urn:yandex:params:oauth:token-type:uid';
const SUBJECT_TOKEN_TYPE_EMAIL: string = 'urn:yandex:params:oauth:token-type:email';

const requestToken = async (client_id: string, client_secret: string, subject_token: string): Promise<TokenResponse> => {
    let SUBJECT_TOKEN_TYPE = SUBJECT_TOKEN_TYPE_UID;
    if (subject_token.indexOf('@') > -1) {
        SUBJECT_TOKEN_TYPE = SUBJECT_TOKEN_TYPE_EMAIL;
    }


    const details = [
        { key: 'grant_type', value: GRANT_TYPE },
        { key: 'client_id', value: client_id },
        { key: 'client_secret', value: client_secret },
        { key: 'subject_token', value: subject_token },
        { key: 'subject_token_type', value: SUBJECT_TOKEN_TYPE },
    ];

    const formBody: [string] = [''];
    details.forEach(detail => {
        const encodedKey = encodeURIComponent(detail.key);
        const encodedValue = encodeURIComponent(detail.value);
        formBody.push(encodedKey + '=' + encodedValue);
    });

    const data = {
        method: Method.POST,
        headers: {
            'Content-Type': ContentType.urlencoded,
        },
        body: formBody.join('&'),
        next: {
            revalidate: 1800
        }
    };

    const res = await fetch(OAUTH_TOKEN_URL, data);
    const json: TokenResponse = await res.json();

    console.log('Token Response: ', json);
    return json;
};

export default requestToken;
