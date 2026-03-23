import type {
  ScanOptions,
  ToolScoringOutput,
  ScoringResult,
} from '@aiready/core';

export type { ToolScoringOutput, ScoringResult };

/**
 * Options for running a unified AI-readiness analysis across multiple tools.
 * Extends base ScanOptions with CLI-specific configurations.
 */
export interface UnifiedAnalysisOptions extends ScanOptions {
  /** Root directory for analysis */
  rootDir: string;
  /** List of tools to run (e.g. ['patterns', 'context']) */
  tools?: string[];
  /** Overrides for specific tool configurations */
  toolConfigs?: Record<string, any>;
  /** Minimum similarity threshold for pattern detection (0-1) */
  minSimilarity?: number;
  /** Minimum number of lines for a pattern to be considered */
  minLines?: number;
  /** Maximum number of candidates to check per code block */
  maxCandidatesPerBlock?: number;
  /** Minimum number of shared tokens for a match */
  minSharedTokens?: number;
  /** Whether to use optimized defaults based on project size/language */
  useSmartDefaults?: boolean;
  /** Specific options for naming consistency analysis */
  consistency?: any;
  /** Optional callback for tracking analysis progress */
  progressCallback?: (event: {
    tool: string;
    data?: any;
    processed?: number;
    total?: number;
    message?: string;
  }) => void;
  /** Files or directories to include in scan */
  include?: string[];
  /** Files or directories to exclude from scan */
  exclude?: string[];
  /** Batch size for comparisons */
  batchSize?: number;
}

/**
 * The consolidated result of a unified analysis across all requested tools.
 * Contains tool-specific outputs, scoring, and a high-level summary.
 */
export interface UnifiedAnalysisResult {
  // Dynamic keys based on ToolName
  [key: string]: any;

  summary: {
    totalFiles: number;
    totalIssues: number;
    criticalIssues: number;
    majorIssues: number;
    toolsRun: string[];
    executionTime: number;
    config?: any;
    toolConfigs?: Record<string, any>;
  };
  scoring?: ScoringResult;
}
