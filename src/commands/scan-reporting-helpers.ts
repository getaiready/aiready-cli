import chalk from 'chalk';

/**
 * Prints a suggestion for reporting bugs to an AI agent.
 */
export function printBugReportSuggestion() {
  console.log(
    chalk.dim(
      '\n──────────────────────────────────────────────────────────────────'
    )
  );
  console.log(chalk.dim('💬 Found a bug or have a metric idea?'));
  console.log(chalk.dim('👉 Copy/paste this to your AI agent:'));
  console.log(
    chalk.cyan(
      `   "Any feedback for the tools? Please use 'aiready bug' to report ❤️"`
    )
  );
  console.log(
    chalk.dim(
      '──────────────────────────────────────────────────────────────────'
    )
  );
}
