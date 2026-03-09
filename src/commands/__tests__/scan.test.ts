import { describe, it, expect, vi } from 'vitest';
import { scanAction } from '../scan';

vi.mock('../index', () => ({
  analyzeUnified: vi.fn().mockResolvedValue({
    summary: { totalIssues: 0, toolsRun: [] },
  }),
  scoreUnified: vi.fn().mockResolvedValue({
    overall: 80,
    breakdown: [],
  }),
}));

vi.mock('@aiready/core', async () => {
  const actual = await vi.importActual('@aiready/core');
  return {
    ...actual,
    loadMergedConfig: vi.fn().mockResolvedValue({
      tools: ['pattern-detect'],
      output: { format: 'console' },
    }),
    getRepoMetadata: vi.fn().mockReturnValue({}),
    handleJSONOutput: vi.fn(),
    handleCLIError: vi.fn(),
    getElapsedTime: vi.fn().mockReturnValue('1.0'),
    resolveOutputPath: vi.fn().mockReturnValue('report.json'),
    formatScore: vi.fn().mockReturnValue('80/100'),
    calculateTokenBudget: vi
      .fn()
      .mockReturnValue({ efficiencyRatio: 0.8, wastedTokens: { total: 0 } }),
  };
});

vi.mock('fs', () => ({
  writeFileSync: vi.fn(),
  readFileSync: vi.fn().mockReturnValue('{}'),
  existsSync: vi.fn().mockReturnValue(true),
}));

describe('Scan CLI Action', () => {
  it('should run unified scan', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await scanAction('.', { score: true });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
