'use server';

import { TicketRequest } from ".";
import { Update } from "../bot";
import { ContentType, Method } from "../types";
import { TicketResponse } from "./types/trackerResponse";

const TRACKER_API_URL = 'https://api.tracker.yandex.net';
const TRACKER_AUTH = 'OAuth ' + process.env.TRACKER_KEY;
const TRACKER_QUEUE = '' + process.env.TRACKER_QUEUE;


const createTicket = async (update: Update) : Promise<TicketResponse> => {
    console.log('TRACKER:', TRACKER_AUTH);

    const req: TicketRequest = {
        queue: TRACKER_QUEUE,
        summary: update.text.substring(1),
        fname: update.text.substring(9),
        plate: ''
    };

    const org_id = process.env.TRACKER_ORG ? process.env.TRACKER_ORG : '';
    const data = {
        method: Method.POST,
        headers: {
            'Authorization': TRACKER_AUTH,
            'Content-Type': ContentType.json,
            'X-Org-ID': org_id
        },
        body: JSON.stringify(req),
        next: {
            revalidate: 0
        }
    };

    const res = await fetch(TRACKER_API_URL + '/v2/issues', data);
    const json: TicketResponse = await res.json();
    console.log(json);
    return json;
};

export default createTicket;
