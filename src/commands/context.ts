/**
 * Context analysis command - Analyze context window costs and dependency fragmentation
 */

import { type Command } from 'commander';
import {
  defineStandardTool,
  renderSubSection,
  renderToolScoreFooter,
  printTerminalHeader,
  chalk,
  type CommonToolOptions,
} from './shared/command-builder';

export { contextAction } from './shared/standard-tool-actions';

interface ContextOptions extends CommonToolOptions {
  maxDepth?: string;
  maxContext?: string;
}

/**
 * Define the context command.
 *
 * @param program - Commander program instance
 */
export function defineContextCommand(program: Command) {
  defineStandardTool(program, {
    name: 'context',
    description: 'Analyze context window costs and dependency fragmentation',
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
    options: [
      {
        flags: '--max-depth <number>',
        description: 'Maximum acceptable import depth',
        defaultValue: '5',
      },
      {
        flags: '--max-context <number>',
        description: 'Maximum acceptable context budget (tokens)',
        defaultValue: '10000',
      },
    ],
    getCliOptions: (opts: ContextOptions) => ({
      maxDepth: opts.maxDepth ? parseInt(opts.maxDepth) : undefined,
      maxContextBudget: opts.maxContext ? parseInt(opts.maxContext) : undefined,
    }),
    renderConsole: ({ summary: rawSummary, elapsedTime, score }) => {
      const summary = rawSummary as any;
      printTerminalHeader('CONTEXT ANALYSIS SUMMARY');

      console.log(
        chalk.white(`📁 Total files: ${chalk.bold(summary.totalFiles)}`)
      );
      console.log(
        chalk.white(
          `💸 Total tokens (context budget): ${chalk.bold(summary.totalTokens.toLocaleString())}`
        )
      );
      console.log(
        chalk.gray(`⏱  Analysis time: ${chalk.bold(elapsedTime + 's')}`)
      );

      if (summary.fragmentedModules.length > 0) {
        renderSubSection('Top Fragmented Modules');
        summary.fragmentedModules.slice(0, 5).forEach((mod: any) => {
          const scoreColor =
            mod.fragmentationScore > 0.7
              ? chalk.red
              : mod.fragmentationScore > 0.4
                ? chalk.yellow
                : chalk.green;

          console.log(
            `  ${scoreColor('■')} ${chalk.white(mod.domain.padEnd(20))} ${chalk.bold((mod.fragmentationScore * 100).toFixed(0) + '%')} fragmentation`
          );
        });
      }

      if (summary.topExpensiveFiles && summary.topExpensiveFiles.length > 0) {
        renderSubSection('Top Context-Expensive Files');
        summary.topExpensiveFiles.slice(0, 5).forEach((file: any) => {
          const icon =
            file.severity === 'critical'
              ? '🔴'
              : file.severity === 'major'
                ? '🟡'
                : '🔵';
          const color =
            file.severity === 'critical'
              ? chalk.red
              : file.severity === 'major'
                ? chalk.yellow
                : chalk.blue;

          console.log(
            `  ${icon} ${color(file.severity.toUpperCase())}: ${chalk.white(file.file)} (${chalk.bold(file.contextBudget.toLocaleString())} tokens)`
          );
        });
      }

      renderToolScoreFooter(score);
    },
  });
}
