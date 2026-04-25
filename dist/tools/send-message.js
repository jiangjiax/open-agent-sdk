/**
 * SendMessageTool - Inter-agent messaging
 *
 * Supports plain text and structured protocol messages
 * between teammates in a multi-agent setup.
 */
const mailboxes = new Map();
/**
 * Read messages from a mailbox.
 */
export function readMailbox(agentName) {
    const messages = mailboxes.get(agentName) || [];
    mailboxes.set(agentName, []); // Clear after reading
    return messages;
}
/**
 * Write to a mailbox.
 */
export function writeToMailbox(agentName, message) {
    const messages = mailboxes.get(agentName) || [];
    messages.push(message);
    mailboxes.set(agentName, messages);
}
/**
 * Clear all mailboxes.
 */
export function clearMailboxes() {
    mailboxes.clear();
}
export const SendMessageTool = {
    name: 'SendMessage',
    description: 'Send a message to another agent or teammate. Supports plain text and structured protocol messages.',
    inputSchema: {
        type: 'object',
        properties: {
            to: { type: 'string', description: 'Recipient agent name or ID. Use "*" for broadcast.' },
            content: { type: 'string', description: 'Message content' },
            type: {
                type: 'string',
                enum: ['text', 'shutdown_request', 'shutdown_response', 'plan_approval_response'],
                description: 'Message type (default: text)',
            },
        },
        required: ['to', 'content'],
    },
    isReadOnly: () => false,
    isConcurrencySafe: () => true,
    isEnabled: () => true,
    async prompt() { return 'Send a message to another agent.'; },
    async call(input) {
        const message = {
            from: 'self',
            to: input.to,
            content: input.content,
            timestamp: new Date().toISOString(),
            type: input.type || 'text',
        };
        if (input.to === '*') {
            // Broadcast to all known mailboxes
            for (const [name] of mailboxes) {
                writeToMailbox(name, { ...message, to: name });
            }
            return {
                type: 'tool_result',
                tool_use_id: '',
                content: `Message broadcast to all agents`,
            };
        }
        writeToMailbox(input.to, message);
        return {
            type: 'tool_result',
            tool_use_id: '',
            content: `Message sent to ${input.to}`,
        };
    },
};
//# sourceMappingURL=send-message.js.map