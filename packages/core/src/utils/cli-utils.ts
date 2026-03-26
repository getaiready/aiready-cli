export { getSafetyIcon } from './terminal-utils';

/**
 * Calculate elapsed time and format for display
 *
 * @param startTime - Start timestamp in milliseconds.
 * @returns Formatted duration string in seconds.
 */
export function getElapsedTime(startTime: number): string {
  return ((Date.now() - startTime) / 1000).toFixed(2);
}

/**
 * Common CLI error handler for CLI commands.
 */
export function handleCLIError(error: unknown, commandName: string): never {
  console.error(`❌ ${commandName} failed:`, error);
  process.exit(1);
}

export * from './severity-utils';
export * from './terminal-ui';
export * from './progress-utils';
