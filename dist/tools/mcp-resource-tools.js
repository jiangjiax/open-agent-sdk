/**
 * MCP Resource Tools
 *
 * ListMcpResources / ReadMcpResource - Access resources from MCP servers.
 */
// Registry of MCP connections (set by the agent)
let mcpConnections = [];
/**
 * Set MCP connections for resource access.
 */
export function setMcpConnections(connections) {
    mcpConnections = connections;
}
export const ListMcpResourcesTool = {
    name: 'ListMcpResources',
    description: 'List available resources from connected MCP servers. Resources can include files, databases, and other data sources.',
    inputSchema: {
        type: 'object',
        properties: {
            server: { type: 'string', description: 'Filter by MCP server name' },
        },
    },
    isReadOnly: () => true,
    isConcurrencySafe: () => true,
    isEnabled: () => true,
    async prompt() { return 'List MCP resources.'; },
    async call(input) {
        const connections = input.server
            ? mcpConnections.filter(c => c.name === input.server)
            : mcpConnections;
        if (connections.length === 0) {
            return {
                type: 'tool_result',
                tool_use_id: '',
                content: 'No MCP servers connected.',
            };
        }
        const results = [];
        for (const conn of connections) {
            if (conn.status !== 'connected')
                continue;
            try {
                // Access the underlying client to list resources
                const resources = conn._client?.listResources?.();
                if (resources) {
                    results.push(`Server: ${conn.name}`);
                    for (const r of resources) {
                        results.push(`  - ${r.name}: ${r.description || r.uri || ''}`);
                    }
                }
                else {
                    results.push(`Server: ${conn.name} (${conn.tools.length} tools available)`);
                }
            }
            catch {
                results.push(`Server: ${conn.name} (resource listing not supported)`);
            }
        }
        return {
            type: 'tool_result',
            tool_use_id: '',
            content: results.join('\n') || 'No resources found.',
        };
    },
};
export const ReadMcpResourceTool = {
    name: 'ReadMcpResource',
    description: 'Read a specific resource from an MCP server.',
    inputSchema: {
        type: 'object',
        properties: {
            server: { type: 'string', description: 'MCP server name' },
            uri: { type: 'string', description: 'Resource URI to read' },
        },
        required: ['server', 'uri'],
    },
    isReadOnly: () => true,
    isConcurrencySafe: () => true,
    isEnabled: () => true,
    async prompt() { return 'Read an MCP resource.'; },
    async call(input) {
        const conn = mcpConnections.find(c => c.name === input.server);
        if (!conn) {
            return {
                type: 'tool_result',
                tool_use_id: '',
                content: `MCP server not found: ${input.server}`,
                is_error: true,
            };
        }
        try {
            const result = await conn._client?.readResource?.({ uri: input.uri });
            if (result?.contents) {
                const texts = result.contents.map((c) => c.text || JSON.stringify(c)).join('\n');
                return {
                    type: 'tool_result',
                    tool_use_id: '',
                    content: texts,
                };
            }
            return {
                type: 'tool_result',
                tool_use_id: '',
                content: 'Resource read returned no content.',
            };
        }
        catch (err) {
            return {
                type: 'tool_result',
                tool_use_id: '',
                content: `Error reading resource: ${err.message}`,
                is_error: true,
            };
        }
    },
};
//# sourceMappingURL=mcp-resource-tools.js.map