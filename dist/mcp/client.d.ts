/**
 * MCP Client - Connect to Model Context Protocol servers
 */
import type { ToolDefinition, McpServerConfig } from '../types.js';
export interface MCPConnection {
    name: string;
    status: 'connected' | 'disconnected' | 'error';
    tools: ToolDefinition[];
    close: () => Promise<void>;
}
/**
 * Connect to an MCP server and fetch its tools.
 */
export declare function connectMCPServer(name: string, config: McpServerConfig): Promise<MCPConnection>;
/**
 * Close all MCP connections.
 */
export declare function closeAllConnections(connections: MCPConnection[]): Promise<void>;
//# sourceMappingURL=client.d.ts.map