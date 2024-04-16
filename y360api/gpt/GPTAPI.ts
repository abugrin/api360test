import { ImageGenerationRequest, ImageGenerationResponse, MimeType, Role, TextGenerationRequest, TextGenerationResponse } from ".";
import { ContentType, Method } from "../types";

export const GPT_PATH: string = 'https://llm.api.cloud.yandex.net';
export const GPT_FOLDER: string = '' + process.env.GPT_FOLDER;
export const GPT_AUTH: string = 'Api-Key ' + process.env.GPT_API_KEY;

export const GPT_COMPLETION_POINT = '/foundationModels/v1/completion';
export const ART_COMPLETION_POINT = '/foundationModels/v1/imageGenerationAsync';


export default class GPTAPI {
    headers = {
        'Authorization': GPT_AUTH,
        'Content-Type': ContentType.json
    };

    generateText = async (instruction: string, text: string, assistant?: string): Promise<TextGenerationResponse> => {
        const data = {
            method: Method.POST,
            headers: this.headers,
            body: '',
            next: {
                revalidate: 0
            }
        };
        let request: TextGenerationRequest;

        if (assistant) {
            request = {
                modelUri: `gpt://${GPT_FOLDER}/yandexgpt/latest`,
                completionOptions: {
                    stream: false,
                    temperature: 0.6,
                    maxTokens: 2000
                },
                messages: [
                    {
                        role: Role.system,
                        text: instruction
                    },
                    {
                        role: Role.user,
                        text: text
                    },
                    {
                        role: Role.assistant,
                        text: assistant
                    },
                ]
            };
        } else {
            request = {
                modelUri: `gpt://${GPT_FOLDER}/yandexgpt/latest`,
                completionOptions: {
                    stream: false,
                    temperature: 0.6,
                    maxTokens: 2000
                },
                messages: [
                    {
                        role: Role.system,
                        text: instruction
                    },
                    {
                        role: Role.user,
                        text: text
                    }

                ]
            };       
        }

        console.log('GPT Request', request);

        data.body = JSON.stringify(request);

        const res = await fetch(GPT_PATH + GPT_COMPLETION_POINT, data);

        const json: TextGenerationResponse = await res.json();
        console.log('GPT Response:', json);
        return json;
    };

    generateArt = async (text: string): Promise<ImageGenerationResponse> => {
        const data = {
            method: Method.POST,
            headers: this.headers,
            body: '',
            next: {
                revalidate: 0
            }
        };
        const request: ImageGenerationRequest = {
            modelUri: `art://${GPT_FOLDER}/yandex-art/latest`,
            messages: [
                {
                    text: text,
                    weight: 1
                }
            ],
            generation_options: {
                mime_type: MimeType.jpeg,
                seed: Math.floor((Math.random() * 100) + 1)
            }

        };

        console.log('ART Request', request);

        data.body = JSON.stringify(request);

        const res = await fetch(GPT_PATH + ART_COMPLETION_POINT, data);

        const json: ImageGenerationResponse = await res.json();
        console.log('ART Response:', json);

        return json;

    };

    getArtOperation = async(operation_id:string): Promise<ImageGenerationResponse> => {
        const data = {
            method: Method.GET,
            headers: this.headers,
            next: {
                revalidate: 0
            }
        };

        const res = await fetch(`${GPT_PATH}/operations/${operation_id}`, data);
        const json: ImageGenerationResponse = await res.json();
        console.log('ART Response Id: ', json.id);
        console.log('ART Response done: ', json.done);
        return json;
    };
}