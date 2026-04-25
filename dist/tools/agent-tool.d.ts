/**
 * AgentTool - Spawn subagents for parallel/delegated work
 *
 * Supports built-in agents (Explore, Plan) and custom agent definitions.
 * Agents run as nested query loops with their own context and tool sets.
 */
import type { ToolDefinition, AgentDefinition } from '../types.js';
/**
 * Register agent definitions for the AgentTool to use.
 */
export declare function registerAgents(agents: Record<string, AgentDefinition>): void;
/**
 * Clear registered agents.
 */
export declare function clearAgents(): void;
export declare const AgentTool: ToolDefinition;
//# sourceMappingURL=agent-tool.d.ts.map