/**
 * Context Compression / Auto-Compaction
 *
 * Summarizes long conversation histories when context window fills up.
 * Three-tier system:
 * 1. Auto-compact: triggered when tokens exceed threshold
 * 2. Micro-compact: cache-aware per-request optimization
 * 3. Session memory compaction: consolidates across sessions
 */
import type { LLMProvider } from '../providers/types.js';
import type { NormalizedMessageParam } from '../providers/types.js';
/**
 * State for tracking auto-compaction across turns.
 */
export interface AutoCompactState {
    compacted: boolean;
    turnCounter: number;
    consecutiveFailures: number;
}
/**
 * Create initial auto-compact state.
 */
export declare function createAutoCompactState(): AutoCompactState;
/**
 * Check if auto-compaction should trigger.
 */
export declare function shouldAutoCompact(messages: any[], model: string, state: AutoCompactState): boolean;
/**
 * Compact conversation by summarizing with the LLM.
 *
 * Sends the entire conversation to the LLM for summarization,
 * then replaces the history with a compact summary.
 */
export declare function compactConversation(provider: LLMProvider, model: string, messages: any[], state: AutoCompactState): Promise<{
    compactedMessages: NormalizedMessageParam[];
    summary: string;
    state: AutoCompactState;
}>;
/**
 * Micro-compact: optimize messages by truncating large tool results
 * to fit within token budgets.
 */
export declare function microCompactMessages(messages: any[], maxToolResultChars?: number): any[];
//# sourceMappingURL=compact.d.ts.map