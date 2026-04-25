/**
 * Team Management Tools
 *
 * TeamCreate, TeamDelete - Multi-agent team coordination.
 * Manages team composition, task lists, and inter-agent messaging.
 */
/**
 * Global team store.
 */
const teamStore = new Map();
let teamCounter = 0;
/**
 * Get all teams.
 */
export function getAllTeams() {
    return Array.from(teamStore.values());
}
/**
 * Get a team by ID.
 */
export function getTeam(id) {
    return teamStore.get(id);
}
/**
 * Clear all teams.
 */
export function clearTeams() {
    teamStore.clear();
    teamCounter = 0;
}
// ============================================================================
// TeamCreateTool
// ============================================================================
export const TeamCreateTool = {
    name: 'TeamCreate',
    description: 'Create a multi-agent team for coordinated work. Assigns a lead and manages member composition.',
    inputSchema: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Team name' },
            members: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of agent/teammate names',
            },
            task_description: { type: 'string', description: 'Description of the team\'s mission' },
        },
        required: ['name'],
    },
    isReadOnly: () => false,
    isConcurrencySafe: () => false,
    isEnabled: () => true,
    async prompt() { return 'Create a team for multi-agent coordination.'; },
    async call(input) {
        const id = `team_${++teamCounter}`;
        const team = {
            id,
            name: input.name,
            members: input.members || [],
            leaderId: 'self',
            createdAt: new Date().toISOString(),
            status: 'active',
        };
        teamStore.set(id, team);
        return {
            type: 'tool_result',
            tool_use_id: '',
            content: `Team created: ${id} "${team.name}" with ${team.members.length} members`,
        };
    },
};
// ============================================================================
// TeamDeleteTool
// ============================================================================
export const TeamDeleteTool = {
    name: 'TeamDelete',
    description: 'Disband a team and clean up resources.',
    inputSchema: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'Team ID to disband' },
        },
        required: ['id'],
    },
    isReadOnly: () => false,
    isConcurrencySafe: () => false,
    isEnabled: () => true,
    async prompt() { return 'Delete/disband a team.'; },
    async call(input) {
        const team = teamStore.get(input.id);
        if (!team) {
            return { type: 'tool_result', tool_use_id: '', content: `Team not found: ${input.id}`, is_error: true };
        }
        team.status = 'disbanded';
        teamStore.delete(input.id);
        return {
            type: 'tool_result',
            tool_use_id: '',
            content: `Team disbanded: ${team.name}`,
        };
    },
};
//# sourceMappingURL=team-tools.js.map