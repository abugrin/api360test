export interface UpdateRequest {
    updates: [Update]
}

export interface Update {
    message_id: number,
    timestamp: number,
    chat: Chat,
    from: From,
    update_id: number,
    text: string,
    reply_to_message?: Update
}

export interface Chat {
    type: ChatType,
    id: string,
    thread_id?: number
}

export interface From {
    id: string,
    display_name: string,
    login: string,
    robot: boolean
  }

export enum ChatType {
    group = 'group',
    private = 'private'
}

