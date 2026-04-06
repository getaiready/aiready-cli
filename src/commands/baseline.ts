/**
 * Baseline command - Manage debt-baseline snapshots for AIReady
 */

import chalk from 'chalk';
import { Command } from 'commander';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve as resolvePath, join } from 'path';
import { handleCLIError, getRepoMetadata } from '@aiready/core';
import { runUnifiedScan } from './scan-orchestrator';
import { mapToUnifiedReport } from './report-formatter';
import { type ScanOptions } from './scan-helpers';
import { resolveScanConfig } from './scan-config';

const BASELINE_DIR = '.aiready';
const BASELINE_FILE = 'baseline.json';

/**
 * CLI action handler for the "baseline create" command.
 */
export async function createBaselineAction(
  directory: string,
  options: ScanOptions
) {
  console.log(chalk.blue('📸 Creating AIReady debt baseline snapshot...\n'));

  const startTime = Date.now();
  const resolvedDir = resolvePath(process.cwd(), directory ?? '.');
  const repoMetadata = getRepoMetadata(resolvedDir);

  try {
    // 1. Resolve configuration
    const finalOptions = await resolveScanConfig(resolvedDir, options);

    // 2. Execute Full Scan
    console.log(
      chalk.dim('   Running full scan to capture all existing issues...')
    );
    const { results, scoringResult } = await runUnifiedScan(
      resolvedDir,
      { ...finalOptions, changedFilesOnly: false }, // Always full scan for baseline
      { ...options, score: true },
      startTime
    );

    // 3. Post-processing & Saving
    const outputData = {
      ...mapToUnifiedReport(results, scoringResult),
      repository: repoMetadata,
      timestamp: new Date().toISOString(),
    };

    const baselineDirPath = join(resolvedDir, BASELINE_DIR);
    if (!existsSync(baselineDirPath)) {
      mkdirSync(baselineDirPath, { recursive: true });
    }

    const baselinePath = join(baselineDirPath, BASELINE_FILE);
    writeFileSync(baselinePath, JSON.stringify(outputData, null, 2));

    console.log(
      chalk.green(`\n✅ Baseline successfully saved to ${baselinePath}`)
    );
    console.log(
      chalk.dim(
        '   Future scans with --baseline will filter against these findings.'
      )
    );
  } catch (error) {
    handleCLIError(error, 'Baseline Creation');
  }
}

/**
 * Define the baseline command.
 */
export function defineBaselineCommand(program: Command) {
  const baseline = program
    .command('baseline')
    .description('Manage debt-baseline snapshots for filtering legacy issues');

  baseline
    .command('create')
    .description('Create a new baseline snapshot of current findings')
    .argument('[directory]', 'Directory to analyze', '.')
    .option('-t, --tools <tools>', 'Tools to run (comma-separated)')
    .option('--profile <type>', 'Scan profile to use')
    .option('--include <patterns>', 'File patterns to include')
    .option('--exclude <patterns>', 'File patterns to exclude')
    .action(async (directory, options) => {
      await createBaselineAction(directory, options);
    });
}
