/**
 * SendMessageTool - Inter-agent messaging
 *
 * Supports plain text and structured protocol messages
 * between teammates in a multi-agent setup.
 */
import type { ToolDefinition } from '../types.js';
/**
 * Message inbox for inter-agent communication.
 */
export interface AgentMessage {
    from: string;
    to: string;
    content: string;
    timestamp: string;
    type: 'text' | 'shutdown_request' | 'shutdown_response' | 'plan_approval_response';
}
/**
 * Read messages from a mailbox.
 */
export declare function readMailbox(agentName: string): AgentMessage[];
/**
 * Write to a mailbox.
 */
export declare function writeToMailbox(agentName: string, message: AgentMessage): void;
/**
 * Clear all mailboxes.
 */
export declare function clearMailboxes(): void;
export declare const SendMessageTool: ToolDefinition;
//# sourceMappingURL=send-message.d.ts.map