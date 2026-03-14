import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { ToolName } from '@aiready/core';

export async function initAction(options: {
  force?: boolean;
  format?: 'json' | 'js';
  full?: boolean;
}) {
  const fileExt = options.format === 'js' ? 'js' : 'json';
  const fileName = fileExt === 'js' ? 'aiready.config.js' : 'aiready.json';
  const filePath = join(process.cwd(), fileName);

  if (existsSync(filePath) && !options.force) {
    console.error(
      chalk.red(`Error: ${fileName} already exists. Use --force to overwrite.`)
    );
    process.exit(1);
  }

  const baseConfig = {
    scan: {
      include: [
        'src/**/*.ts',
        'src/**/*.js',
        'lib/**/*.ts',
        'packages/*/src/**/*.ts',
      ],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      tools: [
        ToolName.PatternDetect,
        ToolName.ContextAnalyzer,
        ToolName.NamingConsistency,
        ToolName.AiSignalClarity,
        ToolName.AgentGrounding,
        ToolName.TestabilityIndex,
        ToolName.DocDrift,
        ToolName.DependencyHealth,
        ToolName.ChangeAmplification,
      ],
    },
    tools: {
      [ToolName.PatternDetect]: {
        minSimilarity: 0.8,
        minLines: 5,
        ...(options.full
          ? {
              batchSize: 50,
              approx: true,
              minSharedTokens: 10,
              maxCandidatesPerBlock: 100,
            }
          : {}),
      },
      [ToolName.ContextAnalyzer]: {
        maxContextBudget: 128000,
        minCohesion: 0.6,
        ...(options.full
          ? {
              maxDepth: 7,
              maxFragmentation: 0.4,
              focus: 'all',
              includeNodeModules: false,
            }
          : {}),
      },
      [ToolName.NamingConsistency]: {
        shortWords: ['id', 'db', 'ui', 'ai'],
        ...(options.full
          ? { acceptedAbbreviations: [], disableChecks: [] }
          : {}),
      },
      [ToolName.AiSignalClarity]: {
        checkMagicLiterals: true,
        checkBooleanTraps: true,
        checkAmbiguousNames: true,
        checkUndocumentedExports: true,
        ...(options.full
          ? { checkImplicitSideEffects: false, checkDeepCallbacks: false }
          : {}),
      },
      ...(options.full
        ? {
            [ToolName.AgentGrounding]: {
              maxRecommendedDepth: 5,
              readmeStaleDays: 30,
            },
            [ToolName.TestabilityIndex]: {
              minCoverageRatio: 0.7,
              testPatterns: ['**/*.test.ts', '**/__tests__/**'],
            },
            [ToolName.DocDrift]: {
              maxCommits: 50,
              staleMonths: 3,
            },
            [ToolName.DependencyHealth]: {
              trainingCutoffYear: 2023,
            },
          }
        : {}),
    },
    scoring: {
      threshold: 70,
      showBreakdown: true,
      ...(options.full ? { profile: 'default' } : {}),
    },
    ...(options.full
      ? {
          output: {
            format: fileExt,
            file: 'aiready-report.json',
          },
          visualizer: {
            groupingDirs: ['packages', 'src', 'lib'],
            graph: {
              maxNodes: 5000,
              maxEdges: 10000,
            },
          },
        }
      : {}),
  };

  const defaultConfig = baseConfig;

  let content: string;
  if (fileExt === 'js') {
    content = `/** @type {import('@aiready/core').AIReadyConfig} */\nmodule.exports = ${JSON.stringify(
      defaultConfig,
      null,
      2
    )};\n`;
  } else {
    content = JSON.stringify(defaultConfig, null, 2);
  }

  try {
    writeFileSync(filePath, content, 'utf8');
    console.log(
      chalk.green(`\n✅ Created default configuration: ${chalk.bold(fileName)}`)
    );
    console.log(
      chalk.cyan('You can now fine-tune your settings and run AIReady with:')
    );
    console.log(chalk.white(`  $ aiready scan\n`));
  } catch (error) {
    console.error(chalk.red(`Failed to write configuration file: ${error}`));
    process.exit(1);
  }
}
