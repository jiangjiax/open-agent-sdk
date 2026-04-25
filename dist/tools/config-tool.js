/**
 * ConfigTool - Dynamic configuration management
 *
 * Get/set global configuration and session settings.
 */
// In-memory config store
const configStore = new Map();
/**
 * Get a config value.
 */
export function getConfig(key) {
    return configStore.get(key);
}
/**
 * Set a config value.
 */
export function setConfig(key, value) {
    configStore.set(key, value);
}
/**
 * Clear all config.
 */
export function clearConfig() {
    configStore.clear();
}
export const ConfigTool = {
    name: 'Config',
    description: 'Get or set configuration values. Supports session-scoped settings.',
    inputSchema: {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['get', 'set', 'list'],
                description: 'Operation to perform',
            },
            key: { type: 'string', description: 'Config key' },
            value: { description: 'Config value (for set)' },
        },
        required: ['action'],
    },
    isReadOnly: () => false,
    isConcurrencySafe: () => true,
    isEnabled: () => true,
    async prompt() { return 'Manage configuration settings.'; },
    async call(input) {
        switch (input.action) {
            case 'get': {
                if (!input.key) {
                    return { type: 'tool_result', tool_use_id: '', content: 'key required for get', is_error: true };
                }
                const value = configStore.get(input.key);
                return {
                    type: 'tool_result',
                    tool_use_id: '',
                    content: value !== undefined ? JSON.stringify(value) : `Config key "${input.key}" not found`,
                };
            }
            case 'set': {
                if (!input.key) {
                    return { type: 'tool_result', tool_use_id: '', content: 'key required for set', is_error: true };
                }
                configStore.set(input.key, input.value);
                return {
                    type: 'tool_result',
                    tool_use_id: '',
                    content: `Config set: ${input.key} = ${JSON.stringify(input.value)}`,
                };
            }
            case 'list': {
                const entries = Array.from(configStore.entries());
                if (entries.length === 0) {
                    return { type: 'tool_result', tool_use_id: '', content: 'No config values set.' };
                }
                const lines = entries.map(([k, v]) => `${k} = ${JSON.stringify(v)}`);
                return { type: 'tool_result', tool_use_id: '', content: lines.join('\n') };
            }
            default:
                return { type: 'tool_result', tool_use_id: '', content: `Unknown action: ${input.action}`, is_error: true };
        }
    },
};
//# sourceMappingURL=config-tool.js.map