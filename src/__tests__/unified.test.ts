import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeUnified, scoreUnified, generateUnifiedSummary } from '../index';
import { ToolRegistry, ToolName } from '@aiready/core';

vi.mock('@aiready/core', async () => {
  const actual = await vi.importActual('@aiready/core');
  return {
    ...actual,
    initializeParsers: vi.fn().mockResolvedValue(undefined),
    calculateOverallScore: vi
      .fn()
      .mockReturnValue({ overall: 85, breakdown: [] }),
    calculateTokenBudget: vi.fn().mockReturnValue({}),
  };
});

describe('Unified CLI logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('analyzeUnified', () => {
    it('should run multiple tools and aggregate results', async () => {
      const mockProvider1 = {
        id: 'tool1',
        analyze: vi.fn().mockResolvedValue({
          results: [{ fileName: 'f1.ts', issues: [{}, {}] }],
          summary: { totalFiles: 1 },
        }),
        score: vi.fn(),
      };

      vi.spyOn(ToolRegistry, 'find').mockImplementation((id) => {
        if (id === 'tool1') return mockProvider1 as any;
        return null;
      });

      const options = {
        rootDir: '.',
        tools: ['tool1'],
      };

      const result = await analyzeUnified(options as any);
      expect(result.summary.totalIssues).toBe(2);
      expect(result.summary.toolsRun).toContain('tool1');
    });
  });

  describe('scoreUnified', () => {
    it('should score results from multiple tools', async () => {
      const mockProvider = {
        id: 'tool1',
        score: vi.fn().mockReturnValue({ score: 80 }),
      };
      vi.spyOn(ToolRegistry, 'get').mockReturnValue(mockProvider as any);

      const results = {
        summary: { toolsRun: ['tool1'] },
        tool1: { results: [] },
      };

      const score = await scoreUnified(results as any, { rootDir: '.' } as any);
      expect(score.overall).toBe(85); // From mocked calculateOverallScore
      expect(mockProvider.score).toHaveBeenCalled();
    });

    it('should handle empty tools', async () => {
      const results = { summary: { toolsRun: [] } };
      const score = await scoreUnified(results as any, { rootDir: '.' } as any);
      expect(score.overall).toBe(0);
    });
  });

  describe('generateUnifiedSummary', () => {
    it('should generate human-readable summary', () => {
      const result = {
        summary: {
          toolsRun: ['tool1'],
          totalIssues: 5,
          executionTime: 1200,
        },
        tool1: { results: [{ issues: [{}, {}] }] },
      };

      vi.spyOn(ToolRegistry, 'getAll').mockReturnValue([
        { id: 'tool1' },
      ] as any);

      const summary = generateUnifiedSummary(result as any);
      expect(summary).toContain('AIReady Analysis Complete');
      expect(summary).toContain('Total issues found: 5');
      expect(summary).toContain('1.20s');
    });
  });
});
