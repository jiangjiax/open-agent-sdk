/**
 * Anthropic Messages API Provider
 *
 * Wraps the @anthropic-ai/sdk client. Since our internal format is
 * Anthropic-like, this is mostly a thin pass-through.
 */
import type { LLMProvider, CreateMessageParams, CreateMessageResponse, StreamEvent } from './types.js';
export declare class AnthropicProvider implements LLMProvider {
    readonly apiType: "anthropic-messages";
    private client;
    constructor(opts: {
        apiKey?: string;
        baseURL?: string;
    });
    createMessage(params: CreateMessageParams): Promise<CreateMessageResponse>;
    createMessageStream(params: CreateMessageParams): AsyncGenerator<StreamEvent>;
}
//# sourceMappingURL=anthropic.d.ts.map