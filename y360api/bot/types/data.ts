import { Method } from "@/y360api/types";

export interface Data {
    method: Method,
    headers: BotHeaders,
    body: string,
    next: {
        revalidate: number
    }
}

export interface BotHeaders {
        'Authorization': string,
        'Content-Type': string
}