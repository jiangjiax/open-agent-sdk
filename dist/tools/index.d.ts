/**
 * Tool Registry - All built-in tool definitions
 *
 * 30+ tools covering file I/O, execution, search, web, agents,
 * tasks, teams, messaging, worktree, planning, scheduling, and more.
 */
import type { ToolDefinition } from '../types.js';
import { BashTool } from './bash.js';
import { FileReadTool } from './read.js';
import { FileWriteTool } from './write.js';
import { FileEditTool } from './edit.js';
import { GlobTool } from './glob.js';
import { GrepTool } from './grep.js';
import { NotebookEditTool } from './notebook-edit.js';
import { WebFetchTool } from './web-fetch.js';
import { WebSearchTool } from './web-search.js';
import { AgentTool } from './agent-tool.js';
import { SendMessageTool } from './send-message.js';
import { TeamCreateTool, TeamDeleteTool } from './team-tools.js';
import { TaskCreateTool, TaskListTool, TaskUpdateTool, TaskGetTool, TaskStopTool, TaskOutputTool } from './task-tools.js';
import { EnterWorktreeTool, ExitWorktreeTool } from './worktree-tools.js';
import { EnterPlanModeTool, ExitPlanModeTool } from './plan-tools.js';
import { AskUserQuestionTool } from './ask-user.js';
import { ToolSearchTool } from './tool-search.js';
import { ListMcpResourcesTool, ReadMcpResourceTool } from './mcp-resource-tools.js';
import { CronCreateTool, CronDeleteTool, CronListTool, RemoteTriggerTool } from './cron-tools.js';
import { LSPTool } from './lsp-tool.js';
import { ConfigTool } from './config-tool.js';
import { TodoWriteTool } from './todo-tool.js';
import { SkillTool } from './skill-tool.js';
/**
 * Get all built-in tools.
 */
export declare function getAllBaseTools(): ToolDefinition[];
/**
 * Filter tools by allowed/disallowed lists.
 */
export declare function filterTools(tools: ToolDefinition[], allowedTools?: string[], disallowedTools?: string[]): ToolDefinition[];
/**
 * Assemble tool pool: base tools + MCP tools, with deduplication.
 */
export declare function assembleToolPool(baseTools: ToolDefinition[], mcpTools?: ToolDefinition[], allowedTools?: string[], disallowedTools?: string[]): ToolDefinition[];
export { BashTool, FileReadTool, FileWriteTool, FileEditTool, GlobTool, GrepTool, NotebookEditTool, WebFetchTool, WebSearchTool, AgentTool, SendMessageTool, TeamCreateTool, TeamDeleteTool, TaskCreateTool, TaskListTool, TaskUpdateTool, TaskGetTool, TaskStopTool, TaskOutputTool, EnterWorktreeTool, ExitWorktreeTool, EnterPlanModeTool, ExitPlanModeTool, AskUserQuestionTool, ToolSearchTool, ListMcpResourcesTool, ReadMcpResourceTool, CronCreateTool, CronDeleteTool, CronListTool, RemoteTriggerTool, LSPTool, ConfigTool, TodoWriteTool, SkillTool, };
export { defineTool, toApiTool } from './types.js';
//# sourceMappingURL=index.d.ts.map