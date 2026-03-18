import {
  ToolRegistry,
  ToolName,
  calculateOverallScore,
  calculateTokenBudget,
  GLOBAL_INFRA_OPTIONS,
  COMMON_FINE_TUNING_OPTIONS,
  initializeParsers,
} from '@aiready/core';
import type {
  ScanOptions,
  ToolScoringOutput,
  ScoringResult,
} from '@aiready/core';

// Pre-import all tool providers to ensure they are registered by default
import '@aiready/pattern-detect';
import '@aiready/context-analyzer';
import '@aiready/consistency';
import '@aiready/ai-signal-clarity';
import '@aiready/agent-grounding';
import '@aiready/testability';
import '@aiready/doc-drift';
import '@aiready/deps';
import '@aiready/change-amplification';

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

/**
 * Mapping between ToolName and @aiready/ package names.
 * Used for dynamic registration on-demand.
 */
const TOOL_PACKAGE_MAP: Record<string, string> = {
  [ToolName.PatternDetect]: '@aiready/pattern-detect',
  [ToolName.ContextAnalyzer]: '@aiready/context-analyzer',
  [ToolName.NamingConsistency]: '@aiready/consistency',
  [ToolName.AiSignalClarity]: '@aiready/ai-signal-clarity',
  [ToolName.AgentGrounding]: '@aiready/agent-grounding',
  [ToolName.TestabilityIndex]: '@aiready/testability',
  [ToolName.DocDrift]: '@aiready/doc-drift',
  [ToolName.DependencyHealth]: '@aiready/deps',
  [ToolName.ChangeAmplification]: '@aiready/change-amplification',
  // Aliases handled by registry
  patterns: '@aiready/pattern-detect',
  duplicates: '@aiready/pattern-detect',
  context: '@aiready/context-analyzer',
  fragmentation: '@aiready/context-analyzer',
  consistency: '@aiready/consistency',
  'ai-signal': '@aiready/ai-signal-clarity',
  grounding: '@aiready/agent-grounding',
  testability: '@aiready/testability',
  'deps-health': '@aiready/deps',
  'change-amp': '@aiready/change-amplification',
};

/**
 * Deeply sanitizes a configuration object by removing infrastructure keys like rootDir.
 * Works recursively to clean up nested tool configurations to ensure compatibility
 * with the AIReadyConfig schema for portable configuration files.
 */
function sanitizeConfigRecursive(obj: any): any {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

  const sanitized: any = {};
  const infraToStrip = [
    'rootDir',
    'onProgress',
    'progressCallback',
    'streamResults',
    'batchSize',
    'useSmartDefaults',
  ];

  for (const [key, value] of Object.entries(obj)) {
    // Skip infrastructure keys that shouldn't be in a portable config file
    if (infraToStrip.includes(key)) continue;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeConfigRecursive(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize tool configuration by removing global options to match AIReadyConfig schema
 */
function sanitizeToolConfig(config: any): any {
  return sanitizeConfigRecursive(config);
}

/**
 * AIReady Unified Analysis.
 * Orchestrates all registered tools via the ToolRegistry.
 *
 * @param options - Unified analysis configuration including tools and rootDir.
 * @returns Promise resolving to the consolidated analysis result.
 * @lastUpdated 2026-03-18
 */
export async function analyzeUnified(
  options: UnifiedAnalysisOptions
): Promise<UnifiedAnalysisResult> {
  // Initialize language parsers
  await initializeParsers();

  const startTime = Date.now();
  const requestedTools = options.tools || [
    'patterns',
    'context',
    'consistency',
  ];

  const result: UnifiedAnalysisResult = {
    summary: {
      totalIssues: 0,
      criticalIssues: 0, // Added as per instruction
      majorIssues: 0, // Added as per instruction
      totalFiles: 0,
      toolsRun: [],
      executionTime: 0,
      config: options,
      toolConfigs: {},
    },
  };

  for (const toolName of requestedTools) {
    let provider = ToolRegistry.find(toolName);

    // Dynamic Loading: If provider not found, attempt to import the package
    if (!provider) {
      const packageName =
        TOOL_PACKAGE_MAP[toolName] ||
        (toolName.startsWith('@aiready/') ? toolName : `@aiready/${toolName}`);
      try {
        await import(packageName);
        provider = ToolRegistry.find(toolName);
        if (provider) {
          console.log(
            `✅ Successfully loaded tool provider: ${toolName} from ${packageName}`
          );
        } else {
          console.log(
            `⚠️ Loaded ${packageName} but provider ${toolName} still not found in registry.`
          );
        }
      } catch (err: any) {
        console.log(
          `❌ Failed to dynamically load tool ${toolName} (${packageName}):`,
          err.message
        );
      }
    }

    if (!provider) {
      console.warn(
        `⚠️  Warning: Tool provider for '${toolName}' not found. Skipping.`
      );
      continue;
    }

    try {
      // Sanitize options for metadata tracking (remove functions/internal keys)
      const sanitizedOptions = { ...options };
      delete (sanitizedOptions as any).onProgress;
      delete (sanitizedOptions as any).progressCallback;

      // 1. Start with sanitized global subset
      const toolOptions: any = {
        rootDir: options.rootDir, // Always include rootDir
      };

      // 1. Pass through all known infra and fine-tuning options from root level
      [...GLOBAL_INFRA_OPTIONS, ...COMMON_FINE_TUNING_OPTIONS].forEach(
        (key) => {
          if (key in options && key !== 'toolConfigs' && key !== 'tools') {
            toolOptions[key] = (options as any)[key];
          }
        }
      );

      // 3. Add tool-specific overrides
      // Check priority:
      // a) options.toolConfigs[toolId]
      // b) options.tools[toolId] (if tools is an object, not the array of tool names)
      // c) options[toolId] (legacy)
      if (options.toolConfigs?.[provider.id]) {
        Object.assign(toolOptions, options.toolConfigs[provider.id]);
      } else if (
        options.tools &&
        !Array.isArray(options.tools) &&
        typeof options.tools === 'object' &&
        (options.tools as any)[provider.id]
      ) {
        Object.assign(toolOptions, (options.tools as any)[provider.id]);
      } else if ((options as any)[provider.id]) {
        // Fallback for legacy tool-specific keys
        Object.assign(toolOptions, (options as any)[provider.id]);
      }

      // 4. Attach progress callback
      toolOptions.onProgress = (
        processed: number,
        total: number,
        message: string
      ) => {
        if (options.progressCallback) {
          options.progressCallback({
            tool: provider!.id,
            processed,
            total,
            message,
          });
        }
      };

      const output = await provider.analyze(toolOptions);

      // Inject sanitized configuration into metadata for audit
      if (output.metadata) {
        output.metadata.config = sanitizeToolConfig(toolOptions);
      }

      if (options.progressCallback) {
        options.progressCallback({ tool: provider.id, data: output });
      }

      result[provider.id] = output;
      result.summary.toolsRun.push(provider.id);

      // Collect tool-specific configuration for the audit log
      if (output.summary?.config) {
        result.summary.toolConfigs![provider.id] = sanitizeToolConfig(
          output.summary.config
        );
      } else if (output.metadata?.config) {
        result.summary.toolConfigs![provider.id] = sanitizeToolConfig(
          output.metadata.config
        );
      } else {
        // Fallback to our sanitized input options if spoke didn't return config
        result.summary.toolConfigs![provider.id] =
          sanitizeToolConfig(toolOptions);
      }

      // Track total files analyzed across all tools
      const toolFiles =
        output.summary?.totalFiles || output.summary?.filesAnalyzed || 0;
      if (toolFiles > result.summary.totalFiles) {
        result.summary.totalFiles = toolFiles;
      }

      const issueCount = output.results.reduce(
        (sum: number, file: any) => sum + (file.issues?.length || 0),
        0
      );
      result.summary.totalIssues += issueCount;

      // Robust backward compatibility fallbacks
      // 1. Add all aliases as keys (e.g., 'patterns', 'context', 'consistency')
      if (provider.alias && Array.isArray(provider.alias)) {
        for (const alias of provider.alias) {
          if (!result[alias]) {
            (result as any)[alias] = output;
          }
        }
      }

      // 2. Add camelCase version of canonical ID (e.g., 'patternDetect', 'contextAnalyzer')
      const camelCaseId = provider.id.replace(
        /-([a-z])/g,
        (_: string, g: string) => g.toUpperCase()
      );
      if (camelCaseId !== provider.id && !result[camelCaseId]) {
        (result as any)[camelCaseId] = output;
      }
    } catch (err) {
      console.error(`❌ Error running tool '${provider.id}':`, err);
    }
  }

  // Finalize configuration for metadata to match AIReadyConfig schema
  // We use sanitizeConfigRecursive to ensure no internal keys (like rootDir) remain
  result.summary.config = sanitizeConfigRecursive({
    scan: {
      tools: requestedTools,
      include: options.include,
      exclude: options.exclude,
    },
    // Use 'tools' for tool-specific configurations to match AIReadyConfig
    tools: result.summary.toolConfigs,
  });

  result.summary.executionTime = Date.now() - startTime;
  return result;
}

/**
 * AIReady Unified Scoring.
 * Calculates scores for all analyzed tools.
 *
 * @param results - The consolidated results from a unified analysis.
 * @param options - Analysis options for weighting and budget calculation.
 * @returns Promise resolving to the final scoring result.
 */
export async function scoreUnified(
  results: UnifiedAnalysisResult,
  options: UnifiedAnalysisOptions
): Promise<ScoringResult> {
  const toolScores: Map<string, ToolScoringOutput> = new Map();

  for (const toolId of results.summary.toolsRun) {
    const provider = ToolRegistry.get(toolId as ToolName);
    if (!provider) continue;

    const output = results[toolId];
    if (!output) continue;

    try {
      const toolScore = provider.score(output, options);

      // Special handling for token budget calculation if not provided by tool
      if (!toolScore.tokenBudget) {
        if (toolId === ToolName.PatternDetect && (output as any).duplicates) {
          const wastedTokens = (output as any).duplicates.reduce(
            (sum: number, d: any) => sum + (d.tokenCost || 0),
            0
          );
          toolScore.tokenBudget = calculateTokenBudget({
            totalContextTokens: wastedTokens * 2,
            wastedTokens: {
              duplication: wastedTokens,
              fragmentation: 0,
              chattiness: 0,
            },
          });
        } else if (toolId === ToolName.ContextAnalyzer && output.summary) {
          toolScore.tokenBudget = calculateTokenBudget({
            totalContextTokens: output.summary.totalTokens,
            wastedTokens: {
              duplication: 0,
              fragmentation: output.summary.totalPotentialSavings || 0,
              chattiness: 0,
            },
          });
        }
      }

      toolScores.set(toolId, toolScore);
    } catch (err) {
      console.error(`❌ Error scoring tool '${toolId}':`, err);
    }
  }

  // Handle case where toolScores is empty
  if (toolScores.size === 0) {
    return {
      overall: 0,
      rating: 'Critical',
      timestamp: new Date().toISOString(),
      toolsUsed: [],
      breakdown: [],
      calculation: {
        formula: '0 / 0 = 0',
        weights: {},
        normalized: '0 / 0 = 0',
      },
    } as ScoringResult;
  }

  return calculateOverallScore(toolScores, options, undefined);
}

/**
 * Generate human-readable summary of unified results.
 *
 * @param result - The consolidated analysis result object.
 * @returns Formatted summary string.
 */
export function generateUnifiedSummary(result: UnifiedAnalysisResult): string {
  const { summary } = result;
  let output = `🚀 AIReady Analysis Complete\n\n`;
  output += `📊 Summary:\n`;
  output += `   Tools run: ${summary.toolsRun.join(', ')}\n`;
  output += `   Total issues found: ${summary.totalIssues}\n`;
  output += `   Execution time: ${(summary.executionTime / 1000).toFixed(2)}s\n\n`;

  for (const provider of ToolRegistry.getAll()) {
    const toolResult = result[provider.id];
    if (toolResult) {
      const issueCount = toolResult.results.reduce(
        (sum: number, r: any) => sum + (r.issues?.length || 0),
        0
      );
      output += `• ${provider.id}: ${issueCount} issues\n`;
    }
  }

  return output;
}
