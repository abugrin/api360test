import { TranslateData, TranslateHeaders, TranslateRequest, TranslateResponse, lang } from ".";
import { ContentType, Method } from "../types";


export const TRANSLATE_PATH: string = 'https://translate.api.cloud.yandex.net';
export const TRANSLATE_FOLDER: string = '' + process.env.TRANSLATE_FOLDER;
export const TRANSLATE_AUTH: string = 'Api-Key ' + process.env.TRANSLATE_API_KEY;


// eslint-disable-next-line @typescript-eslint/ban-types
export const translateFetchAPI = async (route: string, data: {}): Promise<Response> => {
    return await fetch(TRANSLATE_PATH + route, data);

};

export default class TranslateAPI {

    translateHeaders: TranslateHeaders = {
        'Authorization': TRANSLATE_AUTH,
        'Content-Type': ContentType.json
    };

    data: TranslateData = {
        method: Method.POST,
        headers: this.translateHeaders,
        body: "",
        next: {
            revalidate: 0
        }
    };

    translateText = async (text: string, language: lang) : Promise<string> => {
        const translateRequest: TranslateRequest = {
            folderId: TRANSLATE_FOLDER,
            texts: [text],
            targetLanguageCode: language
        };
        
        this.data.body = JSON.stringify(translateRequest);
        
        const res = await translateFetchAPI('/translate/v2/translate', this.data);

        const translation: TranslateResponse = await res.json();
        console.log('Translate Response: ', translation);
        return translation.translations[0].text;

         
    };

}