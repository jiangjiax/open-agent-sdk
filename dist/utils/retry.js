/**
 * Retry Logic with Exponential Backoff
 *
 * Handles API retries for rate limits, overloaded servers,
 * and transient failures.
 */
/**
 * Default retry configuration.
 */
export const DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,
    baseDelayMs: 2000,
    maxDelayMs: 30000,
    retryableStatusCodes: [429, 500, 502, 503, 529],
};
/**
 * Check if an error is retryable.
 */
export function isRetryableError(err, config = DEFAULT_RETRY_CONFIG) {
    if (err?.status && config.retryableStatusCodes.includes(err.status)) {
        return true;
    }
    // Network errors
    if (err?.code === 'ECONNRESET' || err?.code === 'ETIMEDOUT' || err?.code === 'ECONNREFUSED') {
        return true;
    }
    // API overloaded
    if (err?.error?.type === 'overloaded_error') {
        return true;
    }
    return false;
}
/**
 * Calculate delay for exponential backoff.
 */
export function getRetryDelay(attempt, config = DEFAULT_RETRY_CONFIG) {
    const delay = config.baseDelayMs * Math.pow(2, attempt);
    // Add jitter (±25%)
    const jitter = delay * 0.25 * (Math.random() * 2 - 1);
    return Math.min(delay + jitter, config.maxDelayMs);
}
/**
 * Execute a function with retries.
 */
export async function withRetry(fn, config = DEFAULT_RETRY_CONFIG, abortSignal) {
    let lastError;
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        if (abortSignal?.aborted) {
            throw new Error('Aborted');
        }
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            if (!isRetryableError(err, config)) {
                throw err;
            }
            if (attempt === config.maxRetries) {
                throw err;
            }
            // Wait before retry
            const delay = getRetryDelay(attempt, config);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
/**
 * Execute a streaming generator function with retries.
 * On retryable errors, restarts the generator from scratch.
 */
export async function* withRetryStream(fn, config = DEFAULT_RETRY_CONFIG, abortSignal) {
    let lastError;
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        if (abortSignal?.aborted)
            throw new Error('Aborted');
        try {
            yield* fn();
            return;
        }
        catch (err) {
            lastError = err;
            if (!isRetryableError(err, config) || attempt === config.maxRetries) {
                throw err;
            }
            const delay = getRetryDelay(attempt, config);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
export function isPromptTooLongError(err) {
    if (err?.status === 400) {
        const message = err?.error?.error?.message || err?.message || '';
        return message.includes('prompt is too long') ||
            message.includes('max_tokens') ||
            message.includes('context length');
    }
    return false;
}
/**
 * Check if error is an auth error.
 */
export function isAuthError(err) {
    return err?.status === 401 || err?.status === 403;
}
/**
 * Check if error is a rate limit error.
 */
export function isRateLimitError(err) {
    return err?.status === 429;
}
/**
 * Format an API error for display.
 */
export function formatApiError(err) {
    if (isAuthError(err)) {
        return 'Authentication failed. Check your CODEANY_API_KEY.';
    }
    if (isRateLimitError(err)) {
        return 'Rate limit exceeded. Please retry after a short wait.';
    }
    if (err?.status === 529) {
        return 'API overloaded. Please retry later.';
    }
    if (isPromptTooLongError(err)) {
        return 'Prompt too long. Auto-compacting conversation...';
    }
    return `API error: ${err.message || err}`;
}
//# sourceMappingURL=retry.js.map