/**
 * Patterns command - Detect duplicate code patterns that confuse AI models
 */

import { type Command } from 'commander';
import {
  defineStandardTool,
  renderStandardSummary,
  renderIssues,
  type CommonToolOptions,
} from './shared/command-builder';

export { patternsAction } from './shared/standard-tool-actions';

interface PatternsOptions extends CommonToolOptions {
  similarity?: string;
  minLines?: string;
  maxCandidates?: string;
  minSharedTokens?: string;
  fullScan?: boolean;
}

export const PATTERNS_HELP_TEXT = `
EXAMPLES:
  $ aiready patterns                                 # Default analysis
  $ aiready patterns --similarity 0.6               # Stricter matching
  $ aiready patterns --min-lines 10                 # Larger patterns only
`;

/**
 * Define the patterns command.
 */
export function definePatternsCommand(program: Command) {
  defineStandardTool(program, {
    name: 'patterns',
    description: 'Detect duplicate code patterns that confuse AI models',
    toolName: 'pattern-detect',
    label: 'Pattern analysis',
    emoji: '🔍',
    importPath: '@aiready/pattern-detect',
    analyzeFnName: 'analyzePatterns',
    scoreFnName: 'calculatePatternScore',
    helpText: PATTERNS_HELP_TEXT,
    defaults: { useSmartDefaults: true },
    options: [
      {
        flags: '-s, --similarity <number>',
        description: 'Minimum similarity score (0-1)',
        defaultValue: '0.6',
      },
      {
        flags: '-l, --min-lines <number>',
        description: 'Minimum lines to consider',
        defaultValue: '10',
      },
      {
        flags: '--max-candidates <number>',
        description: 'Maximum candidates per block (performance tuning)',
      },
      {
        flags: '--min-shared-tokens <number>',
        description:
          'Minimum shared tokens for candidates (performance tuning)',
      },
      {
        flags: '--full-scan',
        description:
          'Disable smart defaults for comprehensive analysis (slower)',
      },
    ],
    getCliOptions: (opts: PatternsOptions) => ({
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
        renderIssues({
          issues: duplicates.map((dup: any) => ({
            severity:
              dup.similarity > 0.95
                ? 'critical'
                : dup.similarity > 0.9
                  ? 'major'
                  : 'minor',
            file: `${dup.file1.split('/').pop()} ↔ ${dup.file2.split('/').pop()}`,
            message: `${Math.round(dup.similarity * 100)}% similar code`,
          })),
          title: 'Top Duplicate Patterns',
        });
      }
    },
  });
}
