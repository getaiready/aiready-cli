import { describe, it, expect, vi } from 'vitest';
import {
  mapToUnifiedReport,
  printScanSummary,
  printBusinessImpact,
  printScoring,
} from '../report-formatter';

describe('report-formatter utilities', () => {
  it('maps to unified report and counts files/issues', () => {
    const res = {
      summary: { toolsRun: ['t1'] },
      t1: {
        results: [
          { fileName: 'a', issues: [{ severity: 'critical' }] },
          { fileName: 'b', issues: [{ severity: 'major' }] },
        ],
      },
    } as any;

    const unified = mapToUnifiedReport(res, undefined as any);
    expect(unified.summary.totalFiles).toBe(2);
    expect(unified.summary.criticalIssues).toBeGreaterThanOrEqual(1);
  });

  it('prints summary and business impact without throwing', () => {
    const results = {
      summary: { toolsRun: ['t1'] },
      t1: {
        results: [{ fileName: 'a', issues: [{ severity: 'critical' }] }],
      },
    } as any;

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    printScanSummary(results, Date.now() - 1000);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();

    const spy2 = vi.spyOn(console, 'log').mockImplementation(() => {});
    printBusinessImpact(
      {
        monthlySavings: 1000,
        productivityGainHours: 10,
        annualValue: 12000,
      } as any,
      { efficiencyRatio: 0.25 } as any
    );
    expect(spy2).toHaveBeenCalled();
    spy2.mockRestore();
  });

  it('prints scoring breakdown without throwing', () => {
    const scoring = {
      breakdown: [
        {
          toolName: 't1',
          score: 80,
          recommendations: [
            { action: 'do this', estimatedImpact: 5, priority: 'high' },
          ],
        },
      ],
    } as any;

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    printScoring(scoring, 'standard');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
