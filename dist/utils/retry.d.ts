/**
 * Retry Logic with Exponential Backoff
 *
 * Handles API retries for rate limits, overloaded servers,
 * and transient failures.
 */
/**
 * Retry configuration.
 */
export interface RetryConfig {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    retryableStatusCodes: number[];
}
/**
 * Default retry configuration.
 */
export declare const DEFAULT_RETRY_CONFIG: RetryConfig;
/**
 * Check if an error is retryable.
 */
export declare function isRetryableError(err: any, config?: RetryConfig): boolean;
/**
 * Calculate delay for exponential backoff.
 */
export declare function getRetryDelay(attempt: number, config?: RetryConfig): number;
/**
 * Execute a function with retries.
 */
export declare function withRetry<T>(fn: () => Promise<T>, config?: RetryConfig, abortSignal?: AbortSignal): Promise<T>;
/**
 * Execute a streaming generator function with retries.
 * On retryable errors, restarts the generator from scratch.
 */
export declare function withRetryStream<T>(fn: () => AsyncGenerator<T>, config?: RetryConfig, abortSignal?: AbortSignal): AsyncGenerator<T>;
export declare function isPromptTooLongError(err: any): boolean;
/**
 * Check if error is an auth error.
 */
export declare function isAuthError(err: any): boolean;
/**
 * Check if error is a rate limit error.
 */
export declare function isRateLimitError(err: any): boolean;
/**
 * Format an API error for display.
 */
export declare function formatApiError(err: any): string;
//# sourceMappingURL=retry.d.ts.map