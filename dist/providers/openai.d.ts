/**
 * OpenAI Chat Completions API Provider
 *
 * Converts between the SDK's internal Anthropic-like message format
 * and OpenAI's Chat Completions API format.
 *
 * Uses native fetch (no openai SDK dependency required).
 */
import type { LLMProvider, CreateMessageParams, CreateMessageResponse, StreamEvent } from './types.js';
export declare class OpenAIProvider implements LLMProvider {
    readonly apiType: "openai-completions";
    private apiKey;
    private baseURL;
    constructor(opts: {
        apiKey?: string;
        baseURL?: string;
    });
    createMessage(params: CreateMessageParams): Promise<CreateMessageResponse>;
    createMessageStream(params: CreateMessageParams): AsyncGenerator<StreamEvent>;
    private convertMessages;
    private convertUserMessage;
    private convertAssistantMessage;
    private convertTools;
    private convertResponse;
    private mapFinishReason;
}
//# sourceMappingURL=openai.d.ts.map