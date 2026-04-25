/**
 * Agent - High-level API
 *
 * Provides createAgent() and query() interfaces compatible with
 * open-agent-sdk.
 *
 * Usage:
 *   import { createAgent } from 'open-agent-sdk'
 *   const agent = createAgent({ model: 'claude-sonnet-4-6' })
 *   for await (const event of agent.query('Hello')) { ... }
 *
 *   // OpenAI-compatible models
 *   const agent = createAgent({
 *     apiType: 'openai-completions',
 *     model: 'gpt-4o',
 *     apiKey: 'sk-...',
 *     baseURL: 'https://api.openai.com/v1',
 *   })
 */
import type { AgentOptions, QueryResult, SDKMessage, Message, PermissionMode } from './types.js';
import { type ApiType } from './providers/index.js';
export declare class Agent {
    private cfg;
    private toolPool;
    private modelId;
    private apiType;
    private apiCredentials;
    private provider;
    private mcpLinks;
    private history;
    private messageLog;
    private setupDone;
    private sid;
    private abortCtrl;
    private currentEngine;
    private hookRegistry;
    constructor(options?: AgentOptions);
    /**
     * Resolve API type from options, env, or model name heuristic.
     */
    private resolveApiType;
    /** Pick API key and base URL from options or CODEANY_* env vars. */
    private pickCredentials;
    /** Read a value from process.env (returns undefined if missing). */
    private readEnv;
    /** Assemble the available tool set based on options. */
    private buildToolPool;
    /**
     * Async initialization: connect MCP servers, register agents, resume sessions.
     */
    private setup;
    /**
     * Run a query with streaming events.
     */
    query(prompt: string, overrides?: Partial<AgentOptions>): AsyncGenerator<SDKMessage, void>;
    /**
     * Convenience method: send a prompt and collect the final answer as a single object.
     * Internally iterates through the streaming query and aggregates the outcome.
     */
    prompt(text: string, overrides?: Partial<AgentOptions>): Promise<QueryResult>;
    /**
     * Get conversation messages.
     */
    getMessages(): Message[];
    /**
     * Reset conversation history.
     */
    clear(): void;
    /**
     * Interrupt the current query.
     */
    interrupt(): Promise<void>;
    /**
     * Change the model during a session.
     */
    setModel(model?: string): Promise<void>;
    /**
     * Change the permission mode during a session.
     */
    setPermissionMode(mode: PermissionMode): Promise<void>;
    /**
     * Set maximum thinking tokens.
     */
    setMaxThinkingTokens(maxThinkingTokens: number | null): Promise<void>;
    /**
     * Get the session ID.
     */
    getSessionId(): string;
    /**
     * Get the current API type.
     */
    getApiType(): ApiType;
    /**
     * Stop a background task.
     */
    stopTask(taskId: string): Promise<void>;
    /**
     * Close MCP connections and clean up.
     * Optionally persist session to disk.
     */
    close(): Promise<void>;
}
/** Factory: shorthand for `new Agent(options)`. */
export declare function createAgent(options?: AgentOptions): Agent;
/**
 * Execute a single agentic query without managing an Agent instance.
 * The agent is created, used, and cleaned up automatically.
 */
export declare function query(params: {
    prompt: string;
    options?: AgentOptions;
}): AsyncGenerator<SDKMessage, void>;
//# sourceMappingURL=agent.d.ts.map