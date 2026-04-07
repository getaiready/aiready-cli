import { Command } from 'commander';
import {
  loadConfig,
  validateConfig,
  type ValidationWarning,
} from '@aiready/core';
import chalk from 'chalk';

const VALIDATE_HELP_TEXT = `Validate aiready configuration and check for common issues.

This command checks:
- Schema validity
- Valid glob patterns
- Duplicate exclusions
- Overlapping patterns
- Config inheritance issues
- Recommended practices

EXAMPLES:
  $ aiready validate                    # Validate config in current directory
  $ aiready validate ./path/to/config # Validate specific config file`;

/**
 * Define the validate command.
 */
export function defineValidateCommand(program: Command): void {
  program
    .command('validate')
    .description(VALIDATE_HELP_TEXT)
    .argument(
      '[path]',
      'Path to config file or directory (defaults to current directory)'
    )
    .option('--no-warnings', 'Only show errors, suppress warnings')
    .action(async (path: string, options) => {
      const showWarnings = options.warnings !== false;
      await validateAction(path, showWarnings);
    });
}

/**
 * Execute the validate action.
 */
async function validateAction(
  path: string | undefined,
  showWarnings: boolean
): Promise<void> {
  const targetPath = path || process.cwd();

  console.log(chalk.blue(`\nValidating aiready configuration...\n`));

  try {
    const { config, warnings } = await loadConfig(targetPath, {
      validate: true,
      applyAutoExclude: false,
    });

    if (!config) {
      console.log(chalk.yellow('⚠ No aiready configuration found'));
      process.exit(1);
    }

    console.log(chalk.green('✓ Configuration is valid'));

    const errors: ValidationWarning[] = warnings.filter(
      (w) => w.rule === 'parse-error' || w.rule === 'schema-error'
    );

    const warningsFiltered = showWarnings
      ? warnings
      : warnings.filter((w) => w.rule !== 'config-inheritance');

    if (errors.length > 0) {
      console.log(chalk.red('\nErrors:'));
      for (const error of errors) {
        console.log(chalk.red(`  ✗ ${error.message}`));
      }
      process.exit(1);
    }

    if (warningsFiltered.length > 0 && showWarnings) {
      console.log(chalk.yellow('\nWarnings:'));
      for (const warning of warningsFiltered) {
        const icon = warning.suggestion ? '⚡' : '⚠';
        console.log(chalk.yellow(`  ${icon} ${warning.message}`));
        if (warning.suggestion) {
          console.log(chalk.gray(`    → ${warning.suggestion}`));
        }
      }
    }

    const stats = getConfigStats(config);
    console.log(chalk.cyan('\nConfiguration Stats:'));
    console.log(`  Tools: ${stats.tools}`);
    console.log(`  Exclusions: ${stats.exclusions}`);
    if (config.extends) {
      console.log(`  Extends: ${config.extends}`);
    }
    if (config.autoExclude) {
      console.log(`  Auto-exclude: ${JSON.stringify(config.autoExclude)}`);
    }

    console.log('');
  } catch (error) {
    console.error(
      chalk.red(
        `\n✗ Validation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    );
    process.exit(1);
  }
}

/**
 * Get statistics from the configuration.
 */
function getConfigStats(config: any): { tools: number; exclusions: number } {
  const tools = config.tools ? Object.keys(config.tools).length : 0;

  let exclusions = 0;
  if (config.exclude) {
    if (Array.isArray(config.exclude)) {
      exclusions = config.exclude.length;
    } else {
      exclusions = Object.values(config.exclude).flat().length;
    }
  }

  return { tools, exclusions };
}
