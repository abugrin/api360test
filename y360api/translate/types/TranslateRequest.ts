export interface TranslateRequest {
    folderId: string,
    texts: [string],
    targetLanguageCode: lang
}

export enum lang {
    ru = 'ru',
    en = 'en'
}