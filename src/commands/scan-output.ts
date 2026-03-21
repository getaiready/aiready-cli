/**
 * Output formatting utilities for the scan command
 */

import chalk from 'chalk';
import { writeFileSync } from 'fs';
import type { ScoringResult } from '../index';
import {
  getRatingLabel,
  getRatingEmoji,
  getToolEmoji,
  getPriorityIcon,
} from '@aiready/core';
import { getScoreBar } from '@aiready/core';

/**
 * Print scan summary results
 */
export function printScanSummary(results: any, startTime: number): void {
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(chalk.cyan('\n=== AIReady Run Summary ==='));
  console.log(
    chalk.white(`  Total issues: ${chalk.bold(results.summary.totalIssues)}`)
  );

  if (results.summary.severityBreakdown) {
    console.log(chalk.white('  Severity breakdown:'));
    if (results.summary.severityBreakdown.critical > 0)
      console.log(
        chalk.red(
          `    ● Critical: ${results.summary.severityBreakdown.critical}`
        )
      );
    if (results.summary.severityBreakdown.major > 0)
      console.log(
        chalk.yellow(`    ● Major: ${results.summary.severityBreakdown.major}`)
      );
    if (results.summary.severityBreakdown.minor > 0)
      console.log(
        chalk.blue(`    ● Minor: ${results.summary.severityBreakdown.minor}`)
      );
  }

  if (results.summary.topFiles && results.summary.topFiles.length > 0) {
    console.log(chalk.white('\n  Top files with issues:'));
    results.summary.topFiles.slice(0, 5).forEach((file: any) => {
      console.log(
        chalk.dim(`    → ${file.fileName}: ${file.issueCount} issues`)
      );
    });
  }

  console.log(chalk.dim(`\n  Execution time: ${elapsedTime}s`));
}

/**
 * Print scoring results
 */
export function printScoring(
  scoringResult: ScoringResult,
  profile: string
): void {
  console.log(chalk.cyan('\n📊 AI Readiness Overall Score'));
  console.log(
    chalk.bold(
      `  ${scoringResult.overall}/100 (${getRatingLabel(scoringResult.overall)}) ${getRatingEmoji(scoringResult.overall)}`
    )
  );
  console.log(chalk.dim(`  (Scoring Profile: ${profile})`));

  if (scoringResult.breakdown && scoringResult.breakdown.length > 0) {
    console.log(chalk.white('\nTool breakdown:'));
    scoringResult.breakdown.forEach((tool: any) => {
      const bar = getScoreBar(tool.score);
      const emoji = getToolEmoji(tool.score);
      console.log(
        `  ${bar} ${tool.score}/100 (${getRatingLabel(tool.score)}) ${emoji} ${tool.toolName}`
      );
    });
  }

  const recommendations = (scoringResult as any).recommendations as any[];
  if (recommendations && recommendations.length > 0) {
    console.log(chalk.cyan('\n🎯 Top Actionable Recommendations:'));
    recommendations.slice(0, 5).forEach((rec: any, idx: number) => {
      const priorityIcon = getPriorityIcon(rec.priority);
      console.log(`  ${idx + 1}. ${priorityIcon} ${rec.action}`);
      console.log(chalk.dim(`     Impact: ${rec.estimatedImpact} points`));
    });
  }
}

/**
 * Print business impact analysis
 */
export function printBusinessImpact(roi: any, tokenBudget: any): void {
  console.log(chalk.cyan('\n💰 Business Impact Analysis (Monthly)'));
  console.log(chalk.white(`  Potential Savings: $${roi.monthlySavings}`));
  console.log(
    chalk.white(
      `  Productivity Gain: ${roi.productivityGainHours}h (est. dev time)`
    )
  );

  if (tokenBudget) {
    const efficiency = tokenBudget.efficiencyRatio
      ? (tokenBudget.efficiencyRatio * 100).toFixed(0)
      : 'N/A';
    console.log(chalk.white(`  Context Efficiency: ${efficiency}%`));
  }

  if (roi.annualValue) {
    console.log(
      chalk.white(
        `  Annual Value: $${roi.annualValue.toLocaleString()} (ROI Prediction)`
      )
    );
  }
}
