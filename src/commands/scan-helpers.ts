/**
 * Helper utilities for the scan command
 */

import chalk from 'chalk';
import { ToolName } from '@aiready/core';

export interface ScanOptions {
  tools?: string;
  profile?: string;
  compareTo?: string;
  include?: string;
  exclude?: string;
  output?: string;
  outputFile?: string;
  score?: boolean;
  noScore?: boolean;
  weights?: string;
  threshold?: string;
  ci?: boolean;
  failOn?: string;
  model?: string;
  apiKey?: string;
  upload?: boolean;
  server?: string;
}

/**
 * Map profile name to tool IDs
 */
export function getProfileTools(profile: string): string[] | undefined {
  switch (profile.toLowerCase()) {
    case 'agentic':
      return [
        ToolName.AiSignalClarity,
        ToolName.AgentGrounding,
        ToolName.TestabilityIndex,
      ];
    case 'cost':
      return [ToolName.PatternDetect, ToolName.ContextAnalyzer];
    case 'logic':
      return [
        ToolName.TestabilityIndex,
        ToolName.NamingConsistency,
        ToolName.ContextAnalyzer,
        ToolName.PatternDetect,
        ToolName.ChangeAmplification,
      ];
    case 'ui':
      return [
        ToolName.NamingConsistency,
        ToolName.ContextAnalyzer,
        ToolName.PatternDetect,
        ToolName.DocDrift,
        ToolName.AiSignalClarity,
      ];
    case 'security':
      return [ToolName.NamingConsistency, ToolName.TestabilityIndex];
    case 'onboarding':
      return [
        ToolName.ContextAnalyzer,
        ToolName.NamingConsistency,
        ToolName.AgentGrounding,
      ];
    default:
      console.log(
        chalk.yellow(`\n⚠️  Unknown profile '${profile}'. Using defaults.`)
      );
      return undefined;
  }
}

/**
 * Get default tools list
 */
export function getDefaultTools(): string[] {
  return [
    'pattern-detect',
    'context-analyzer',
    'naming-consistency',
    'ai-signal-clarity',
    'agent-grounding',
    'testability-index',
    'doc-drift',
    'dependency-health',
    'change-amplification',
  ];
}

/**
 * Create progress callback for tool execution
 */
export function createProgressCallback() {
  return (event: any) => {
    // Handle progress messages
    if (event.message) {
      process.stdout.write(`\r\x1b[K   [${event.tool}] ${event.message}`);
      return;
    }

    // Handle tool completion
    process.stdout.write('\r\x1b[K'); // Clear the progress line
    console.log(chalk.cyan(`--- ${event.tool.toUpperCase()} RESULTS ---`));
    const res = event.data;
    if (res && res.summary) {
      if (res.summary.totalIssues !== undefined)
        console.log(`  Issues found: ${chalk.bold(res.summary.totalIssues)}`);
      if (res.summary.score !== undefined)
        console.log(`  Tool Score: ${chalk.bold(res.summary.score)}/100`);
      if (res.summary.totalFiles !== undefined)
        console.log(`  Files analyzed: ${chalk.bold(res.summary.totalFiles)}`);
    }
  };
}
