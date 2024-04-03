'use server';

import { ContentType, Method } from "../types";
import { TelemostRequest, TelemostResponse } from "./TelemostTypes";

const TELEMOST_API_URL = 'https://cloud-api.yandex.net/v1/telemost-api';
const TELEMOST_AUTH = 'OAuth ' + process.env.TELEMOST_KEY;

export const createMeeting = async () : Promise<string> => {

    const req: TelemostRequest = {
        access_level: 'ORGANIZATION'
    };

    const data = {
        method: Method.POST,
        headers: {
            'Authorization': TELEMOST_AUTH,
            'Content-Type': ContentType.json,
        },
        body: JSON.stringify(req),
        next: {
            revalidate: 0
        }
    };

    const res = await fetch(TELEMOST_API_URL + '/conferences', data);
    const json: TelemostResponse = await res.json();
    console.log(json);
    return json.join_url;
};

