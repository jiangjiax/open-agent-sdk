/**
 * ConfigTool - Dynamic configuration management
 *
 * Get/set global configuration and session settings.
 */
import type { ToolDefinition } from '../types.js';
/**
 * Get a config value.
 */
export declare function getConfig(key: string): unknown;
/**
 * Set a config value.
 */
export declare function setConfig(key: string, value: unknown): void;
/**
 * Clear all config.
 */
export declare function clearConfig(): void;
export declare const ConfigTool: ToolDefinition;
//# sourceMappingURL=config-tool.d.ts.map