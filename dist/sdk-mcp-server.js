/**
 * In-Process MCP Server
 *
 * createSdkMcpServer() creates an in-process MCP server from tool() definitions.
 * Compatible with open-agent-sdk's createSdkMcpServer().
 *
 * Usage:
 *   import { tool, createSdkMcpServer } from 'open-agent-sdk'
 *   import { z } from 'zod'
 *
 *   const weatherTool = tool('get_weather', 'Get weather', { city: z.string() },
 *     async ({ city }) => ({ content: [{ type: 'text', text: `22°C in ${city}` }] })
 *   )
 *
 *   const server = createSdkMcpServer({
 *     name: 'weather',
 *     tools: [weatherTool],
 *   })
 *
 *   // Use as MCP server config:
 *   const agent = createAgent({
 *     mcpServers: { weather: server },
 *   })
 */
import { sdkToolToToolDefinition } from './tool-helper.js';
/**
 * Create an in-process MCP server from tool definitions.
 *
 * The server runs in the same process as the agent, avoiding
 * subprocess overhead. Tools are directly callable.
 */
export function createSdkMcpServer(options) {
    const sdkTools = options.tools || [];
    // Convert SDK tools to engine-compatible tool definitions
    // Prefix tool names with mcp__{server_name}__ for namespace isolation
    const toolDefinitions = sdkTools.map((sdkTool) => {
        const toolDef = sdkToolToToolDefinition(sdkTool);
        return {
            ...toolDef,
            name: `mcp__${options.name}__${sdkTool.name}`,
        };
    });
    return {
        type: 'sdk',
        name: options.name,
        version: options.version || '1.0.0',
        tools: toolDefinitions,
        _sdkTools: sdkTools,
    };
}
/**
 * Check if a server config is an in-process SDK server.
 */
export function isSdkServerConfig(config) {
    return config?.type === 'sdk' && Array.isArray(config.tools);
}
//# sourceMappingURL=sdk-mcp-server.js.map