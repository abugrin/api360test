import { Method } from "@/y360api/types";

export interface TranslateData {
    method: Method,
    headers: TranslateHeaders,
    body: string,
    next: {
        revalidate: number
    }
}

export interface TranslateHeaders {
        'Authorization': string,
        'Content-Type': string
}