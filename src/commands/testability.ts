/**
 * Testability command - Analyze test coverage and testability
 */

import { type Command } from 'commander';
import {
  defineStandardTool,
  chalk,
  renderStandardSummary,
  type CommonToolOptions,
} from './shared/command-builder';

export { testabilityAction } from './shared/standard-tool-actions';

interface TestabilityOptions extends CommonToolOptions {
  minCoverage?: string;
}

/**
 * Define the testability command.
 */
export function defineTestabilityCommand(program: Command) {
  defineStandardTool(program, {
    name: 'testability',
    description: 'Analyze test coverage and AI change safety',
    toolName: 'testability-index',
    label: 'Testability Analysis',
    emoji: '🧪',
    importPath: '@aiready/testability',
    analyzeFnName: 'analyzeTestability',
    scoreFnName: 'calculateTestabilityScore',
    defaults: { minCoverageRatio: 0.3 },
    options: [
      {
        flags: '--min-coverage <number>',
        description: 'Minimum coverage ratio (0-1)',
        defaultValue: '0.3',
      },
    ],
    getCliOptions: (opts: TestabilityOptions) => ({
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
}
