/**
 * Message Utilities
 *
 * Message creation factories, normalization for API,
 * synthetic placeholders, and content processing.
 */
/**
 * Create a user message.
 */
export function createUserMessage(content, options) {
    return {
        type: 'user',
        message: {
            role: 'user',
            content,
        },
        uuid: options?.uuid || crypto.randomUUID(),
        timestamp: new Date().toISOString(),
    };
}
/**
 * Create an assistant message.
 */
export function createAssistantMessage(content, usage) {
    return {
        type: 'assistant',
        message: {
            role: 'assistant',
            content,
        },
        uuid: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        usage,
    };
}
/**
 * Normalize messages for the LLM API.
 * Ensures proper message format, strips internal metadata,
 * and fixes tool result pairing.
 */
export function normalizeMessagesForAPI(messages) {
    const normalized = [];
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        // Ensure alternating user/assistant messages
        if (normalized.length > 0) {
            const last = normalized[normalized.length - 1];
            if (last.role === msg.role) {
                // Merge same-role messages
                if (msg.role === 'user') {
                    // Combine content
                    const lastContent = typeof last.content === 'string'
                        ? [{ type: 'text', text: last.content }]
                        : last.content;
                    const newContent = typeof msg.content === 'string'
                        ? [{ type: 'text', text: msg.content }]
                        : msg.content;
                    normalized[normalized.length - 1] = {
                        role: 'user',
                        content: [...lastContent, ...newContent],
                    };
                    continue;
                }
            }
        }
        normalized.push({ ...msg });
    }
    // Ensure tool results are properly paired with tool_use
    return fixToolResultPairing(normalized);
}
/**
 * Fix tool result pairing: ensure every tool_result has a
 * matching tool_use in the previous assistant message.
 */
function fixToolResultPairing(messages) {
    const result = [];
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (msg.role === 'user' && Array.isArray(msg.content)) {
            // Check for tool_result blocks
            const toolResults = msg.content.filter((block) => block.type === 'tool_result');
            if (toolResults.length > 0 && result.length > 0) {
                // Find the previous assistant message
                const prevAssistant = result[result.length - 1];
                if (prevAssistant.role === 'assistant' && Array.isArray(prevAssistant.content)) {
                    const toolUseIds = new Set(prevAssistant.content
                        .filter((b) => b.type === 'tool_use')
                        .map((b) => b.id));
                    // Filter out orphaned tool results
                    const validContent = msg.content.filter((block) => {
                        if (block.type === 'tool_result') {
                            return toolUseIds.has(block.tool_use_id);
                        }
                        return true;
                    });
                    if (validContent.length > 0) {
                        result.push({ ...msg, content: validContent });
                    }
                    continue;
                }
            }
        }
        result.push(msg);
    }
    return result;
}
/**
 * Strip images from messages (for compaction).
 */
export function stripImagesFromMessages(messages) {
    return messages.map((msg) => {
        if (typeof msg.content === 'string')
            return msg;
        if (!Array.isArray(msg.content))
            return msg;
        const filtered = msg.content.filter((block) => block.type !== 'image');
        return {
            ...msg,
            content: filtered.length > 0 ? filtered : '[content removed]',
        };
    });
}
/**
 * Extract text from message content blocks.
 */
export function extractTextFromContent(content) {
    if (typeof content === 'string')
        return content;
    return content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');
}
/**
 * Create a system message for compact boundary.
 */
export function createCompactBoundaryMessage() {
    return {
        role: 'user',
        content: '[Previous context has been summarized above. Continuing conversation.]',
    };
}
/**
 * Truncate text to max length with ellipsis.
 */
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    const half = Math.floor(maxLength / 2);
    return text.slice(0, half) + '\n...(truncated)...\n' + text.slice(-half);
}
//# sourceMappingURL=messages.js.map