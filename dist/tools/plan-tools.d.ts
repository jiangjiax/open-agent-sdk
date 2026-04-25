/**
 * Plan Mode Tools
 *
 * EnterPlanMode / ExitPlanMode - Structured planning workflow.
 * Allows the agent to enter a design/planning phase before execution.
 */
import type { ToolDefinition } from '../types.js';
export declare function isPlanModeActive(): boolean;
export declare function getCurrentPlan(): string | null;
export declare const EnterPlanModeTool: ToolDefinition;
export declare const ExitPlanModeTool: ToolDefinition;
//# sourceMappingURL=plan-tools.d.ts.map