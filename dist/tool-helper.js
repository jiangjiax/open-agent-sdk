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
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
/**
 * Create a tool using Zod schema.
 *
 * Compatible with open-agent-sdk's tool() function.
 */
export function tool(name, description, inputSchema, handler, extras) {
    return {
        name,
        description,
        inputSchema: z.object(inputSchema),
        handler,
        annotations: extras?.annotations,
    };
}
/**
 * Convert an SdkMcpToolDefinition to a ToolDefinition for the engine.
 */
export function sdkToolToToolDefinition(sdkTool) {
    const jsonSchema = zodToJsonSchema(sdkTool.inputSchema, { target: 'openApi3' });
    return {
        name: sdkTool.name,
        description: sdkTool.description,
        inputSchema: {
            type: 'object',
            properties: jsonSchema.properties || {},
            required: jsonSchema.required || [],
        },
        isReadOnly: () => sdkTool.annotations?.readOnlyHint ?? false,
        isConcurrencySafe: () => sdkTool.annotations?.readOnlyHint ?? false,
        isEnabled: () => true,
        async prompt() { return sdkTool.description; },
        async call(input, _context) {
            try {
                const parsed = sdkTool.inputSchema.parse(input);
                const result = await sdkTool.handler(parsed, {});
                // Convert MCP content blocks to string
                const text = result.content
                    .map((block) => {
                    if (block.type === 'text')
                        return block.text;
                    if (block.type === 'image')
                        return `[Image: ${block.mimeType}]`;
                    if (block.type === 'resource')
                        return block.resource.text || `[Resource: ${block.resource.uri}]`;
                    return JSON.stringify(block);
                })
                    .join('\n');
                return {
                    type: 'tool_result',
                    tool_use_id: '',
                    content: text,
                    is_error: result.isError || false,
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
//# sourceMappingURL=tool-helper.js.map