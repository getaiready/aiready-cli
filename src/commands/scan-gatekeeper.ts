import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { resolve as resolvePath, join, relative } from 'path';
import { emitIssuesAsAnnotations } from '@aiready/core';
import type { UnifiedReport, ScoringResult } from '@aiready/core';
import { type ScanOptions } from './scan-helpers';

/**
 * Applies baseline filtering and severity overrides to the report.
 */
export function applyGatingRules(
  report: UnifiedReport,
  options: ScanOptions,
  finalOptions: Record<string, unknown>,
  resolvedDir: string
) {
  // 1. Load Baseline if requested
  const baselineHashes = new Set<string>();
  if (options.baseline) {
    const baselinePath = join(resolvedDir, '.aiready', 'baseline.json');
    if (existsSync(baselinePath)) {
      try {
        const baseline = JSON.parse(readFileSync(baselinePath, 'utf-8'));
        if (baseline.results) {
          baseline.results.forEach((fileRes: any) => {
            const relPath = relative(
              resolvedDir,
              resolvePath(resolvedDir, fileRes.fileName || fileRes.filePath)
            );
            if (fileRes.issues) {
              fileRes.issues.forEach((issue: any) => {
                baselineHashes.add(
                  getIssueHash(issue, issue.toolId || 'unknown', relPath)
                );
              });
            }
          });
        }
        console.log(
          chalk.dim(
            `   Loaded baseline with ${baselineHashes.size} existing issues to filter.`
          )
        );
      } catch (_err) {
        console.warn(
          chalk.yellow(
            `   Warning: Failed to load baseline from ${baselinePath}`
          )
        );
      }
    } else {
      console.warn(
        chalk.yellow(`   Warning: Baseline file not found at ${baselinePath}`)
      );
    }
  }

  // 2. Apply Severity Overrides and Filter Baseline
  let criticalCount = 0;
  let majorCount = 0;
  let minorCount = 0;

  report.results.forEach((fileRes: Record<string, any>) => {
    const relPath = relative(
      resolvedDir,
      resolvePath(resolvedDir, fileRes.fileName || fileRes.filePath)
    );
    const filteredIssues = (fileRes.issues || []).filter((issue: any) => {
      // a. Apply Severity Overrides
      const toolId = issue.toolId || 'unknown';
      const category = issue.category || '';
      const toolConfig =
        (finalOptions.tools as Record<string, any>)?.[toolId] || {};
      const overrides =
        (toolConfig.severityOverrides as Record<string, any>) || {};

      if (overrides[category]) {
        issue.severity = overrides[category];
      }

      // b. Baseline Filtering
      if (options.baseline) {
        const hash = getIssueHash(issue, toolId, relPath);
        if (baselineHashes.has(hash)) {
          return false; // Skip existing issue
        }
      }
      return true;
    });

    fileRes.issues = filteredIssues;
    filteredIssues.forEach((i: any) => {
      const severityLevel = String(i.severity || '').toLowerCase();
      if (severityLevel === 'critical') criticalCount++;
      else if (severityLevel === 'major') majorCount++;
      else if (severityLevel === 'minor') minorCount++;
    });
  });

  // Update summary counts
  report.summary.criticalIssues = criticalCount;
  report.summary.majorIssues = majorCount;
  report.summary.minorIssues = minorCount;

  if (options.baseline && baselineHashes.size > 0) {
    const totalRemaining = criticalCount + majorCount + minorCount;
    console.log(
      chalk.green(
        `   Baseline filtering applied: ${totalRemaining} new issues remaining.`
      )
    );
  }
}

/**
 * Handles threshold checks and CI failures based on scan results.
 */
export async function handleGatekeeper(
  outputData: UnifiedReport,
  scoringResult: ScoringResult | undefined,
  options: ScanOptions,
  finalOptions: Record<string, unknown>,
  resolvedDir: string
) {
  void resolvedDir; // For future use if needed
  if (!scoringResult) return;

  const threshold = options.threshold
    ? parseInt(options.threshold)
    : (finalOptions.threshold as number | undefined);

  const isCI = options.ci ?? process.env.CI === 'true';

  // AIReady is a quality gate. If a threshold is defined, it should be enforced by default
  // unless explicitly disabled with --fail-on none.
  const defaultFailOn = isCI || threshold !== undefined ? 'critical' : 'none';

  const failOnLevel =
    options.failOn ??
    (finalOptions.failOn as string | undefined) ??
    defaultFailOn;

  let shouldFail = false;
  let failReason = '';

  // Emit annotations only in CI
  if (isCI && outputData.results && outputData.results.length > 0) {
    console.log(
      chalk.cyan(
        `\n📝 Emitting GitHub Action annotations for ${outputData.results.length} issues...`
      )
    );
    emitIssuesAsAnnotations(outputData.results);
  }

  if (failOnLevel !== 'none') {
    if (threshold && scoringResult.overall < threshold) {
      shouldFail = true;
      failReason = `Score ${scoringResult.overall} < threshold ${threshold}`;
    }
  }

  if (failOnLevel !== 'none' && !shouldFail) {
    if (failOnLevel === 'critical' && outputData.summary.criticalIssues > 0) {
      shouldFail = true;
      failReason = `Found ${outputData.summary.criticalIssues} critical issues`;
    } else if (
      failOnLevel === 'major' &&
      outputData.summary.criticalIssues + outputData.summary.majorIssues > 0
    ) {
      shouldFail = true;
      failReason = `Found ${outputData.summary.criticalIssues} critical and ${outputData.summary.majorIssues} major issues`;
    }
  }

  if (shouldFail) {
    console.log(chalk.red(`\n🚫 SCAN FAILED: ${failReason}`));
    process.exit(1);
  } else {
    console.log(chalk.green('\n✅ SCAN PASSED'));
  }
}

/**
 * Generate a unique hash for an issue to identify it across scans.
 * Excludes line numbers to handle code shifts.
 */
export function getIssueHash(
  issue: any,
  toolId: string,
  relativePath: string
): string {
  const parts = [
    toolId,
    issue.category || issue.type || '',
    relativePath,
    (issue.message || '').trim().toLowerCase(),
  ];
  return parts.join('|');
}
