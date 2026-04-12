/**
 * Agent grounding command - Analyze agent grounding readiness
 */

import { type Command } from 'commander';
import {
  defineStandardTool,
  renderStandardSummary,
  type CommonToolOptions,
} from './shared/command-builder';

export { agentGroundingAction } from './shared/standard-tool-actions';

interface GroundingOptions extends CommonToolOptions {
  maxDepth?: string;
  readmeStaleDays?: string;
}

/**
 * Define the agent grounding command.
 */
export function defineAgentGroundingCommand(program: Command) {
  defineStandardTool(program, {
    name: 'grounding',
    description: 'Analyze agent grounding readiness',
    toolName: 'agent-grounding',
    label: 'Agent grounding',
    emoji: '🧭',
    importPath: '@aiready/agent-grounding',
    analyzeFnName: 'analyzeAgentGrounding',
    scoreFnName: 'calculateGroundingScore',
    defaults: { maxRecommendedDepth: 4, readmeStaleDays: 90 },
    options: [
      {
        flags: '--max-depth <number>',
        description: 'Maximum recommended import depth',
        defaultValue: '4',
      },
      {
        flags: '--readme-stale-days <number>',
        description: 'Days before README is considered stale',
        defaultValue: '90',
      },
    ],
    getCliOptions: (opts: GroundingOptions) => ({
      maxRecommendedDepth: opts.maxDepth ? parseInt(opts.maxDepth) : undefined,
      readmeStaleDays: opts.readmeStaleDays
        ? parseInt(opts.readmeStaleDays)
        : undefined,
    }),
    renderConsole: ({ summary, score, elapsedTime }) => {
      const summaryRecord = summary as Record<string, any>;
      renderStandardSummary({
        label: 'Agent Grounding',
        emoji: '🧠',
        summary: summaryRecord,
        score,
        elapsedTime,
        metrics: `Files: ${summaryRecord.filesAnalyzed}  Dirs: ${summaryRecord.directoriesAnalyzed}`,
      });
    },
  });
}
