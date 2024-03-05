export interface Inline {
    inline_keyboard: [Button]
}

export interface Button {
    text: string,
    callback_data: unknown
}

