/**
 * LLM Provider Factory
 *
 * Creates the appropriate provider based on API type configuration.
 */
export type { ApiType, LLMProvider, CreateMessageParams, CreateMessageResponse, NormalizedMessageParam, NormalizedContentBlock, NormalizedTool, NormalizedResponseBlock } from './types.js';
export { AnthropicProvider } from './anthropic.js';
export { OpenAIProvider } from './openai.js';
import type { ApiType, LLMProvider } from './types.js';
/**
 * Create an LLM provider based on the API type.
 *
 * @param apiType - 'anthropic-messages' or 'openai-completions'
 * @param opts - API credentials
 */
export declare function createProvider(apiType: ApiType, opts: {
    apiKey?: string;
    baseURL?: string;
}): LLMProvider;
//# sourceMappingURL=index.d.ts.map