/**
 * Configuration for skill build tooling
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Base paths
export const SKILLS_DIR = join(__dirname, '..');
export const BUILD_DIR = join(__dirname, '..');

// Skill configuration
export interface SkillConfig {
  name: string;
  title: string;
  description: string;
  skillDir: string;
  rulesDir: string;
  metadataFile: string;
  outputFile: string;
  sectionMap: Record<string, number>;
}

export const SKILL_CONFIG: SkillConfig = {
  name: 'aiready-best-practices',
  title: 'AIReady Best Practices',
  description: 'AI-friendly codebases',
  skillDir: join(SKILLS_DIR, 'aiready-best-practices'),
  rulesDir: join(SKILLS_DIR, 'aiready-best-practices/rules'),
  metadataFile: join(SKILLS_DIR, 'aiready-best-practices/metadata.json'),
  outputFile: join(SKILLS_DIR, 'aiready-best-practices/AGENTS.md'),
  sectionMap: {
    patterns: 1, // CRITICAL - Pattern Detection
    context: 2, // HIGH - Context Optimization
    consistency: 3, // MEDIUM - Consistency Checking
    signal: 4, // CRITICAL - AI Signal Clarity
    amplification: 5, // HIGH - Change Amplification
    grounding: 6, // HIGH - Agent Grounding
    testability: 7, // MEDIUM - Testability
    docs: 8, // MEDIUM - Documentation
    assessment: 9, // HIGH - Codebase Health Assessment
    deps: 10, // LOW - Dependencies
  },
};

// Exports for backwards compatibility
export const SKILL_DIR = SKILL_CONFIG.skillDir;
export const RULES_DIR = SKILL_CONFIG.rulesDir;
export const METADATA_FILE = SKILL_CONFIG.metadataFile;
export const OUTPUT_FILE = SKILL_CONFIG.outputFile;
export const SECTION_MAP = SKILL_CONFIG.sectionMap;
