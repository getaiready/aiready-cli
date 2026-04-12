/**
 * Shared implementations for standard config-driven CLI actions.
 */

import {
  createStandardToolConfig,
  renderStandardSummary,
  chalk,
  renderSubSection,
  type ToolScoringOutput,
  type ToolActionConfig,
} from './command-builder';
import { executeToolAction } from '../scan-helpers';
import type { Severity } from '@aiready/core';

interface BaseToolOptions {
  include?: string;
  exclude?: string;
  output?: string;
  outputFile?: string;
  score?: boolean;
}

/**
 * Higher-order function to create a standard CLI action implementation.
 */
function createStandardAction<TOptions extends BaseToolOptions>(
  config: ToolActionConfig<any, any, TOptions>
) {
  return async (
    directory: string,
    options: TOptions
  ): Promise<ToolScoringOutput | undefined> => {
    return await executeToolAction(directory, options, config);
  };
}

// --- Documentation Drift ---

interface DocDriftOptions extends BaseToolOptions {
  staleMonths?: number;
}

export const docDriftConfig = createStandardToolConfig<DocDriftOptions>({
  toolName: 'doc-drift',
  label: 'Documentation Drift',
  emoji: '📝',
  importPath: '@aiready/doc-drift',
  analyzeFnName: 'analyzeDocDrift',
  scoreFnName: 'calculateDocDriftScore',
  defaults: { staleMonths: 6 },
  getCliOptions: (opts) => ({
    staleMonths: opts.staleMonths ? Number(opts.staleMonths) : undefined,
  }),
});

export const docDriftAction = createStandardAction(docDriftConfig);

// --- Dependency Health ---

interface DepsHealthOptions extends BaseToolOptions {
  trainingCutoffYear?: number;
}

export const depsHealthConfig = createStandardToolConfig<DepsHealthOptions>({
  toolName: 'dependency-health',
  label: 'Dependency Health',
  emoji: '📦',
  importPath: '@aiready/deps',
  analyzeFnName: 'analyzeDeps',
  scoreFnName: 'calculateDepsScore',
  defaults: { trainingCutoffYear: 2023 },
  getCliOptions: (opts) => ({
    trainingCutoffYear: opts.trainingCutoffYear
      ? Number(opts.trainingCutoffYear)
      : undefined,
  }),
});

export const depsHealthAction = createStandardAction(depsHealthConfig);

// --- AI Signal Clarity ---

interface AiSignalClarityOptions extends BaseToolOptions {
  minSeverity?: string;
}

export const aiSignalClarityConfig =
  createStandardToolConfig<AiSignalClarityOptions>({
    toolName: 'ai-signal-clarity',
    label: 'AI Signal Clarity',
    emoji: '🧠',
    importPath: '@aiready/ai-signal-clarity',
    analyzeFnName: 'analyzeAiSignalClarity',
    scoreFnName: 'calculateAiSignalClarityScore',
    defaults: { minSeverity: 'info' },
    getCliOptions: (opts) => ({
      minSeverity: opts.minSeverity,
    }),
    renderConsole: ({ summary, score, elapsedTime }) => {
      renderStandardSummary({
        label: 'AI Signal Clarity',
        emoji: '🧠',
        summary: summary as Record<string, any>,
        score,
        elapsedTime,
        metrics: `Top Risk: ${chalk.italic((summary as any).topRisk || 'None')}`,
      });

      if ((summary as any).totalSignals > 0) {
        console.log(
          chalk.dim(
            `     ${(summary as any).criticalSignals} critical  ${(summary as any).majorSignals} major  ${(summary as any).minorSignals} minor signals`
          )
        );
      }
    },
  });

export const aiSignalClarityAction = createStandardAction(
  aiSignalClarityConfig
);

// --- Pattern Analysis ---

interface PatternsOptions extends BaseToolOptions {
  similarity?: string;
  minLines?: string;
  maxCandidates?: string;
  minSharedTokens?: string;
  fullScan?: boolean;
}

export const patternsConfig = createStandardToolConfig<PatternsOptions>({
  toolName: 'pattern-detect',
  label: 'Pattern analysis',
  emoji: '🔍',
  importPath: '@aiready/pattern-detect',
  analyzeFnName: 'analyzePatterns',
  scoreFnName: 'calculatePatternScore',
  defaults: { useSmartDefaults: true },
  getCliOptions: (opts) => ({
    minSimilarity: opts.similarity ? parseFloat(opts.similarity) : undefined,
    minLines: opts.minLines ? parseInt(opts.minLines) : undefined,
    maxCandidatesPerBlock: opts.maxCandidates
      ? parseInt(opts.maxCandidates)
      : undefined,
    minSharedTokens: opts.minSharedTokens
      ? parseInt(opts.minSharedTokens)
      : undefined,
    useSmartDefaults: !opts.fullScan,
  }),
  renderConsole: ({ results, summary, score, elapsedTime }) => {
    const rawResults = results as { duplicates?: any[] };
    const duplicates = rawResults.duplicates || [];

    renderStandardSummary({
      label: 'Pattern Analysis',
      emoji: '🔍',
      summary: summary as Record<string, any>,
      score,
      elapsedTime,
    });

    if ((summary.totalPatterns as number) > 0 && duplicates.length > 0) {
      renderSubSection('Top Duplicate Patterns');
      [...duplicates]
        .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
        .slice(0, 5)
        .forEach((dup) => {
          const sim = dup.similarity || 0;
          const file1 = (dup.file1 || '').split('/').pop();
          const file2 = (dup.file2 || '').split('/').pop();
          const isHigh = sim > 0.9;
          const icon = sim > 0.95 ? '🔴' : isHigh ? '🟡' : '🔵';
          console.log(
            `  ${icon} ${chalk.bold(file1)} ↔ ${chalk.bold(file2)} (${Math.round(sim * 100)}%)`
          );
        });
    }
  },
});

export const patternsAction = createStandardAction(patternsConfig);

// --- Testability Analysis ---

interface TestabilityOptions extends BaseToolOptions {
  minCoverage?: string;
}

export const testabilityConfig = createStandardToolConfig<TestabilityOptions>({
  toolName: 'testability-index',
  label: 'Testability Analysis',
  emoji: '🧪',
  importPath: '@aiready/testability',
  analyzeFnName: 'analyzeTestability',
  scoreFnName: 'calculateTestabilityScore',
  defaults: { minCoverageRatio: 0.3 },
  getCliOptions: (opts) => ({
    minCoverageRatio: opts.minCoverage
      ? parseFloat(opts.minCoverage)
      : undefined,
  }),
  renderConsole: ({ results, summary, score, elapsedTime }) => {
    const rawData = (results as Record<string, any>).rawData || results;
    const summaryRecord = summary as Record<string, any>;
    const coverage = Math.round(
      ((summaryRecord.coverageRatio as number) || 0) * 100
    );
    const metrics = `Coverage: ${coverage}%  (${rawData.testFiles} test / ${rawData.sourceFiles} source files)`;

    renderStandardSummary({
      label: 'Testability',
      emoji: '🧪',
      summary: summaryRecord,
      score,
      elapsedTime,
      metrics,
    });

    if (summaryRecord.aiChangeSafetyRating === 'blind-risk') {
      console.log(
        chalk.red.bold(
          '\n     ⚠️  NO TESTS — AI changes to this codebase are completely unverifiable!\n'
        )
      );
    }
  },
});

export const testabilityAction = createStandardAction(testabilityConfig);

// --- Consistency Analysis ---

interface ConsistencyOptions extends BaseToolOptions {
  naming?: boolean;
  patterns?: boolean;
  minSeverity?: Severity;
}

export const consistencyConfig = createStandardToolConfig<ConsistencyOptions>({
  toolName: 'naming-consistency',
  label: 'Consistency Analysis',
  emoji: '📏',
  importPath: '@aiready/consistency',
  analyzeFnName: 'analyzeConsistency',
  scoreFnName: 'calculateConsistencyScore',
  defaults: {
    checkNaming: true,
    checkPatterns: true,
    minSeverity: 'info' as Severity,
  },
  getCliOptions: (opts) => ({
    checkNaming: opts.naming !== false,
    checkPatterns: opts.patterns !== false,
    minSeverity: opts.minSeverity as Severity | undefined,
  }),
});

export const consistencyAction = createStandardAction(consistencyConfig);

// --- Context Analysis ---

interface ContextOptions extends BaseToolOptions {
  maxDepth?: string;
  maxContext?: string;
}

export const contextConfig = createStandardToolConfig<ContextOptions>({
  toolName: 'context-analyzer',
  label: 'Context Analysis',
  emoji: '🧩',
  importPath: '@aiready/context-analyzer',
  analyzeFnName: 'analyzeContext',
  scoreFnName: 'calculateContextScore',
  defaults: {
    maxDepth: 5,
    maxContextBudget: 10000,
  },
  getCliOptions: (opts) => ({
    maxDepth: opts.maxDepth ? parseInt(opts.maxDepth) : undefined,
    maxContextBudget: opts.maxContext ? parseInt(opts.maxContext) : undefined,
  }),
});

export const contextAction = createStandardAction(contextConfig);

// --- Agent Grounding ---

interface GroundingOptions extends BaseToolOptions {
  maxDepth?: string;
  readmeStaleDays?: string;
}

export const groundingConfig = createStandardToolConfig<GroundingOptions>({
  toolName: 'agent-grounding',
  label: 'Agent grounding',
  emoji: '🧭',
  importPath: '@aiready/agent-grounding',
  analyzeFnName: 'analyzeAgentGrounding',
  scoreFnName: 'calculateGroundingScore',
  defaults: { maxRecommendedDepth: 4, readmeStaleDays: 90 },
  getCliOptions: (opts) => ({
    maxRecommendedDepth: opts.maxDepth ? parseInt(opts.maxDepth) : undefined,
    readmeStaleDays: opts.readmeStaleDays
      ? parseInt(opts.readmeStaleDays)
      : undefined,
  }),
  renderConsole: ({ summary, score, elapsedTime }) => {
    const summaryRecord = summary as Record<string, any>;
    renderStandardSummary({
      label: 'Agent Grounding',
      emoji: '🧠',
      summary: summaryRecord,
      score,
      elapsedTime,
      metrics: `Files: ${summaryRecord.filesAnalyzed}  Dirs: ${summaryRecord.directoriesAnalyzed}`,
    });
  },
});

export const agentGroundingAction = createStandardAction(groundingConfig);

// --- Contract Enforcement ---

interface ContractEnforcementOptions extends BaseToolOptions {
  minChainDepth?: string;
}

export const contractEnforcementConfig =
  createStandardToolConfig<ContractEnforcementOptions>({
    toolName: 'contract-enforcement',
    label: 'Contract enforcement analysis',
    emoji: '🛡️',
    importPath: '@aiready/contract-enforcement',
    analyzeFnName: 'analyzeContractEnforcement',
    defaults: { minChainDepth: 3 },
    getCliOptions: (opts) => ({
      minChainDepth: opts.minChainDepth
        ? parseInt(opts.minChainDepth, 10)
        : undefined,
    }),
    calculateScore: async (data: unknown, resultsCount?: number) => {
      const tool = await import('@aiready/contract-enforcement');
      const result = tool.calculateContractEnforcementScore(
        data as any,
        resultsCount ?? 0,
        resultsCount ?? 0
      );
      return {
        toolName: 'contract-enforcement',
        score: result.score,
        rawMetrics: result.dimensions || {},
        factors: (result.recommendations || []).map(
          (rec: string, i: number) => ({
            name: `Recommendation ${i + 1}`,
            impact: 0,
            description: rec,
          })
        ),
        recommendations: (result.recommendations || []).map((rec: string) => ({
          action: rec,
          estimatedImpact: 5,
          priority: 'medium' as const,
        })),
      };
    },
    renderConsole: ({ results, summary, score, elapsedTime }) => {
      const summaryRecord = summary as Record<string, any>;
      const metrics = `Patterns: ${summaryRecord.totalDefensivePatterns} (${summaryRecord.defensiveDensity}/kLOC)`;

      renderStandardSummary({
        label: 'Contract Enforcement',
        emoji: '🛡️',
        summary: summaryRecord,
        score,
        elapsedTime,
        metrics,
      });

      const dims = summaryRecord.dimensions as Record<string, number>;
      if (dims) {
        console.log(
          chalk.dim(
            `     Types: ${dims.typeEscapeHatchScore} | Fallbacks: ${dims.fallbackCascadeScore} | Errors: ${dims.errorTransparencyScore} | Validation: ${dims.boundaryValidationScore}`
          )
        );
      }
    },
  });

export const contractEnforcementAction = createStandardAction(
  contractEnforcementConfig
);
