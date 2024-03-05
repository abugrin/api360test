import { lang } from "..";

export interface TranslateResponse {
    translations: [ { text: string, detectedLanguageCode: lang } ]
}