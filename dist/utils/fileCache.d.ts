/**
 * File State LRU Cache
 *
 * Bounded cache for file contents with path normalization.
 * Used to track file states for compaction diffs and
 * avoiding redundant reads.
 */
/**
 * Cached file state.
 */
export interface FileState {
    content: string;
    timestamp: number;
    offset?: number;
    limit?: number;
    isPartialView?: boolean;
}
/**
 * LRU file state cache with size limits.
 */
export declare class FileStateCache {
    private cache;
    private maxEntries;
    private maxSizeBytes;
    private currentSizeBytes;
    constructor(maxEntries?: number, maxSizeBytes?: number);
    /**
     * Normalize a file path for cache lookup.
     */
    private normalizePath;
    /**
     * Get a cached file state.
     */
    get(filePath: string): FileState | undefined;
    /**
     * Set a cached file state.
     */
    set(filePath: string, state: FileState): void;
    /**
     * Delete a cached entry.
     */
    delete(filePath: string): boolean;
    /**
     * Clear all cached entries.
     */
    clear(): void;
    /**
     * Get the number of cached entries.
     */
    get size(): number;
    /**
     * Get all cached file paths.
     */
    keys(): string[];
    /**
     * Clone the cache.
     */
    clone(): FileStateCache;
}
/**
 * Create a file state cache with default limits.
 */
export declare function createFileStateCache(maxEntries?: number, maxSizeBytes?: number): FileStateCache;
//# sourceMappingURL=fileCache.d.ts.map