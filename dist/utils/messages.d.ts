/**
 * Message Utilities
 *
 * Message creation factories, normalization for API,
 * synthetic placeholders, and content processing.
 */
import type { UserMessage, AssistantMessage, TokenUsage } from '../types.js';
/**
 * Create a user message.
 */
export declare function createUserMessage(content: string | any[], options?: {
    uuid?: string;
    isMeta?: boolean;
    toolUseResult?: unknown;
}): UserMessage;
/**
 * Create an assistant message.
 */
export declare function createAssistantMessage(content: any[], usage?: TokenUsage): AssistantMessage;
/**
 * Normalize messages for the LLM API.
 * Ensures proper message format, strips internal metadata,
 * and fixes tool result pairing.
 */
export declare function normalizeMessagesForAPI(messages: Array<{
    role: string;
    content: any;
}>): Array<{
    role: string;
    content: any;
}>;
/**
 * Strip images from messages (for compaction).
 */
export declare function stripImagesFromMessages(messages: Array<{
    role: string;
    content: any;
}>): Array<{
    role: string;
    content: any;
}>;
/**
 * Extract text from message content blocks.
 */
export declare function extractTextFromContent(content: any[] | string): string;
/**
 * Create a system message for compact boundary.
 */
export declare function createCompactBoundaryMessage(): {
    role: string;
    content: string;
};
/**
 * Truncate text to max length with ellipsis.
 */
export declare function truncateText(text: string, maxLength: number): string;
//# sourceMappingURL=messages.d.ts.map