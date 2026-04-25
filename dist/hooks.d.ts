/**
 * Hook System
 *
 * Lifecycle hooks for intercepting agent behavior.
 * Supports pre/post tool use, session lifecycle, and custom events.
 *
 * Hook events:
 * - PreToolUse: before tool execution
 * - PostToolUse: after tool execution
 * - PostToolUseFailure: after tool failure
 * - SessionStart: session initialization
 * - SessionEnd: session cleanup
 * - Stop: when turn completes
 * - SubagentStart: subagent spawned
 * - SubagentStop: subagent completed
 * - UserPromptSubmit: user sends message
 * - PermissionRequest: permission check triggered
 * - TaskCreated: task created
 * - TaskCompleted: task finished
 * - ConfigChange: settings changed
 * - CwdChanged: working directory changed
 * - FileChanged: file modified
 * - Notification: system notification
 */
/**
 * All supported hook events.
 */
export declare const HOOK_EVENTS: readonly ["PreToolUse", "PostToolUse", "PostToolUseFailure", "SessionStart", "SessionEnd", "Stop", "SubagentStart", "SubagentStop", "UserPromptSubmit", "PermissionRequest", "PermissionDenied", "TaskCreated", "TaskCompleted", "ConfigChange", "CwdChanged", "FileChanged", "Notification", "PreCompact", "PostCompact", "TeammateIdle"];
export type HookEvent = typeof HOOK_EVENTS[number];
/**
 * Hook definition.
 */
export interface HookDefinition {
    /** Shell command or function to execute */
    command?: string;
    /** Function handler */
    handler?: (input: HookInput) => Promise<HookOutput | void>;
    /** Tool name matcher (regex pattern) */
    matcher?: string;
    /** Timeout in milliseconds */
    timeout?: number;
}
/**
 * Hook input passed to handlers.
 */
export interface HookInput {
    event: HookEvent;
    toolName?: string;
    toolInput?: unknown;
    toolOutput?: unknown;
    toolUseId?: string;
    sessionId?: string;
    cwd?: string;
    error?: string;
    [key: string]: unknown;
}
/**
 * Hook output returned by handlers.
 */
export interface HookOutput {
    /** Message to append to conversation */
    message?: string;
    /** Permission update */
    permissionUpdate?: {
        tool: string;
        behavior: 'allow' | 'deny';
    };
    /** Whether to block the action */
    block?: boolean;
    /** Notification */
    notification?: {
        title: string;
        body: string;
        level?: 'info' | 'warning' | 'error';
    };
}
/**
 * Hook configuration (from settings).
 */
export type HookConfig = Record<string, HookDefinition[]>;
/**
 * Hook registry for managing and executing hooks.
 */
export declare class HookRegistry {
    private hooks;
    /**
     * Register hooks from configuration.
     */
    registerFromConfig(config: HookConfig): void;
    /**
     * Register a single hook.
     */
    register(event: HookEvent, definition: HookDefinition): void;
    /**
     * Execute hooks for an event.
     */
    execute(event: HookEvent, input: HookInput): Promise<HookOutput[]>;
    /**
     * Check if any hooks are registered for an event.
     */
    hasHooks(event: HookEvent): boolean;
    /**
     * Clear all hooks.
     */
    clear(): void;
}
/**
 * Create a default hook registry.
 */
export declare function createHookRegistry(config?: HookConfig): HookRegistry;
//# sourceMappingURL=hooks.d.ts.map