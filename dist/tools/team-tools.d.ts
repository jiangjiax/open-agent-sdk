/**
 * Team Management Tools
 *
 * TeamCreate, TeamDelete - Multi-agent team coordination.
 * Manages team composition, task lists, and inter-agent messaging.
 */
import type { ToolDefinition } from '../types.js';
/**
 * Team definition.
 */
export interface Team {
    id: string;
    name: string;
    members: string[];
    leaderId: string;
    taskListId?: string;
    createdAt: string;
    status: 'active' | 'disbanded';
}
/**
 * Get all teams.
 */
export declare function getAllTeams(): Team[];
/**
 * Get a team by ID.
 */
export declare function getTeam(id: string): Team | undefined;
/**
 * Clear all teams.
 */
export declare function clearTeams(): void;
export declare const TeamCreateTool: ToolDefinition;
export declare const TeamDeleteTool: ToolDefinition;
//# sourceMappingURL=team-tools.d.ts.map