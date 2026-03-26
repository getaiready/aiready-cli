#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  defineScanCommand,
  initAction,
  definePatternsCommand,
  defineContextCommand,
  defineConsistencyCommand,
  visualizeAction,
  VISUALIZE_HELP_TEXT,
  VISUALISE_HELP_TEXT,
  changeAmplificationAction,
  testabilityAction,
  contractEnforcementAction,
  uploadAction,
  UPLOAD_HELP_TEXT,
  remediateAction,
  REMEDIATE_HELP_TEXT,
  bugAction,
  BUG_HELP_TEXT,
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
  $ aiready scan                          # Comprehensive analysis with AI Readiness Score
  $ aiready scan --no-score               # Run scan without score calculation
  $ aiready init                          # Create a default aiready.json configuration
  $ aiready init --full                   # Create configuration with ALL available options
  $ npx @aiready/cli scan                 # Industry standard way to run standard scan
  $ aiready scan --output json            # Output raw JSON for piping

GETTING STARTED:
  1. Run 'aiready init' to create a persistent 'aiready.json' config file
  2. Run 'aiready scan' to analyze your codebase and get an AI Readiness Score
  3. Use 'aiready init --full' to see every fine-tuning parameter available
  4. Use '--profile agentic' for agent-focused analysis
  5. Set up CI/CD with '--threshold' for quality gates

CONFIGURATION:
  Config files (searched upward): aiready.json, .aiready.json, aiready.config.*
  CLI options override config file settings

VERSION: ${packageJson.version}
DOCUMENTATION: https://aiready.dev/docs/cli
GITHUB: https://github.com/caopengau/aiready-cli
LANDING: https://github.com/caopengau/aiready-landing`
  );

// Core analysis commands
defineScanCommand(program);
definePatternsCommand(program);
defineContextCommand(program);
defineConsistencyCommand(program);

// Init command
program
  .command('init')
  .description('Generate a default configuration (aiready.json)')
  .option('-f, --force', 'Overwrite existing configuration file')
  .option(
    '--js',
    'Generate configuration as a JavaScript file (aiready.config.js)'
  )
  .option('--full', 'Generate a full configuration with all available options')
  .action(async (options) => {
    const format = options.js ? 'js' : 'json';
    await initAction({ force: options.force, format, full: options.full });
  });

// Visualization commands
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
  .addHelpText('after', VISUALISE_HELP_TEXT)
  .action(async (directory, options) => {
    await visualizeAction(directory, options);
  });

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
  .addHelpText('after', VISUALIZE_HELP_TEXT)
  .action(async (directory, options) => {
    await visualizeAction(directory, options);
  });

// Utility commands
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

program
  .command('contract')
  .description('Analyze structural contract enforcement and defensive coding')
  .argument('[directory]', 'Directory to analyze', '.')
  .option(
    '--min-chain-depth <depth>',
    'Minimum optional chain depth to flag',
    '3'
  )
  .option('--include <patterns>', 'File patterns to include (comma-separated)')
  .option('--exclude <patterns>', 'File patterns to exclude (comma-separated)')
  .option('-o, --output <format>', 'Output format: console, json', 'console')
  .option('--output-file <path>', 'Output file path (for json)')
  .action(async (directory, options) => {
    await contractEnforcementAction(directory, options);
  });

program
  .command('upload')
  .description('Upload an AIReady report JSON to the platform')
  .argument('<file>', 'Report JSON file to upload')
  .option('--api-key <key>', 'Platform API key')
  .option('--repo-id <id>', 'Platform repository ID (optional)')
  .option('--server <url>', 'Custom platform URL')
  .addHelpText('after', UPLOAD_HELP_TEXT)
  .action(async (file, options) => {
    await uploadAction(file, options);
  });

program
  .command('remediate')
  .description('Suggest AI-ready refactors based on a scan report')
  .argument('[directory]', 'Directory to remediate', '.')
  .option('-r, --report <path>', 'AIReady report JSON file')
  .option('-t, --tool <name>', 'Filter by tool: patterns, context, consistency')
  .option('--server <url>', 'Custom platform URL')
  .addHelpText('after', REMEDIATE_HELP_TEXT)
  .action(async (directory, options) => {
    await remediateAction(directory, options);
  });

program
  .command('bug')
  .description('Report a bug or provide feedback (Agent-friendly)')
  .argument('[message]', 'Short description of the issue')
  .option('-t, --type <type>', 'Issue type: bug, feature, metric', 'bug')
  .option('--submit', 'Submit the issue directly using the GitHub CLI (gh)')
  .addHelpText('after', BUG_HELP_TEXT)
  .action(async (message, options) => {
    await bugAction(message, options);
  });

program.parse();
