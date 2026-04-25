/**
 * tool() helper - Create tools using Zod schemas
 *
 * Compatible with open-agent-sdk's tool() function.
 *
 * Usage:
 *   import { tool } from 'open-agent-sdk'
 *   import { z } from 'zod'
 *
 *   const weatherTool = tool(
 *     'get_weather',
 *     'Get weather for a city',
 *     { city: z.string().describe('City name') },
 *     async ({ city }) => {
 *       return { content: [{ type: 'text', text: `Weather in ${city}: 22°C` }] }
 *     }
 *   )
 */
import { z, type ZodRawShape, type ZodObject } from 'zod';
import type { ToolDefinition } from './types.js';
/**
 * Tool annotations (MCP standard).
 */
export interface ToolAnnotations {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
}
/**
 * Tool call result (MCP-compatible).
 */
export interface CallToolResult {
    content: Array<{
        type: 'text';
        text: string;
    } | {
        type: 'image';
        data: string;
        mimeType: string;
    } | {
        type: 'resource';
        resource: {
            uri: string;
            text?: string;
            blob?: string;
        };
    }>;
    isError?: boolean;
}
/**
 * SDK MCP tool definition.
 */
export interface SdkMcpToolDefinition<T extends ZodRawShape = ZodRawShape> {
    name: string;
    description: string;
    inputSchema: ZodObject<T>;
    handler: (args: z.infer<ZodObject<T>>, extra: unknown) => Promise<CallToolResult>;
    annotations?: ToolAnnotations;
}
/**
 * Create a tool using Zod schema.
 *
 * Compatible with open-agent-sdk's tool() function.
 */
export declare function tool<T extends ZodRawShape>(name: string, description: string, inputSchema: T, handler: (args: z.infer<ZodObject<T>>, extra: unknown) => Promise<CallToolResult>, extras?: {
    annotations?: ToolAnnotations;
}): SdkMcpToolDefinition<T>;
/**
 * Convert an SdkMcpToolDefinition to a ToolDefinition for the engine.
 */
export declare function sdkToolToToolDefinition(sdkTool: SdkMcpToolDefinition<any>): ToolDefinition;
//# sourceMappingURL=tool-helper.d.ts.map