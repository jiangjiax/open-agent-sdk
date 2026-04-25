/**
 * MCP Client - Connect to Model Context Protocol servers
 */
/**
 * Connect to an MCP server and fetch its tools.
 */
export async function connectMCPServer(name, config) {
    try {
        const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
        let transport;
        if (!config.type || config.type === 'stdio') {
            const stdioConfig = config;
            const { StdioClientTransport } = await import('@modelcontextprotocol/sdk/client/stdio.js');
            transport = new StdioClientTransport({
                command: stdioConfig.command,
                args: stdioConfig.args || [],
                env: { ...process.env, ...stdioConfig.env },
            });
        }
        else if (config.type === 'sse') {
            const sseConfig = config;
            const { SSEClientTransport } = await import('@modelcontextprotocol/sdk/client/sse.js');
            transport = new SSEClientTransport(new URL(sseConfig.url), {
                requestInit: sseConfig.headers ? { headers: sseConfig.headers } : undefined,
            });
        }
        else if (config.type === 'http') {
            const httpConfig = config;
            const { StreamableHTTPClientTransport } = await import('@modelcontextprotocol/sdk/client/streamableHttp.js');
            transport = new StreamableHTTPClientTransport(new URL(httpConfig.url), {
                requestInit: httpConfig.headers ? { headers: httpConfig.headers } : undefined,
            });
        }
        else {
            throw new Error(`Unsupported MCP transport type: ${config.type}`);
        }
        const client = new Client({ name: `agent-sdk-${name}`, version: '1.0.0' }, { capabilities: {} });
        await client.connect(transport);
        // Fetch available tools
        const toolList = await client.listTools();
        const tools = (toolList.tools || []).map((mcpTool) => createMCPToolDefinition(name, mcpTool, client));
        return {
            name,
            status: 'connected',
            tools,
            async close() {
                try {
                    await client.close();
                }
                catch {
                    // ignore close errors
                }
            },
        };
    }
    catch (err) {
        console.error(`[MCP] Failed to connect to "${name}": ${err.message}`);
        return {
            name,
            status: 'error',
            tools: [],
            async close() { },
        };
    }
}
/**
 * Create a ToolDefinition wrapping an MCP server tool.
 */
function createMCPToolDefinition(serverName, mcpTool, client) {
    const toolName = `mcp__${serverName}__${mcpTool.name}`;
    return {
        name: toolName,
        description: mcpTool.description || `MCP tool: ${mcpTool.name} from ${serverName}`,
        inputSchema: mcpTool.inputSchema || { type: 'object', properties: {} },
        isReadOnly: () => false,
        isConcurrencySafe: () => false,
        isEnabled: () => true,
        async prompt() {
            return mcpTool.description || '';
        },
        async call(input) {
            try {
                const result = await client.callTool({
                    name: mcpTool.name,
                    arguments: input,
                });
                // Extract text content from MCP result
                let output = '';
                if (result.content) {
                    for (const block of result.content) {
                        if (block.type === 'text') {
                            output += block.text;
                        }
                        else {
                            output += JSON.stringify(block);
                        }
                    }
                }
                else {
                    output = JSON.stringify(result);
                }
                return {
                    type: 'tool_result',
                    tool_use_id: '',
                    content: output,
                    is_error: result.isError || false,
                };
            }
            catch (err) {
                return {
                    type: 'tool_result',
                    tool_use_id: '',
                    content: `MCP tool error: ${err.message}`,
                    is_error: true,
                };
            }
        },
    };
}
/**
 * Close all MCP connections.
 */
export async function closeAllConnections(connections) {
    await Promise.allSettled(connections.map((c) => c.close()));
}
//# sourceMappingURL=client.js.map