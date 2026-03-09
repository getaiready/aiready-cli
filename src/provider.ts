import {
  ToolProvider,
  ToolName,
  SpokeOutput,
  ScanOptions,
  ToolScoringOutput,
  SpokeOutputSchema,
  GLOBAL_SCAN_OPTIONS,
} from '@aiready/core';
import { analyzePatterns, PatternDetectOptions } from './analyzer';
import { calculatePatternScore } from './scoring';

/**
 * Pattern Detection Tool Provider
 */
export const PatternDetectProvider: ToolProvider = {
  id: ToolName.PatternDetect,
  alias: ['patterns', 'duplicates', 'duplication'],

  async analyze(options: ScanOptions): Promise<SpokeOutput> {
    const results = await analyzePatterns(options as PatternDetectOptions);

    // Normalize and validate to SpokeOutput format
    return SpokeOutputSchema.parse({
      results: results.results,
      summary: {
        totalFiles: results.files.length,
        totalIssues: results.results.reduce(
          (sum, r) => sum + r.issues.length,
          0
        ),
        clusters: results.clusters,
        config: Object.fromEntries(
          Object.entries(results.config).filter(
            ([key]) => !GLOBAL_SCAN_OPTIONS.includes(key) || key === 'rootDir'
          )
        ),
      },
      metadata: {
        toolName: ToolName.PatternDetect,
        version: '0.12.5',
        timestamp: new Date().toISOString(),
      },
    });
  },

  score(output: SpokeOutput, options: ScanOptions): ToolScoringOutput {
    const duplicates = (output.summary as any).duplicates || [];
    const totalFiles =
      (output.summary as any).totalFiles || output.results.length;

    return calculatePatternScore(
      duplicates,
      totalFiles,
      (options as any).costConfig
    );
  },

  defaultWeight: 22,
};
