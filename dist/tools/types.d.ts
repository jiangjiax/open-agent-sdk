/**
 * Tool interface and helper utilities
 */
import type { ToolDefinition, ToolInputSchema, ToolContext } from '../types.js';
/**
 * Helper to create a tool definition with sensible defaults.
 */
export declare function defineTool(config: {
    name: string;
    description: string;
    inputSchema: ToolInputSchema;
    call: (input: any, context: ToolContext) => Promise<string | {
        data: string;
        is_error?: boolean;
    }>;
    isReadOnly?: boolean;
    isConcurrencySafe?: boolean;
    prompt?: string | ((context: ToolContext) => Promise<string>);
}): ToolDefinition;
/**
 * Convert a ToolDefinition to API-compatible tool format.
 * Returns the normalized tool format used by providers.
 */
export declare function toApiTool(tool: ToolDefinition): {
    name: string;
    description: string;
    input_schema: ToolInputSchema;
};
//# sourceMappingURL=types.d.ts.map