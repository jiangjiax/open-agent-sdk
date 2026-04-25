/**
 * QueryEngine - Core agentic loop
 *
 * Manages the full conversation lifecycle:
 * 1. Take user prompt
 * 2. Build system prompt with context (git status, project context, tools)
 * 3. Call LLM API with tools (via provider abstraction)
 * 4. Stream response
 * 5. Execute tool calls (concurrent for read-only, serial for mutations)
 * 6. Send results back, repeat until done
 * 7. Auto-compact when context exceeds threshold
 * 8. Retry with exponential backoff on transient errors
 */
import type { SDKMessage, QueryEngineConfig, TokenUsage } from './types.js';
import type { NormalizedMessageParam } from './providers/types.js';
export declare class QueryEngine {
    private config;
    private provider;
    messages: NormalizedMessageParam[];
    private totalUsage;
    private totalCost;
    private turnCount;
    private compactState;
    private sessionId;
    private apiTimeMs;
    private hookRegistry?;
    constructor(config: QueryEngineConfig);
    /**
     * Execute hooks for a lifecycle event.
     * Returns hook outputs; never throws.
     */
    private executeHooks;
    /**
     * Submit a user message and run the agentic loop.
     * Yields SDKMessage events as the agent works.
     */
    submitMessage(prompt: string | any[]): AsyncGenerator<SDKMessage>;
    /**
     * Execute tool calls with concurrency control.
     *
     * Read-only tools run concurrently (up to 10 at a time).
     * Mutation tools run sequentially.
     */
    private executeTools;
    /**
     * Execute a single tool with permission checking.
     */
    private executeSingleTool;
    /**
     * Get current messages for session persistence.
     */
    getMessages(): NormalizedMessageParam[];
    /**
     * Get total usage across all turns.
     */
    getUsage(): TokenUsage;
    /**
     * Get total cost.
     */
    getCost(): number;
}
//# sourceMappingURL=engine.d.ts.map