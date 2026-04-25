/**
 * Session Storage & Management
 *
 * Persists conversation transcripts to disk for resumption.
 * Manages session lifecycle (create, resume, list, fork).
 */
import type { NormalizedMessageParam } from './providers/types.js';
/**
 * Session metadata.
 */
export interface SessionMetadata {
    id: string;
    cwd: string;
    model: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
    summary?: string;
}
/**
 * Session data on disk.
 */
export interface SessionData {
    metadata: SessionMetadata;
    messages: NormalizedMessageParam[];
}
/**
 * Save session to disk.
 */
export declare function saveSession(sessionId: string, messages: NormalizedMessageParam[], metadata: Partial<SessionMetadata>): Promise<void>;
/**
 * Load session from disk.
 */
export declare function loadSession(sessionId: string): Promise<SessionData | null>;
/**
 * List all sessions.
 */
export declare function listSessions(): Promise<SessionMetadata[]>;
/**
 * Fork a session (create a copy with a new ID).
 */
export declare function forkSession(sourceSessionId: string, newSessionId?: string): Promise<string | null>;
/**
 * Get session messages.
 */
export declare function getSessionMessages(sessionId: string): Promise<NormalizedMessageParam[]>;
/**
 * Append a message to a session transcript.
 */
export declare function appendToSession(sessionId: string, message: NormalizedMessageParam): Promise<void>;
/**
 * Delete a session.
 */
export declare function deleteSession(sessionId: string): Promise<boolean>;
/**
 * Get info about a specific session.
 */
export declare function getSessionInfo(sessionId: string, options?: {
    dir?: string;
}): Promise<SessionMetadata | null>;
/**
 * Rename a session.
 */
export declare function renameSession(sessionId: string, title: string, options?: {
    dir?: string;
}): Promise<void>;
/**
 * Tag a session.
 */
export declare function tagSession(sessionId: string, tag: string | null, options?: {
    dir?: string;
}): Promise<void>;
//# sourceMappingURL=session.d.ts.map