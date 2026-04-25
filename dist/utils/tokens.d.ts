/**
 * Token Estimation & Counting
 *
 * Provides rough token estimation (character-based) and
 * API-based exact counting when available.
 */
/**
 * Rough token estimation: ~4 chars per token (conservative).
 */
export declare function estimateTokens(text: string): number;
/**
 * Estimate tokens for a message array.
 */
export declare function estimateMessagesTokens(messages: Array<{
    role: string;
    content: any;
}>): number;
/**
 * Estimate tokens for a system prompt.
 */
export declare function estimateSystemPromptTokens(systemPrompt: string): number;
/**
 * Count tokens from API usage response.
 */
export declare function getTokenCountFromUsage(usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
}): number;
/**
 * Get the context window size for a model.
 */
export declare function getContextWindowSize(model: string): number;
/**
 * Auto-compact buffer: trigger compaction when within this many tokens of the limit.
 */
export declare const AUTOCOMPACT_BUFFER_TOKENS = 13000;
/**
 * Get the auto-compact threshold for a model.
 */
export declare function getAutoCompactThreshold(model: string): number;
/**
 * Model pricing (USD per token).
 */
export declare const MODEL_PRICING: Record<string, {
    input: number;
    output: number;
}>;
/**
 * Estimate cost from usage and model.
 */
export declare function estimateCost(model: string, usage: {
    input_tokens: number;
    output_tokens: number;
}): number;
//# sourceMappingURL=tokens.d.ts.map