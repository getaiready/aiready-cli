import chalk from 'chalk';
import {
  Severity,
  ScoringResult,
  formatScore,
  getRating,
  getRatingDisplay,
} from '@aiready/core';

/**
 * Generate a visual progress bar for a score.
 *
 * @param score - The score value (0-100)
 * @param width - The width of the progress bar
 * @returns A colored progress bar string
 */
function generateProgressBar(score: number, width: number = 20): string {
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;

  let color = chalk.red;
  if (score >= 90) color = chalk.green;
  else if (score >= 75) color = chalk.cyan;
  else if (score >= 60) color = chalk.yellow;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return color(bar);
}

/**
 * Count issues by severity level from all tool results.
 *
 * @param results - The unified results object
 * @returns Object with counts for each severity level
 */
function countIssuesBySeverity(results: any): {
  critical: number;
  major: number;
  minor: number;
} {
  let critical = 0;
  let major = 0;
  let minor = 0;

  if (results.summary?.toolsRun) {
    for (const toolId of results.summary.toolsRun) {
      const toolRes = results[toolId];
      if (toolRes?.results) {
        for (const fileRes of toolRes.results) {
          if (fileRes.issues) {
            for (const issue of fileRes.issues) {
              const sev = issue.severity?.toLowerCase();
              if (sev === 'critical') critical++;
              else if (sev === 'major') major++;
              else minor++;
            }
          }
        }
      }
    }
  }

  return { critical, major, minor };
}

/**
 * Get top files with most issues.
 *
 * @param results - The unified results object
 * @param limit - Maximum number of files to return
 * @returns Array of files with issue counts
 */
function getTopFilesWithIssues(
  results: any,
  limit: number = 5
): Array<{ file: string; count: number }> {
  const fileCounts = new Map<string, number>();

  if (results.summary?.toolsRun) {
    for (const toolId of results.summary.toolsRun) {
      const toolRes = results[toolId];
      if (toolRes?.results) {
        for (const fileRes of toolRes.results) {
          if (fileRes.issues?.length > 0) {
            const current = fileCounts.get(fileRes.fileName) || 0;
            fileCounts.set(fileRes.fileName, current + fileRes.issues.length);
          }
        }
      }
    }
  }

  return Array.from(fileCounts.entries())
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Handle console output for the scan results.
 *
 * @param results - The combined results from all tools.
 * @param startTime - The timestamp when the scan started.
 */
export function printScanSummary(results: any, startTime: number) {
  // Count issues by severity
  const severity = countIssuesBySeverity(results);
  const totalIssues = severity.critical + severity.major + severity.minor;

  // Get top files with issues
  const topFiles = getTopFilesWithIssues(results);

  console.log(chalk.cyan('\n=== AIReady Run Summary ==='));
  console.log(`  Total issues: ${chalk.bold(String(totalIssues))}`);

  // Severity breakdown
  if (totalIssues > 0) {
    console.log(chalk.dim('  Severity breakdown:'));
    if (severity.critical > 0) {
      console.log(
        `    ${chalk.red('●')} Critical: ${chalk.bold(severity.critical)}`
      );
    }
    if (severity.major > 0) {
      console.log(
        `    ${chalk.yellow('●')} Major: ${chalk.bold(severity.major)}`
      );
    }
    if (severity.minor > 0) {
      console.log(
        `    ${chalk.blue('●')} Minor: ${chalk.bold(severity.minor)}`
      );
    }
  }

  // Top files with issues
  if (topFiles.length > 0) {
    console.log(chalk.dim('\n  Top files with issues:'));
    topFiles.forEach((item) => {
      console.log(
        `    ${chalk.yellow('→')} ${item.file}: ${chalk.bold(item.count)} issues`
      );
    });
  }

  console.log(
    `\n  Execution time: ${chalk.bold(((Date.now() - startTime) / 1000).toFixed(2) + 's')}`
  );
}

/**
 * Print business impact analysis based on ROI and budget metrics.
 *
 * @param roi - Calculated Return on Investment metrics.
 * @param unifiedBudget - Consolidated context budget metrics.
 */
export function printBusinessImpact(roi: any, unifiedBudget: any) {
  console.log(chalk.bold('\n💰 Business Impact Analysis (Monthly)'));
  console.log(
    `  Potential Savings: ${chalk.green(chalk.bold('$' + roi.monthlySavings.toLocaleString()))}`
  );
  console.log(
    `  Productivity Gain: ${chalk.cyan(chalk.bold(roi.productivityGainHours + 'h'))} (est. dev time)`
  );
  console.log(
    `  Context Efficiency: ${chalk.yellow((unifiedBudget.efficiencyRatio * 100).toFixed(0) + '%')}`
  );
  console.log(
    `  Annual Value: ${chalk.bold('$' + roi.annualValue.toLocaleString())} (ROI Prediction)`
  );
}

/**
 * Print detailed scoring breakdown by tool.
 *
 * @param scoringResult - The overall scoring result.
 * @param scoringProfile - The name of the scoring profile used.
 */
export function printScoring(
  scoringResult: ScoringResult,
  scoringProfile: string
) {
  console.log(chalk.bold('\n📊 AI Readiness Overall Score'));
  console.log(`  ${formatScore(scoringResult)}`);
  console.log(chalk.dim(`  (Scoring Profile: ${scoringProfile})`));

  if (scoringResult.breakdown) {
    console.log(chalk.bold('\nTool breakdown:'));
    scoringResult.breakdown.forEach((tool: any) => {
      const rating = getRating(tool.score);
      const emoji = getRatingDisplay(rating).emoji;
      const progressBar = generateProgressBar(tool.score, 15);
      console.log(
        `  ${progressBar} ${tool.score}/100 (${rating}) ${emoji} ${tool.toolName}`
      );
    });

    // Top Actionable Recommendations - increased from 3 to 5
    const allRecs = scoringResult.breakdown
      .flatMap((t: any) =>
        (t.recommendations ?? []).map((r: any) => ({ ...r, tool: t.toolName }))
      )
      .sort((a: any, b: any) => b.estimatedImpact - a.estimatedImpact)
      .slice(0, 5); // Increased from 3 to 5

    if (allRecs.length > 0) {
      console.log(chalk.bold('\n🎯 Top Actionable Recommendations:'));
      allRecs.forEach((rec: any, i: number) => {
        const priorityIcon =
          rec.priority === 'high'
            ? '🔴'
            : rec.priority === 'medium'
              ? '🟡'
              : '🔵';
        console.log(`  ${i + 1}. ${priorityIcon} ${chalk.bold(rec.action)}`);
        console.log(
          `     Impact: ${chalk.green(`+${rec.estimatedImpact} points`)} to ${rec.tool}`
        );
      });
    }
  }
}

/**
 * Normalize and map tool-specific results to a unified report structure.
 *
 * @param res - Raw unified results object.
 * @param scoring - Optional scoring result to include.
 * @returns Enhanced report with totals and scoring.
 */
export function mapToUnifiedReport(
  res: any,
  scoring: ScoringResult | undefined
) {
  const allResults: any[] = [];
  const totalFilesSet = new Set<string>();
  let criticalCount = 0;
  let majorCount = 0;

  res.summary.toolsRun.forEach((toolId: string) => {
    const spokeRes = res[toolId];
    if (!spokeRes || !spokeRes.results) return;

    spokeRes.results.forEach((r: any) => {
      totalFilesSet.add(r.fileName);
      allResults.push(r);
      r.issues?.forEach((i: any) => {
        if (i.severity === Severity.Critical || i.severity === 'critical')
          criticalCount++;
        if (i.severity === Severity.Major || i.severity === 'major')
          majorCount++;
      });
    });
  });

  return {
    ...res,
    results: allResults,
    summary: {
      ...res.summary,
      totalFiles: totalFilesSet.size,
      criticalIssues: criticalCount,
      majorIssues: majorCount,
    },
    scoring,
  };
}
