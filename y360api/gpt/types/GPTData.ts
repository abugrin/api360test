export interface TextGenerationRequest {
    modelUri: string;
    completionOptions: CompletionOptions;
    messages: Message[];
}

export interface ImageGenerationRequest {
    modelUri: string;
    messages: ImageMessage[];
    generation_options: GenerationOptions;
}

export interface ImageGenerationResponse {
    id: string;
    description: string;
    createdAt: string;
    createdBy: string;
    modifiedAt: string;
    done: boolean;
    response: ImageResponse;
    error?: string;
    message?: string;
}

export interface TextGenerationResponse {
    result: Result;
}

export interface Message {
    role: Role;
    text: string;
}

export interface ImageMessage {
    text: string;
    weight: number;
}

export interface GenerationOptions {
    mime_type: MimeType;
    seed: number;
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

export interface ImageResponse {
    "@type": string;
    image: string;
    modelVersion: string;
  }

export enum Role {
    system = 'system',
    user = 'user',
    assistant = 'assistant'
}

export enum MimeType {
    jpeg = 'image/jpeg'
}