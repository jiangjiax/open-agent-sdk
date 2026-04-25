/**
 * System & User Context
 *
 * Builds context for the system prompt:
 * - Git status injection (branch, commits, status)
 * - AGENT.md / project context discovery and injection
 * - Working directory info
 * - Date injection
 */
/**
 * Get git status info for system prompt.
 * Memoized per cwd (cleared on new session).
 */
export declare function getGitStatus(cwd: string): Promise<string>;
/**
 * Discover project context files (AGENT.md, CLAUDE.md) in the project.
 */
export declare function discoverProjectContextFiles(cwd: string): Promise<string[]>;
/**
 * Read project context file content from discovered files.
 */
export declare function readProjectContextContent(cwd: string): Promise<string>;
/**
 * Get system context for the system prompt.
 */
export declare function getSystemContext(cwd: string): Promise<string>;
/**
 * Get user context (AGENT.md, date, etc).
 */
export declare function getUserContext(cwd: string): Promise<string>;
/**
 * Clear memoized context (call between sessions).
 */
export declare function clearContextCache(): void;
//# sourceMappingURL=context.d.ts.map