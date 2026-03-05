import { describe, it, expect } from 'vitest';
import { analyzeUnified, scoreUnified } from '@aiready/cli';
import { validateSpokeOutput } from '@aiready/core';
import path from 'path';
import fs from 'fs';
import os from 'fs';

describe('CLI Integration Tier 2', () => {
  it('should run a unified analysis and produce a valid contract-compliant report', async () => {
    // We'll use the packages/core directory as a "real" repo to scan
    // as it's guaranteed to exist and has a known structure.
    const rootDir = path.resolve(__dirname, '../../core');

    const results = await analyzeUnified({
      rootDir,
      tools: ['patterns', 'context', 'consistency'],
      exclude: ['**/node_modules/**', '**/dist/**'],
    });

    expect(results).toBeDefined();
    expect(results.summary.toolsRun).toContain('patterns');
    expect(results.summary.toolsRun).toContain('context');
    expect(results.summary.toolsRun).toContain('consistency');

    // Run scoring to get the full report
    const scoring = await scoreUnified(results, { rootDir });

    // Construct the final report structure that Platform would consume
    const report = {
      ...results,
      scoring,
      summary: {
        totalFiles: results.summary.toolsRun.length, // approximation for test
        totalIssues: results.summary.totalIssues,
        criticalIssues: scoring.breakdown.reduce(
          (sum, b) => sum + (b.criticalIssues || 0),
          0
        ),
        majorIssues: scoring.breakdown.reduce(
          (sum, b) => sum + (b.majorIssues || 0),
          0
        ),
      },
    };

    // Tier 2 Validation: Verify the aggregated hub output
    // (This part tests that analyzeUnified didn't mangle spoke data)
    if (results.patterns) {
      const patternValidation = validateSpokeOutput('patterns-in-hub', {
        results: results.patterns,
        summary: {}, // patterns summary is inside results in index.ts
      });
      expect(patternValidation.valid).toBe(true);
    }

    if (results.context) {
      const contextValidation = validateSpokeOutput('context-in-hub', {
        results: results.context,
        summary: {},
      });
      expect(contextValidation.valid).toBe(true);
    }

    expect(scoring.overall).toBeGreaterThanOrEqual(0);
    expect(scoring.overall).toBeLessThanOrEqual(100);
  }, 30000); // 30s timeout for real analysis
});
