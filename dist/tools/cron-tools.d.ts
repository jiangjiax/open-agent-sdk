/**
 * Cron/Scheduling Tools
 *
 * CronCreate, CronDelete, CronList - Schedule recurring tasks.
 * RemoteTrigger - Manage remote scheduled agent triggers.
 */
import type { ToolDefinition } from '../types.js';
/**
 * Cron job definition.
 */
export interface CronJob {
    id: string;
    name: string;
    schedule: string;
    command: string;
    enabled: boolean;
    createdAt: string;
    lastRunAt?: string;
    nextRunAt?: string;
}
/**
 * Get all cron jobs.
 */
export declare function getAllCronJobs(): CronJob[];
/**
 * Clear all cron jobs.
 */
export declare function clearCronJobs(): void;
export declare const CronCreateTool: ToolDefinition;
export declare const CronDeleteTool: ToolDefinition;
export declare const CronListTool: ToolDefinition;
export declare const RemoteTriggerTool: ToolDefinition;
//# sourceMappingURL=cron-tools.d.ts.map