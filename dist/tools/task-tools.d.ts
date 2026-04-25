/**
 * Task Management Tools
 *
 * TaskCreate, TaskList, TaskUpdate, TaskGet, TaskStop, TaskOutput
 *
 * Provides in-memory task tracking for agent coordination.
 * Tasks persist across turns within a session.
 */
import type { ToolDefinition } from '../types.js';
/**
 * Task status.
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
/**
 * Task entry.
 */
export interface Task {
    id: string;
    subject: string;
    description?: string;
    status: TaskStatus;
    owner?: string;
    createdAt: string;
    updatedAt: string;
    output?: string;
    blockedBy?: string[];
    blocks?: string[];
    metadata?: Record<string, unknown>;
}
/**
 * Get all tasks.
 */
export declare function getAllTasks(): Task[];
/**
 * Get a task by ID.
 */
export declare function getTask(id: string): Task | undefined;
/**
 * Clear all tasks (for session reset).
 */
export declare function clearTasks(): void;
export declare const TaskCreateTool: ToolDefinition;
export declare const TaskListTool: ToolDefinition;
export declare const TaskUpdateTool: ToolDefinition;
export declare const TaskGetTool: ToolDefinition;
export declare const TaskStopTool: ToolDefinition;
export declare const TaskOutputTool: ToolDefinition;
//# sourceMappingURL=task-tools.d.ts.map