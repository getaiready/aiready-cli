import chalk from 'chalk';

/**
 * Get a formatted terminal divider string based on current terminal width.
 *
 * @param color - Chalk color function to use for the divider.
 * @param maxWidth - Maximum width for the divider (default: 60).
 * @returns String representation of the divider.
 */
export function getTerminalDivider(
  color: any = chalk.cyan,
  maxWidth: number = 60
): string {
  const terminalWidth = process.stdout.columns || 80;
  const dividerWidth = Math.min(maxWidth, terminalWidth - 2);
  return color('━'.repeat(dividerWidth));
}

/**
 * Print a standard terminal header with dividers.
 *
 * @param title - Header title text.
 * @param color - Chalk color function for the dividers.
 */
export function printTerminalHeader(
  title: string,
  color: any = chalk.cyan
): void {
  const divider = getTerminalDivider(color);
  console.log(divider);
  console.log(chalk.bold.white(`  ${title.toUpperCase()}`));
  console.log(divider + '\n');
}

/**
 * Generate a visual score bar for console output
 *
 * @param val - Score value between 0 and 100.
 * @returns String representation of the bar (e.g., "█████░░░░░").
 * @lastUpdated 2026-03-18
 */
export function getScoreBar(val: number): string {
  const clamped = Math.max(0, Math.min(100, val));
  return '█'.repeat(Math.round(clamped / 10)).padEnd(10, '░');
}

/**
 * Get status icon for safety ratings
 *
 * @param rating - The safety rating slug.
 * @returns Emoji icon representing the rating.
 * @lastUpdated 2026-03-18
 */
export function getSafetyIcon(rating: string): string {
  switch (rating) {
    case 'safe':
      return '✅';
    case 'moderate-risk':
      return '⚠️ ';
    case 'high-risk':
      return '🔴';
    case 'blind-risk':
      return '💀';
    default:
      return '❓';
  }
}

export { getSeverityBadge } from './severity-utils';
