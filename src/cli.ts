#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  scanAction,
  scanHelpText,
  patternsAction,
  patternsHelpText,
  contextAction,
  consistencyAction,
  visualizeAction,
  visualizeHelpText,
  visualiseHelpText,
  changeAmplificationAction,
  testabilityAction,
  uploadAction,
  uploadHelpText,
  clawmartMeAction,
  clawmartListingsAction,
  clawmartCreateAction,
  clawmartUploadAction,
  clawmartDownloadAction,
  clawmartHelpText,
  bugAction,
  bugHelpText,
} from './commands';

const getDirname = () => {
  if (typeof __dirname !== 'undefined') return __dirname;
  return dirname(fileURLToPath(import.meta.url));
};

const packageJson = JSON.parse(
  readFileSync(join(getDirname(), '../package.json'), 'utf8')
);

const program = new Command();

program
  .name('aiready')
  .description('AIReady - Assess and improve AI-readiness of codebases')
  .version(packageJson.version)
  .addHelpText(
    'after',
    `
AI READINESS SCORING:
  Get a 0-100 score indicating how AI-ready your codebase is.
  Use --score flag with any analysis command for detailed breakdown.

EXAMPLES:
  $ aiready scan                          # Comprehensive analysis of current directory
  $ aiready scan --score                  # Get AI Readiness Score (0-100)
  $ aiready scan --tools patterns         # Run only pattern detection
  $ npx @aiready/cli scan                 # Industry standard way to run standard scan
  $ aiready scan --output json            # Output raw JSON for piping

GETTING STARTED:
  1. Run 'aiready scan' to analyze your codebase
  2. Use 'aiready scan --score' for AI readiness assessment
  3. Create aiready.json for persistent configuration
  4. Set up CI/CD with '--threshold' for quality gates

CONFIGURATION:
  Config files (searched upward): aiready.json, .aiready.json, aiready.config.*
  CLI options override config file settings

  Example aiready.json:
  {
    "scan": { "exclude": ["**/dist/**", "**/node_modules/**"] },
    "tools": {
      "pattern-detect": { "minSimilarity": 0.5 },
      "context-analyzer": { "maxContextBudget": 15000 }
    },
    "output": { "format": "json", "directory": ".aiready" }
  }

VERSION: ${packageJson.version}
DOCUMENTATION: https://aiready.dev/docs/cli
GITHUB: https://github.com/caopengau/aiready-cli
LANDING: https://github.com/caopengau/aiready-landing`
  );

// Scan command - Run comprehensive AI-readiness analysis
program
  .command('scan')
  .description(
    'Run comprehensive AI-readiness analysis (patterns + context + consistency)'
  )
  .argument('[directory]', 'Directory to analyze', '.')
  .option(
    '-t, --tools <tools>',
    'Tools to run (comma-separated: patterns,context,consistency,doc-drift,deps-health,aiSignalClarity,grounding,testability,changeAmplification)'
  )
  .option(
    '--profile <type>',
    'Scan profile to use (agentic, cost, logic, ui, security, onboarding)'
  )
  .option(
    '--compare-to <path>',
    'Compare results against a previous AIReady report JSON'
  )
  .option('--include <patterns>', 'File patterns to include (comma-separated)')
  .option('--exclude <patterns>', 'File patterns to exclude (comma-separated)')
  .option('-o, --output <format>', 'Output format: console, json', 'console')
  .option('--output-file <path>', 'Output file path (for json)')
  .option('--score', 'Calculate and display AI Readiness Score (0-100)')
  .option(
    '--no-score',
    'Disable calculating AI Readiness Score (enabled by default)'
  )
  .option('--weights <weights>', 'Custom scoring weights')
  .option('--threshold <score>', 'Fail CI/CD if score below threshold (0-100)')
  .option(
    '--ci',
    'CI mode: GitHub Actions annotations, no colors, fail on threshold'
  )
  .option(
    '--fail-on <level>',
    'Fail on issues: critical, major, any',
    'critical'
  )
  .option('--api-key <key>', 'Platform API key for automatic upload')
  .option('--upload', 'Automatically upload results to the platform')
  .option('--server <url>', 'Custom platform URL')
  .addHelpText('after', scanHelpText)
  .action(async (directory, options) => {
    await scanAction(directory, options);
  });

// Patterns command - Detect duplicate code patterns
program
  .command('patterns')
  .description('Detect duplicate code patterns that confuse AI models')
  .argument('[directory]', 'Directory to analyze', '.')
  .option('-s, --similarity <number>', 'Minimum similarity score (0-1)', '0.40')
  .option('-l, --min-lines <number>', 'Minimum lines to consider', '5')
  .option(
    '--max-candidates <number>',
    'Maximum candidates per block (performance tuning)'
  )
  .option(
    '--min-shared-tokens <number>',
    'Minimum shared tokens for candidates (performance tuning)'
  )
  .option(
    '--full-scan',
    'Disable smart defaults for comprehensive analysis (slower)'
  )
  .option('--include <patterns>', 'File patterns to include (comma-separated)')
  .option('--exclude <patterns>', 'File patterns to exclude (comma-separated)')
  .option('-o, --output <format>', 'Output format: console, json', 'console')
  .option('--output-file <path>', 'Output file path (for json)')
  .option(
    '--score',
    'Calculate and display AI Readiness Score for patterns (0-100)'
  )
  .addHelpText('after', patternsHelpText)
  .action(async (directory, options) => {
    await patternsAction(directory, options);
  });

// Context command - Analyze context window costs
program
  .command('context')
  .description('Analyze context window costs and dependency fragmentation')
  .argument('[directory]', 'Directory to analyze', '.')
  .option('--max-depth <number>', 'Maximum acceptable import depth', '5')
  .option(
    '--max-context <number>',
    'Maximum acceptable context budget (tokens)',
    '10000'
  )
  .option('--include <patterns>', 'File patterns to include (comma-separated)')
  .option('--exclude <patterns>', 'File patterns to exclude (comma-separated)')
  .option('-o, --output <format>', 'Output format: console, json', 'console')
  .option('--output-file <path>', 'Output file path (for json)')
  .option(
    '--score',
    'Calculate and display AI Readiness Score for context (0-100)'
  )
  .action(async (directory, options) => {
    await contextAction(directory, options);
  });

// Consistency command - Check naming conventions
program
  .command('consistency')
  .description('Check naming conventions and architectural consistency')
  .argument('[directory]', 'Directory to analyze', '.')
  .option('--naming', 'Check naming conventions (default: true)')
  .option('--no-naming', 'Skip naming analysis')
  .option('--patterns', 'Check code patterns (default: true)')
  .option('--no-patterns', 'Skip pattern analysis')
  .option(
    '--min-severity <level>',
    'Minimum severity: info|minor|major|critical',
    'info'
  )
  .option('--include <patterns>', 'File patterns to include (comma-separated)')
  .option('--exclude <patterns>', 'File patterns to exclude (comma-separated)')
  .option(
    '-o, --output <format>',
    'Output format: console, json, markdown',
    'console'
  )
  .option('--output-file <path>', 'Output file path (for json/markdown)')
  .option(
    '--score',
    'Calculate and display AI Readiness Score for consistency (0-100)'
  )
  .action(async (directory, options) => {
    await consistencyAction(directory, options);
  });

// Visualise command (British spelling alias)
program
  .command('visualise')
  .description('Alias for visualize (British spelling)')
  .argument('[directory]', 'Directory to analyze', '.')
  .option(
    '--report <path>',
    'Report path (auto-detects latest .aiready/aiready-report-*.json if not provided)'
  )
  .option(
    '-o, --output <path>',
    'Output HTML path (relative to directory)',
    'packages/visualizer/visualization.html'
  )
  .option('--open', 'Open generated HTML in default browser')
  .option(
    '--serve [port]',
    'Start a local static server to serve the visualization (optional port number)',
    false
  )
  .option(
    '--dev',
    'Start Vite dev server (live reload) for interactive development',
    true
  )
  .addHelpText('after', visualiseHelpText)
  .action(async (directory, options) => {
    await visualizeAction(directory, options);
  });

// Visualize command - Generate interactive visualization
program
  .command('visualize')
  .description('Generate interactive visualization from an AIReady report')
  .argument('[directory]', 'Directory to analyze', '.')
  .option(
    '--report <path>',
    'Report path (auto-detects latest .aiready/aiready-report-*.json if not provided)'
  )
  .option(
    '-o, --output <path>',
    'Output HTML path (relative to directory)',
    'packages/visualizer/visualization.html'
  )
  .option('--open', 'Open generated HTML in default browser')
  .option(
    '--serve [port]',
    'Start a local static server to serve the visualization (optional port number)',
    false
  )
  .option(
    '--dev',
    'Start Vite dev server (live reload) for interactive development',
    false
  )
  .addHelpText('after', visualizeHelpText)
  .action(async (directory, options) => {
    await visualizeAction(directory, options);
  });

// Change Amplification command
program
  .command('change-amplification')
  .description('Analyze graph metrics for change amplification')
  .argument('[directory]', 'Directory to analyze', '.')
  .option('--include <patterns>', 'File patterns to include (comma-separated)')
  .option('--exclude <patterns>', 'File patterns to exclude (comma-separated)')
  .option('-o, --output <format>', 'Output format: console, json', 'console')
  .option('--output-file <path>', 'Output file path (for json)')
  .action(async (directory, options) => {
    await changeAmplificationAction(directory, options);
  });

// Testability command
program
  .command('testability')
  .description('Analyze test coverage and AI readiness')
  .argument('[directory]', 'Directory to analyze', '.')
  .option('--min-coverage <ratio>', 'Minimum acceptable coverage ratio', '0.3')
  .option('--include <patterns>', 'File patterns to include (comma-separated)')
  .option('--exclude <patterns>', 'File patterns to exclude (comma-separated)')
  .option('-o, --output <format>', 'Output format: console, json', 'console')
  .option('--output-file <path>', 'Output file path (for json)')
  .action(async (directory, options) => {
    await testabilityAction(directory, options);
  });

// Upload command - Upload report JSON to platform
program
  .command('upload')
  .description('Upload an AIReady report JSON to the platform')
  .argument('<file>', 'Report JSON file to upload')
  .option('--api-key <key>', 'Platform API key')
  .option('--repo-id <id>', 'Platform repository ID (optional)')
  .option('--server <url>', 'Custom platform URL')
  .addHelpText('after', uploadHelpText)
  .action(async (file, options) => {
    await uploadAction(file, options);
  });

// ClawMart commands
const clawmart = program
  .command('clawmart')
  .description('Manage ClawMart personas and skills')
  .addHelpText('after', clawmartHelpText);

clawmart
  .command('me')
  .description('Show my ClawMart creator profile')
  .option('--api-key <key>', 'ClawMart API key')
  .option('--server <url>', 'Custom ClawMart API server')
  .action(async (options) => {
    await clawmartMeAction(options);
  });

clawmart
  .command('listings')
  .description('Show my ClawMart listings')
  .option('-q, --query <string>', 'Search query')
  .option('-t, --type <type>', 'Filter by type: skill, persona')
  .option('-l, --limit <number>', 'Limit results', '10')
  .option('--api-key <key>', 'ClawMart API key')
  .option('--server <url>', 'Custom ClawMart API server')
  .action(async (options) => {
    await clawmartListingsAction(options);
  });

clawmart
  .command('create')
  .description('Create a new listing on ClawMart')
  .requiredOption('--name <string>', 'Listing name')
  .requiredOption('--tagline <string>', 'Short tagline')
  .option('--about <string>', 'Full description')
  .option('--category <string>', 'Category', 'Utility')
  .option('--capabilities <string>', 'Comma-separated list of capabilities')
  .option('--price <number>', 'Price in USD', '0')
  .option('--type <type>', 'Product type: skill, persona', 'skill')
  .option('--api-key <key>', 'ClawMart API key')
  .option('--server <url>', 'Custom ClawMart API server')
  .action(async (options) => {
    await clawmartCreateAction(options);
  });

clawmart
  .command('upload')
  .description('Upload content to a listing')
  .argument('<id>', 'Listing ID')
  .argument('<files...>', 'Files or directories to upload')
  .option('--api-key <key>', 'ClawMart API key')
  .option('--server <url>', 'Custom ClawMart API server')
  .action(async (id, files, options) => {
    await clawmartUploadAction(id, files as string[], options);
  });

clawmart
  .command('download')
  .description('Download a package from ClawMart')
  .argument('<idOrSlug>', 'Listing ID or Slug')
  .option('--outDir <path>', 'Output directory')
  .option('--api-key <key>', 'ClawMart API key')
  .option('--server <url>', 'Custom ClawMart API server')
  .action(async (idOrSlug, options) => {
    await clawmartDownloadAction(idOrSlug, options);
  });

program
  .command('bug')
  .description('Report a bug or provide feedback (Agent-friendly)')
  .argument('[message]', 'Short description of the issue')
  .option('-t, --type <type>', 'Issue type: bug, feature, metric', 'bug')
  .addHelpText('after', bugHelpText)
  .action(async (message, options) => {
    await bugAction(message, options);
  });

program.parse();
