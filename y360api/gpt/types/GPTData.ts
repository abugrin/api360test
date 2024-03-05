export interface TextGenerationRequest {
    modelUri: string;
    completionOptions: CompletionOptions;
    messages: Message[];
}

export interface TextGenerationResponse {
    result: Result;
}

export interface Message {
    role: Role;
    text: string;
}

export interface CompletionOptions {
    stream: boolean;
    temperature: number;
    maxTokens: number;
}

export interface Result {
    alternatives: Alternative[];
    usage: Usage;
    modelVersion: string;
}

export interface Usage {
    inputTextTokens: string;
    completionTokens: string;
    totalTokens: string;
}

export interface Alternative {
    message: Message;
    status: string;
}

export enum Role {
    system = 'system',
    user = 'user',
    assistant = 'assistant'
}