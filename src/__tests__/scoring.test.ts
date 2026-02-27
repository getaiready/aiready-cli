import { describe, it, expect } from 'vitest';
import { calculatePatternScore } from '../scoring';
import type { DuplicatePattern } from '../detector';

describe('Pattern Scoring', () => {
  describe('calculatePatternScore', () => {
    it('should return perfect score for no duplicates', () => {
      const result = calculatePatternScore([], 100);

      expect(result.score).toBe(100);
      expect(result.toolName).toBe('pattern-detect');
      expect(result.rawMetrics.totalDuplicates).toBe(0);
      expect(result.recommendations).toHaveLength(0);
    });

    it('should penalize high duplication density', () => {
      const duplicates: DuplicatePattern[] = Array(50).fill({
        file1: 'test1.ts',
        file2: 'test2.ts',
        line1: 1,
        line2: 1,
        endLine1: 10,
        endLine2: 10,
        similarity: 0.8,
        code: 'test code',
        tokenCost: 500,
      } as DuplicatePattern);

      // 50 duplicates / 10 files = 5 duplicates per file
      // duplicatesPenalty = min(60, 5 * 0.6) = 3
      const result = calculatePatternScore(duplicates, 10);

      expect(result.score).toBeLessThan(100);
      expect(result.rawMetrics.totalDuplicates).toBe(50);
      expect(result.factors.length).toBeGreaterThan(0);
    });

    it('should penalize high token waste', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'test1.ts',
          file2: 'test2.ts',
          line1: 1,
          line2: 1,
          endLine1: 100,
          endLine2: 100,
          similarity: 0.9,
          code: 'test code'.repeat(100),
          tokenCost: 5000,
        } as DuplicatePattern,
      ];

      const result = calculatePatternScore(duplicates, 1);

      expect(result.score).toBeLessThan(90);
      expect(result.rawMetrics.totalTokenCost).toBe(5000);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should identify high-impact duplicates', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'test1.ts',
          file2: 'test2.ts',
          line1: 1,
          line2: 1,
          endLine1: 10,
          endLine2: 10,
          similarity: 0.95, // High similarity
          code: 'test code',
          tokenCost: 1500, // High token cost
        } as DuplicatePattern,
        {
          file1: 'test3.ts',
          file2: 'test4.ts',
          line1: 1,
          line2: 1,
          endLine1: 5,
          endLine2: 5,
          similarity: 0.5,
          code: 'test',
          tokenCost: 200,
        } as DuplicatePattern,
      ];

      const result = calculatePatternScore(duplicates, 10);

      expect(result.rawMetrics.highImpactDuplicates).toBe(1);
      expect(result.factors.some((f) => f.name.includes('High-Impact'))).toBe(
        true
      );
    });

    it('should generate recommendations for severe issues', () => {
      const duplicates: DuplicatePattern[] = Array(100).fill({
        file1: 'test.ts',
        file2: 'test2.ts',
        line1: 1,
        line2: 1,
        endLine1: 10,
        endLine2: 10,
        similarity: 0.9,
        code: 'test',
        tokenCost: 1000,
      } as DuplicatePattern);

      const result = calculatePatternScore(duplicates, 20);

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.some((r) => r.priority === 'high')).toBe(
        true
      );
    });

    it('should handle edge case of zero files analyzed', () => {
      const duplicates: DuplicatePattern[] = [];

      const result = calculatePatternScore(duplicates, 0);

      expect(result.score).toBe(100);
    });
  });
});
