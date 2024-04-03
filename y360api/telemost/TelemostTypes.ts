export interface TelemostRequest {
    access_level: string // PUBLIC — для всех пользователей; ORGANIZATION — только для сотрудников;
    live_stream?: {
        access_level: string, // PUBLIC — для всех пользователей; ORGANIZATION — только для сотрудников;
        title?: string,
        description?: string
    }
}

export interface TelemostResponse {
    join_url: string,
    id: number,
    live_stream?: {
        watch_url: string
    }
}
