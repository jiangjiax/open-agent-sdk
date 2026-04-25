/**
 * Cron/Scheduling Tools
 *
 * CronCreate, CronDelete, CronList - Schedule recurring tasks.
 * RemoteTrigger - Manage remote scheduled agent triggers.
 */
// In-memory cron store
const cronStore = new Map();
let cronCounter = 0;
/**
 * Get all cron jobs.
 */
export function getAllCronJobs() {
    return Array.from(cronStore.values());
}
/**
 * Clear all cron jobs.
 */
export function clearCronJobs() {
    cronStore.clear();
    cronCounter = 0;
}
export const CronCreateTool = {
    name: 'CronCreate',
    description: 'Create a scheduled recurring task (cron job). Supports cron expressions for scheduling.',
    inputSchema: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Job name' },
            schedule: { type: 'string', description: 'Cron expression (e.g., "*/5 * * * *" for every 5 minutes)' },
            command: { type: 'string', description: 'Command or prompt to execute' },
        },
        required: ['name', 'schedule', 'command'],
    },
    isReadOnly: () => false,
    isConcurrencySafe: () => true,
    isEnabled: () => true,
    async prompt() { return 'Create a scheduled cron job.'; },
    async call(input) {
        const id = `cron_${++cronCounter}`;
        const job = {
            id,
            name: input.name,
            schedule: input.schedule,
            command: input.command,
            enabled: true,
            createdAt: new Date().toISOString(),
        };
        cronStore.set(id, job);
        return {
            type: 'tool_result',
            tool_use_id: '',
            content: `Cron job created: ${id} "${job.name}" schedule="${job.schedule}"`,
        };
    },
};
export const CronDeleteTool = {
    name: 'CronDelete',
    description: 'Delete a scheduled cron job.',
    inputSchema: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'Cron job ID to delete' },
        },
        required: ['id'],
    },
    isReadOnly: () => false,
    isConcurrencySafe: () => true,
    isEnabled: () => true,
    async prompt() { return 'Delete a cron job.'; },
    async call(input) {
        if (!cronStore.has(input.id)) {
            return { type: 'tool_result', tool_use_id: '', content: `Cron job not found: ${input.id}`, is_error: true };
        }
        cronStore.delete(input.id);
        return { type: 'tool_result', tool_use_id: '', content: `Cron job deleted: ${input.id}` };
    },
};
export const CronListTool = {
    name: 'CronList',
    description: 'List all scheduled cron jobs.',
    inputSchema: { type: 'object', properties: {} },
    isReadOnly: () => true,
    isConcurrencySafe: () => true,
    isEnabled: () => true,
    async prompt() { return 'List cron jobs.'; },
    async call() {
        const jobs = getAllCronJobs();
        if (jobs.length === 0) {
            return { type: 'tool_result', tool_use_id: '', content: 'No cron jobs scheduled.' };
        }
        const lines = jobs.map(j => `[${j.id}] ${j.enabled ? '✓' : '✗'} "${j.name}" schedule="${j.schedule}" command="${j.command.slice(0, 50)}"`);
        return { type: 'tool_result', tool_use_id: '', content: lines.join('\n') };
    },
};
export const RemoteTriggerTool = {
    name: 'RemoteTrigger',
    description: 'Manage remote scheduled agent triggers. Supports list, get, create, update, and run operations.',
    inputSchema: {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['list', 'get', 'create', 'update', 'run'],
                description: 'Operation to perform',
            },
            id: { type: 'string', description: 'Trigger ID (for get/update/run)' },
            name: { type: 'string', description: 'Trigger name (for create)' },
            schedule: { type: 'string', description: 'Cron schedule (for create/update)' },
            prompt: { type: 'string', description: 'Agent prompt (for create/update)' },
        },
        required: ['action'],
    },
    isReadOnly: () => false,
    isConcurrencySafe: () => true,
    isEnabled: () => true,
    async prompt() { return 'Manage remote agent triggers.'; },
    async call(input) {
        // RemoteTrigger operations are typically handled by the remote backend
        // In standalone SDK mode, we provide a stub implementation
        return {
            type: 'tool_result',
            tool_use_id: '',
            content: `RemoteTrigger ${input.action}: This feature requires a connected remote backend. In standalone SDK mode, use CronCreate/CronList/CronDelete for local scheduling.`,
        };
    },
};
//# sourceMappingURL=cron-tools.js.map