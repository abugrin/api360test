export enum Method {
    GET = 'GET',
    POST = 'POST'
}

export enum ContentType {
    json = 'application/json',
    urlencoded = 'application/x-www-form-urlencoded'
}

export interface RequestData {
    method: Method,
    headers: RequestHeaders,
    body: string,
    next?: {
        revalidate: number
    }
}

export interface RequestHeaders {
        'Authorization'?: string,
        'Content-Type'?: ContentType
}