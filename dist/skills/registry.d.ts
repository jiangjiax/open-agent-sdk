/**
 * Skill Registry
 *
 * Central registry for managing skill definitions.
 * Skills can be registered programmatically or loaded from bundled definitions.
 */
import type { SkillDefinition } from './types.js';
/**
 * Register a skill definition.
 */
export declare function registerSkill(definition: SkillDefinition): void;
/**
 * Get a skill by name or alias.
 */
export declare function getSkill(name: string): SkillDefinition | undefined;
/**
 * Get all registered skills.
 */
export declare function getAllSkills(): SkillDefinition[];
/**
 * Get all user-invocable skills (for /command listing).
 */
export declare function getUserInvocableSkills(): SkillDefinition[];
/**
 * Check if a skill exists.
 */
export declare function hasSkill(name: string): boolean;
/**
 * Remove a skill.
 */
export declare function unregisterSkill(name: string): boolean;
/**
 * Clear all skills (for testing).
 */
export declare function clearSkills(): void;
/**
 * Format skills listing for system prompt injection.
 *
 * Uses a budget system: skills listing gets a limited character budget
 * to avoid bloating the context window.
 */
export declare function formatSkillsForPrompt(contextWindowTokens?: number): string;
//# sourceMappingURL=registry.d.ts.map