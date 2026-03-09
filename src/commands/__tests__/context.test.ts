import { describe, it, expect, vi } from 'vitest';
import { contextAction } from '../context';

vi.mock('@aiready/context-analyzer', () => ({
  analyzeContext: vi.fn().mockResolvedValue([]),
  generateSummary: vi.fn().mockReturnValue({
    totalFiles: 0,
    totalTokens: 0,
    avgContextBudget: 0,
    criticalIssues: 0,
    majorIssues: 0,
    minorIssues: 0,
    totalPotentialSavings: 0,
    deepFiles: [],
    fragmentedModules: [],
    lowCohesionFiles: [],
    topExpensiveFiles: [],
    avgImportDepth: 0,
    maxImportDepth: 0,
    avgFragmentation: 0,
    avgCohesion: 0,
  }),
  calculateContextScore: vi.fn().mockReturnValue({ score: 100 }),
  getSmartDefaults: vi.fn().mockResolvedValue({}),
}));

vi.mock('@aiready/core', () => ({
  loadMergedConfig: vi
    .fn()
    .mockResolvedValue({ output: { format: 'console' } }),
  handleJSONOutput: vi.fn(),
  handleCLIError: vi.fn(),
  getElapsedTime: vi.fn().mockReturnValue('1.0'),
  resolveOutputPath: vi.fn().mockReturnValue('out.json'),
  formatToolScore: vi.fn().mockReturnValue('Score: 100'),
}));

describe('Context CLI Action', () => {
  it('should run analysis', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await contextAction('.', {});
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
