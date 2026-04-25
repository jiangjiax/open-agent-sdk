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
import type { SdkMcpToolDefinition } from './tool-helper.js';
import type { ToolDefinition } from './types.js';
/**
 * SDK MCP server config that includes the in-process server instance.
 */
export interface McpSdkServerConfig {
    type: 'sdk';
    name: string;
    version: string;
    tools: ToolDefinition[];
    _sdkTools: SdkMcpToolDefinition<any>[];
}
/**
 * Create an in-process MCP server from tool definitions.
 *
 * The server runs in the same process as the agent, avoiding
 * subprocess overhead. Tools are directly callable.
 */
export declare function createSdkMcpServer(options: {
    name: string;
    version?: string;
    tools?: SdkMcpToolDefinition<any>[];
}): McpSdkServerConfig;
/**
 * Check if a server config is an in-process SDK server.
 */
export declare function isSdkServerConfig(config: any): config is McpSdkServerConfig;
//# sourceMappingURL=sdk-mcp-server.d.ts.map