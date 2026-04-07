/**
 * Shared implementations for standard config-driven CLI actions.
 */

import chalk from 'chalk';
import type { ToolScoringOutput } from '@aiready/core';
import { buildToolScoringOutput } from '../../utils/helpers';
import { runConfiguredToolAction } from './configured-tool-action';

interface BaseToolOptions {
  include?: string;
  exclude?: string;
  output?: string;
  outputFile?: string;
  score?: boolean;
}

const StandardRatingColors: Record<string, (s: string) => string> = {
  minimal: chalk.green,
  excellent: chalk.green,
  low: chalk.cyan,
  good: chalk.blueBright,
  moderate: chalk.yellow,
  high: chalk.red,
  poor: chalk.red,
  severe: chalk.bgRed.white,
  hazardous: chalk.bgRed.white,
};

function renderStandardToolResult(
  label: string,
  icon: string,
  report: any,
  scoring: ToolScoringOutput,
  issueLabel: string,
  successMsg: string,
  isInverseScore: boolean = false
) {
  const { summary } = report;
  const color = StandardRatingColors[summary.rating] ?? chalk.white;
  const displayScore = isInverseScore ? 100 - scoring.score : scoring.score;

  console.log(
    `  ${icon} ${label}:  ${chalk.bold(displayScore + '/100' + (isInverseScore ? ' health' : ''))} (${color(summary.rating)}${isInverseScore ? ' risk' : ''})`
  );

  if (report.issues && report.issues.length > 0) {
    console.log(chalk.dim(`     Found ${report.issues.length} ${issueLabel}.`));
  } else if (report.issues) {
    console.log(chalk.dim(`     ${successMsg}`));
  }
}

interface DocDriftOptions extends BaseToolOptions {
  staleMonths?: number;
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
    render: (report, scoring) =>
      renderStandardToolResult(
        'Documentation Drift',
        '📝',
        report,
        scoring,
        'drift issues',
        'No documentation drift detected.',
        true
      ),
  });
}

interface DepsHealthOptions extends BaseToolOptions {
  trainingCutoffYear?: number;
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
    render: (report, scoring) =>
      renderStandardToolResult(
        'Dependency Health',
        '📦',
        report,
        scoring,
        'dependency issues',
        'Dependencies look healthy for AI assistance.'
      ),
  });
}

interface AiSignalClarityOptions extends BaseToolOptions {
  minSeverity?: string;
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
      renderStandardToolResult(
        'AI Signal Clarity',
        '🧠',
        report,
        scoring,
        '',
        ''
      );
      const { summary } = report;
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
