import { describe, it, expect, vi } from 'vitest';
import { consistencyAction } from '../consistency';

vi.mock('@aiready/consistency', () => ({
  analyzeConsistency: vi.fn().mockResolvedValue({
    summary: {
      totalIssues: 0,
      namingIssues: 0,
      patternIssues: 0,
      filesAnalyzed: 1,
    },
    results: [],
    recommendations: [],
  }),
  calculateConsistencyScore: vi.fn().mockReturnValue({ score: 100 }),
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

describe('Consistency CLI Action', () => {
  it('should run analysis', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await consistencyAction('.', {});
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
