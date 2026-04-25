/**
 * AskUserQuestionTool - Interactive user questions
 *
 * In SDK mode, returns a permission_request event and waits
 * for the consumer to provide an answer.
 * In non-interactive mode, returns a default or denies.
 */
import type { ToolDefinition } from '../types.js';
/**
 * Set the question handler for AskUserQuestion.
 */
export declare function setQuestionHandler(handler: (question: string, options?: string[]) => Promise<string>): void;
/**
 * Clear the question handler.
 */
export declare function clearQuestionHandler(): void;
export declare const AskUserQuestionTool: ToolDefinition;
//# sourceMappingURL=ask-user.d.ts.map