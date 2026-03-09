import { describe, it, expect, vi } from 'vitest';
import { patternsAction } from '../patterns';

vi.mock('@aiready/pattern-detect', () => ({
  analyzePatterns: vi.fn().mockResolvedValue({
    results: [],
    duplicates: [],
  }),
  generateSummary: vi
    .fn()
    .mockReturnValue({ totalPatterns: 0, totalTokenCost: 0 }),
  calculatePatternScore: vi.fn().mockReturnValue({ score: 100 }),
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

describe('Patterns CLI Action', () => {
  it('should run analysis', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await patternsAction('.', {});
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
