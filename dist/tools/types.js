/**
 * Tool interface and helper utilities
 */
/**
 * Helper to create a tool definition with sensible defaults.
 */
export function defineTool(config) {
    return {
        name: config.name,
        description: config.description,
        inputSchema: config.inputSchema,
        isReadOnly: () => config.isReadOnly ?? false,
        isConcurrencySafe: () => config.isConcurrencySafe ?? false,
        isEnabled: () => true,
        prompt: typeof config.prompt === 'function'
            ? config.prompt
            : async (_context) => config.prompt ?? config.description,
        async call(input, context) {
            try {
                const result = await config.call(input, context);
                const output = typeof result === 'string' ? result : result.data;
                const isError = typeof result === 'object' && result.is_error;
                return {
                    type: 'tool_result',
                    tool_use_id: '', // filled by engine
                    content: output,
                    is_error: isError || false,
                };
            }
            catch (err) {
                return {
                    type: 'tool_result',
                    tool_use_id: '',
                    content: `Error: ${err.message}`,
                    is_error: true,
                };
            }
        },
    };
}
/**
 * Convert a ToolDefinition to API-compatible tool format.
 * Returns the normalized tool format used by providers.
 */
export function toApiTool(tool) {
    return {
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
    };
}
//# sourceMappingURL=types.js.map