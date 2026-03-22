/**
 * Patterns command - Detect duplicate code patterns that confuse AI models
 */

import chalk from 'chalk';
import {
  handleCLIError,
  getElapsedTime,
  formatToolScore,
  printTerminalHeader,
  getTerminalDivider,
  prepareActionConfig,
  resolveOutputFormat,
  formatStandardReport,
  handleStandardJSONOutput,
} from '@aiready/core';
import type { ToolScoringOutput } from '@aiready/core';

interface PatternsOptions {
  similarity?: string;
  minLines?: string;
  maxCandidates?: string;
  minSharedTokens?: string;
  fullScan?: boolean;
  include?: string;
  exclude?: string;
  output?: string;
  outputFile?: string;
  score?: boolean;
}

export async function patternsAction(
  directory: string,
  options: PatternsOptions
) {
  console.log(chalk.blue('🔍 Analyzing patterns...\n'));

  const startTime = Date.now();

  try {
    // Determine if smart defaults should be used
    const useSmartDefaults = !options.fullScan;

    // Define defaults (only for options not handled by smart defaults)
    const defaults = {
      useSmartDefaults,
      include: undefined,
      exclude: undefined,
      output: {
        format: 'console',
        file: undefined,
      },
    };

    // Set fallback defaults only if smart defaults are disabled
    if (!useSmartDefaults) {
      (defaults as any).minSimilarity = 0.4;
      (defaults as any).minLines = 5;
    }

    // Load and merge config with CLI options
    const cliOptions: any = {
      minSimilarity: options.similarity
        ? parseFloat(options.similarity)
        : undefined,
      minLines: options.minLines ? parseInt(options.minLines) : undefined,
      useSmartDefaults,
      include: options.include?.split(','),
      exclude: options.exclude?.split(','),
    };

    // Only include performance tuning options if explicitly specified
    if (options.maxCandidates) {
      cliOptions.maxCandidatesPerBlock = parseInt(options.maxCandidates);
    }
    if (options.minSharedTokens) {
      cliOptions.minSharedTokens = parseInt(options.minSharedTokens);
    }

    const { resolvedDir, finalOptions } = await prepareActionConfig(
      directory,
      defaults,
      cliOptions
    );

    const { analyzePatterns, generateSummary, calculatePatternScore } =
      await import('@aiready/pattern-detect');

    const { results, duplicates } = (await analyzePatterns(
      finalOptions
    )) as any;

    const elapsedTime = getElapsedTime(startTime);
    const summary = generateSummary(results);

    // Calculate score if requested
    let patternScore: ToolScoringOutput | undefined;
    if (options.score) {
      patternScore = calculatePatternScore(duplicates, results.length);
    }

    const { format: outputFormat, file: userOutputFile } = resolveOutputFormat(
      options,
      finalOptions
    );

    if (outputFormat === 'json') {
      const outputData = formatStandardReport({
        results,
        summary,
        elapsedTime,
        score: patternScore,
      });

      handleStandardJSONOutput({
        outputData,
        outputFile: userOutputFile,
        resolvedDir,
      });
    } else {
      // Console output - format to match standalone CLI
      printTerminalHeader('PATTERN ANALYSIS SUMMARY');

      console.log(
        chalk.white(`📁 Files analyzed: ${chalk.bold(results.length)}`)
      );
      console.log(
        chalk.yellow(
          `⚠  Duplicate patterns found: ${chalk.bold(summary.totalPatterns)}`
        )
      );
      console.log(
        chalk.red(
          `💰 Token cost (wasted): ${chalk.bold(summary.totalTokenCost.toLocaleString())}`
        )
      );
      console.log(
        chalk.gray(`⏱  Analysis time: ${chalk.bold(elapsedTime + 's')}`)
      );

      // Show breakdown by pattern type
      const sortedTypes = Object.entries(summary.patternsByType || {})
        .filter(([, count]) => count > 0)
        .sort(([, a], [, b]) => (b as number) - (a as number));

      if (sortedTypes.length > 0) {
        console.log('\n' + getTerminalDivider());
        console.log(chalk.bold.white('  PATTERNS BY TYPE'));
        console.log(getTerminalDivider() + '\n');
        sortedTypes.forEach(([type, count]) => {
          console.log(`  ${chalk.white(type.padEnd(15))} ${chalk.bold(count)}`);
        });
      }

      // Show top duplicates
      if (summary.totalPatterns > 0 && duplicates.length > 0) {
        console.log('\n' + getTerminalDivider());
        console.log(chalk.bold.white('  TOP DUPLICATE PATTERNS'));
        console.log(getTerminalDivider() + '\n');

        // Sort by similarity and take top 10
        const topDuplicates = [...duplicates]
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 10);

        topDuplicates.forEach((dup) => {
          const severity =
            dup.similarity > 0.95
              ? 'CRITICAL'
              : dup.similarity > 0.9
                ? 'HIGH'
                : 'MEDIUM';
          const severityIcon =
            dup.similarity > 0.95 ? '🔴' : dup.similarity > 0.9 ? '🟡' : '🔵';
          const file1Name = dup.file1.split('/').pop() || dup.file1;
          const file2Name = dup.file2.split('/').pop() || dup.file2;
          console.log(
            `${severityIcon} ${severity}: ${chalk.bold(file1Name)} ↔ ${chalk.bold(file2Name)}`
          );
          console.log(
            `   Similarity: ${chalk.bold(Math.round(dup.similarity * 100) + '%')} | Wasted: ${chalk.bold(dup.tokenCost.toLocaleString())} tokens each`
          );
          console.log(
            `   Lines: ${chalk.cyan(dup.line1 + '-' + dup.endLine1)} ↔ ${chalk.cyan(dup.line2 + '-' + dup.endLine2)}\n`
          );
        });
      } else {
        console.log(
          chalk.green('\n✨ Great! No duplicate patterns detected.\n')
        );
      }

      // Display score if calculated
      if (patternScore) {
        console.log(getTerminalDivider());
        console.log(chalk.bold.white('  AI READINESS SCORE (Patterns)'));
        console.log(getTerminalDivider() + '\n');
        console.log(formatToolScore(patternScore));
        console.log();
      }
    }
  } catch (error) {
    handleCLIError(error, 'Pattern analysis');
  }
}

export const PATTERNS_HELP_TEXT = `
EXAMPLES:
  $ aiready patterns                                 # Default analysis
  $ aiready patterns --similarity 0.6               # Stricter matching
  $ aiready patterns --min-lines 10                 # Larger patterns only
`;
