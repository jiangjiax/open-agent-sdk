/**
 * TodoWriteTool - Session todo/checklist management
 *
 * Manages a session-scoped todo list for tracking work items.
 */
import type { ToolDefinition } from '../types.js';
export interface TodoItem {
    id: number;
    text: string;
    done: boolean;
    priority?: 'high' | 'medium' | 'low';
}
/**
 * Get all todos.
 */
export declare function getTodos(): TodoItem[];
/**
 * Clear all todos.
 */
export declare function clearTodos(): void;
export declare const TodoWriteTool: ToolDefinition;
//# sourceMappingURL=todo-tool.d.ts.map