/**
 * MCP Resource Tools
 *
 * ListMcpResources / ReadMcpResource - Access resources from MCP servers.
 */
import type { ToolDefinition } from '../types.js';
import type { MCPConnection } from '../mcp/client.js';
/**
 * Set MCP connections for resource access.
 */
export declare function setMcpConnections(connections: MCPConnection[]): void;
export declare const ListMcpResourcesTool: ToolDefinition;
export declare const ReadMcpResourceTool: ToolDefinition;
//# sourceMappingURL=mcp-resource-tools.d.ts.map