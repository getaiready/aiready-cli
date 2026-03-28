/**
 * Shared implementations for standard config-driven CLI actions.
 */

import chalk from 'chalk';
import type { ToolScoringOutput } from '@aiready/core';
import { buildToolScoringOutput } from '../../utils/helpers';
import { runConfiguredToolAction } from './configured-tool-action';

interface DocDriftOptions {
  staleMonths?: number;
  include?: string;
  exclude?: string;
  output?: string;
  outputFile?: string;
  score?: boolean;
}

export async function docDriftAction(
  directory: string,
  options: DocDriftOptions
): Promise<ToolScoringOutput | undefined> {
  const { analyzeDocDrift } = await import('@aiready/doc-drift');

  return runConfiguredToolAction(directory, options, {
    defaults: { staleMonths: 6 },
    analyze: analyzeDocDrift,
    getExtras: (cmdOptions, merged) => ({
      staleMonths: cmdOptions.staleMonths ?? merged.staleMonths ?? 6,
    }),
    score: (toolReport): ToolScoringOutput =>
      buildToolScoringOutput('doc-drift', toolReport),
    render: (report, scoring) => {
      const { summary } = report;
      const ratingColors: Record<string, (s: string) => string> = {
        minimal: chalk.green,
        low: chalk.cyan,
        moderate: chalk.yellow,
        high: chalk.red,
        severe: chalk.bgRed.white,
      };
      const color = ratingColors[summary.rating] ?? chalk.white;
      console.log(
        `  📝 Documentation Drift:  ${chalk.bold(100 - scoring.score + '/100 health')} (${color(summary.rating)} risk)`
      );
      if (report.issues.length > 0) {
        console.log(
          chalk.dim(`     Found ${report.issues.length} drift issues.`)
        );
      } else {
        console.log(chalk.dim(`     No documentation drift detected.`));
      }
    },
  });
}

interface DepsHealthOptions {
  trainingCutoffYear?: number;
  include?: string;
  exclude?: string;
  output?: string;
  outputFile?: string;
  score?: boolean;
}

export async function depsHealthAction(
  directory: string,
  options: DepsHealthOptions
): Promise<ToolScoringOutput | undefined> {
  const { analyzeDeps } = await import('@aiready/deps');

  return runConfiguredToolAction(directory, options, {
    defaults: { trainingCutoffYear: 2023 },
    analyze: analyzeDeps,
    getExtras: (cmdOptions, merged) => ({
      trainingCutoffYear:
        cmdOptions.trainingCutoffYear ?? merged.trainingCutoffYear ?? 2023,
    }),
    score: (toolReport): ToolScoringOutput =>
      buildToolScoringOutput('dependency-health', toolReport),
    render: (report, scoring) => {
      const { summary } = report;
      const ratingColors: Record<string, (s: string) => string> = {
        excellent: chalk.green,
        good: chalk.blueBright,
        moderate: chalk.yellow,
        poor: chalk.red,
        hazardous: chalk.bgRed.white,
      };
      const color = ratingColors[summary.rating] ?? chalk.white;
      console.log(
        `  📦 Dependency Health:  ${chalk.bold(scoring.score + '/100 health')} (${color(summary.rating)})`
      );
      if (report.issues.length > 0) {
        console.log(
          chalk.dim(`     Found ${report.issues.length} dependency issues.`)
        );
      } else {
        console.log(
          chalk.dim(`     Dependencies look healthy for AI assistance.`)
        );
      }
    },
  });
}

interface AiSignalClarityOptions {
  minSeverity?: string;
  include?: string;
  exclude?: string;
  output?: string;
  outputFile?: string;
  score?: boolean;
}

export async function aiSignalClarityAction(
  directory: string,
  options: AiSignalClarityOptions
): Promise<ToolScoringOutput | undefined> {
  const { analyzeAiSignalClarity, calculateAiSignalClarityScore } =
    await import('@aiready/ai-signal-clarity');

  return runConfiguredToolAction(directory, options, {
    defaults: { minSeverity: 'info' },
    analyze: analyzeAiSignalClarity,
    getExtras: (cmdOptions, merged) => ({
      minSeverity: cmdOptions.minSeverity ?? merged.minSeverity ?? 'info',
    }),
    score: (toolReport) => calculateAiSignalClarityScore(toolReport),
    render: (report, scoring) => {
      const { summary } = report;
      const ratingColors: Record<string, (s: string) => string> = {
        minimal: chalk.green,
        low: chalk.cyan,
        moderate: chalk.yellow,
        high: chalk.red,
        severe: chalk.bgRed.white,
      };
      const color = ratingColors[summary.rating] ?? chalk.white;
      console.log(
        `  🧠 AI Signal Clarity:  ${chalk.bold(scoring.score + '/100')} (${color(summary.rating)})`
      );
      console.log(`     Top Risk: ${chalk.italic(summary.topRisk)}`);
      if (summary.totalSignals > 0) {
        console.log(
          chalk.dim(
            `     ${summary.criticalSignals} critical  ${summary.majorSignals} major  ${summary.minorSignals} minor signals`
          )
        );
      }
    },
  });
}
