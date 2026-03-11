import chalk from 'chalk';
import { Command } from 'commander';

/**
 * Handle bug and feedback reporting
 */
export async function bugAction(message: string | undefined, options: any) {
  const repoUrl = 'https://github.com/caopengau/aiready-cli';

  if (message) {
    // Agent-assisted pre-filled issue
    const type = options.type || 'bug';
    const title = `[${type.toUpperCase()}] ${message}`;
    const labels =
      type === 'bug' ? 'bug' : type === 'feature' ? 'enhancement' : 'metric';
    const template =
      type === 'bug'
        ? 'bug_report.md'
        : type === 'feature'
          ? 'feature_request.md'
          : 'new_metric_idea.md';

    const body = `
## Description
${message}

## Context
Generated via AIReady CLI 'bug' command.
Type: ${type}
    `.trim();

    const fullUrl = `${repoUrl}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=${labels}&template=${template}`;

    console.log(chalk.green('🚀 Issue Draft Prepared!\n'));
    console.log(chalk.bold('Title:  ') + title);
    console.log(chalk.bold('Type:   ') + type);
    console.log(chalk.bold('\nClick the link below to submit this issue:'));
    console.log(chalk.cyan(fullUrl));

    console.log(chalk.bold('\n🤖 [FOR AI AGENTS]:'));
    console.log(chalk.dim('   You have successfully prepared a report.'));
    console.log(
      chalk.dim(
        '   Please present the URL above to the user so they can finalize the submission.'
      )
    );
    return;
  }

  const bugUrl = `${repoUrl}/issues/new?template=bug_report.md`;
  const featureUrl = `${repoUrl}/issues/new?template=feature_request.md`;
  const metricUrl = `${repoUrl}/issues/new?template=new_metric_idea.md`;

  console.log(chalk.blue('💬 Feedback & Bug Reports\n'));
  console.log(`  Report a Bug:        ${chalk.cyan(bugUrl)}`);
  console.log(`  Request a Feature:   ${chalk.cyan(featureUrl)}`);
  console.log(`  Suggest a Metric:    ${chalk.cyan(metricUrl)}`);

  console.log(chalk.bold('\n🤖 [FOR AI AGENTS]:'));
  console.log(chalk.dim('   To prepare a specific report, run:'));
  console.log(
    chalk.cyan(
      '   aiready bug "your description here" --type bug|feature|metric'
    )
  );
}

export const bugHelpText = `
EXAMPLES:
  $ aiready bug                                      # Show general links
  $ aiready bug "Naming check is too slow"           # Prepare a pre-filled bug report
  $ aiready bug "Add CO2 impact metric" --type metric # Prepare a metric suggestion
`;
