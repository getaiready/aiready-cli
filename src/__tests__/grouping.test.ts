import { describe, it, expect } from 'vitest';
import {
  groupDuplicatesByFilePair,
  createRefactorClusters,
  filterClustersByImpact,
} from '../grouping';
import type { DuplicatePattern } from '../detector';

describe('grouping utilities', () => {
  describe('groupDuplicatesByFilePair', () => {
    it('should group duplicates by file pair', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'a.ts',
          file2: 'b.ts',
          line1: 1,
          endLine1: 10,
          line2: 1,
          endLine2: 10,
          similarity: 0.95,
          patternType: 'function',
          tokenCost: 100,
          severity: 'critical',
          reason: 'Test duplicate',
          suggestion: 'Extract to common function',
          matchedRule: null,
        },
        {
          file1: 'a.ts',
          file2: 'b.ts',
          line1: 20,
          endLine1: 30,
          line2: 20,
          endLine2: 30,
          similarity: 0.9,
          patternType: 'function',
          tokenCost: 80,
          severity: 'major',
          reason: 'Another duplicate',
          suggestion: 'Consolidate logic',
          matchedRule: null,
        },
        {
          file1: 'c.ts',
          file2: 'd.ts',
          line1: 1,
          endLine1: 5,
          line2: 1,
          endLine2: 5,
          similarity: 0.85,
          patternType: 'utility',
          tokenCost: 50,
          severity: 'minor',
          reason: 'Utility duplicate',
          suggestion: 'Share utility',
          matchedRule: null,
        },
      ];

      const groups = groupDuplicatesByFilePair(duplicates);

      expect(groups).toHaveLength(2);

      // Find the a.ts::b.ts group
      const abGroup = groups.find((g) => g.filePair === 'a.ts::b.ts');
      expect(abGroup).toBeDefined();
      expect(abGroup!.occurrences).toBe(2);
      expect(abGroup!.totalTokenCost).toBe(180);
      expect(abGroup!.averageSimilarity).toBeCloseTo(0.925, 2);
      expect(abGroup!.maxSimilarity).toBe(0.95);
      expect(abGroup!.severity).toBe('critical'); // Highest severity
      expect(abGroup!.lineRanges).toHaveLength(2);

      // Find the c.ts::d.ts group
      const cdGroup = groups.find((g) => g.filePair === 'c.ts::d.ts');
      expect(cdGroup).toBeDefined();
      expect(cdGroup!.occurrences).toBe(1);
      expect(cdGroup!.totalTokenCost).toBe(50);
    });

    it('should normalize file pairs (a::b === b::a)', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'a.ts',
          file2: 'b.ts',
          line1: 1,
          endLine1: 10,
          line2: 1,
          endLine2: 10,
          similarity: 0.9,
          patternType: 'function',
          tokenCost: 100,
          severity: 'major',
          reason: 'Test',
          suggestion: 'Fix',
          matchedRule: null,
        },
        {
          file1: 'b.ts',
          file2: 'a.ts',
          line1: 20,
          endLine1: 30,
          line2: 20,
          endLine2: 30,
          similarity: 0.85,
          patternType: 'function',
          tokenCost: 90,
          severity: 'major',
          reason: 'Test',
          suggestion: 'Fix',
          matchedRule: null,
        },
      ];

      const groups = groupDuplicatesByFilePair(duplicates);

      expect(groups).toHaveLength(1);
      expect(groups[0].occurrences).toBe(2);
      expect(groups[0].totalTokenCost).toBe(190);
    });

    it('should deduplicate overlapping line ranges', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'a.ts',
          file2: 'b.ts',
          line1: 1,
          endLine1: 10,
          line2: 1,
          endLine2: 10,
          similarity: 0.95,
          patternType: 'function',
          tokenCost: 100,
          severity: 'critical',
          reason: 'Test',
          suggestion: 'Fix',
          matchedRule: null,
        },
        {
          file1: 'a.ts',
          file2: 'b.ts',
          line1: 2,
          endLine1: 9,
          line2: 2,
          endLine2: 9,
          similarity: 0.8,
          patternType: 'function',
          tokenCost: 80,
          severity: 'major',
          reason: 'Test',
          suggestion: 'Fix',
          matchedRule: null,
        },
        {
          file1: 'a.ts',
          file2: 'b.ts',
          line1: 8,
          endLine1: 15,
          line2: 8,
          endLine2: 15,
          similarity: 0.85,
          patternType: 'function',
          tokenCost: 90,
          severity: 'major',
          reason: 'Test',
          suggestion: 'Fix',
          matchedRule: null,
        },
      ];

      const groups = groupDuplicatesByFilePair(duplicates);

      expect(groups).toHaveLength(1);
      // Should keep only the highest similarity overlapping ranges
      // 1-10 overlaps with 2-9 (keep 1-10, 95%)
      // 1-10 overlaps with 8-15 (keep both, different ranges)
      expect(groups[0].lineRanges.length).toBeLessThanOrEqual(2);
    });

    it('should handle empty input', () => {
      const groups = groupDuplicatesByFilePair([]);
      expect(groups).toHaveLength(0);
    });
  });

  describe('createRefactorClusters', () => {
    it('should create blog-seo cluster', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'blog/ato-receipt-requirements-2026.tsx',
          file2: 'blog/ato-mileage-rates-2026.tsx',
          line1: 1,
          endLine1: 50,
          line2: 1,
          endLine2: 50,
          similarity: 0.88,
          patternType: 'component',
          tokenCost: 1500,
          severity: 'minor',
          reason: 'SEO boilerplate',
          suggestion: 'Extract BlogPageLayout',
          matchedRule: null,
        },
        {
          file1: 'blog/ato-receipt-requirements-2026.tsx',
          file2: 'blog/tax-deductions-2026.tsx',
          line1: 1,
          endLine1: 50,
          line2: 1,
          endLine2: 50,
          similarity: 0.85,
          patternType: 'component',
          tokenCost: 1400,
          severity: 'minor',
          reason: 'SEO boilerplate',
          suggestion: 'Extract BlogPageLayout',
          matchedRule: null,
        },
        {
          file1: 'blog/ato-mileage-rates-2026.tsx',
          file2: 'blog/tax-deductions-2026.tsx',
          line1: 1,
          endLine1: 50,
          line2: 1,
          endLine2: 50,
          similarity: 0.87,
          patternType: 'component',
          tokenCost: 1450,
          severity: 'minor',
          reason: 'SEO boilerplate',
          suggestion: 'Extract BlogPageLayout',
          matchedRule: null,
        },
      ];

      const clusters = createRefactorClusters(duplicates);

      console.log(
        'Created clusters:',
        clusters.map((c) => ({ id: c.id, name: c.name }))
      );

      const blogCluster = clusters.find((c) => c.id.startsWith('blog-seo'));
      expect(blogCluster).toBeDefined();
      expect(blogCluster!.name).toContain('Blog SEO Boilerplate');
      expect(blogCluster!.files).toHaveLength(3); // 3 unique files
      expect(blogCluster!.totalTokenCost).toBe(4350);
      expect(blogCluster!.suggestion).toContain('BlogPageLayout');
    });

    it('should create component clusters by category', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'components/buttons/PrimaryButton.tsx',
          file2: 'components/buttons/SecondaryButton.tsx',
          line1: 1,
          endLine1: 20,
          line2: 1,
          endLine2: 20,
          similarity: 0.9,
          patternType: 'component',
          tokenCost: 500,
          severity: 'minor',
          reason: 'Button pattern',
          suggestion: 'Extract BaseButton',
          matchedRule: null,
        },
        {
          file1: 'components/buttons/PrimaryButton.tsx',
          file2: 'components/buttons/TertiaryButton.tsx',
          line1: 1,
          endLine1: 20,
          line2: 1,
          endLine2: 20,
          similarity: 0.88,
          patternType: 'component',
          tokenCost: 480,
          severity: 'minor',
          reason: 'Button pattern',
          suggestion: 'Extract BaseButton',
          matchedRule: null,
        },
        {
          file1: 'components/cards/ProductCard.tsx',
          file2: 'components/cards/UserCard.tsx',
          line1: 1,
          endLine1: 30,
          line2: 1,
          endLine2: 30,
          similarity: 0.85,
          patternType: 'component',
          tokenCost: 600,
          severity: 'minor',
          reason: 'Card pattern',
          suggestion: 'Extract BaseCard',
          matchedRule: null,
        },
        {
          file1: 'components/cards/ProductCard.tsx',
          file2: 'components/cards/ProfileCard.tsx',
          line1: 1,
          endLine1: 30,
          line2: 1,
          endLine2: 30,
          similarity: 0.83,
          patternType: 'component',
          tokenCost: 580,
          severity: 'minor',
          reason: 'Card pattern',
          suggestion: 'Extract BaseCard',
          matchedRule: null,
        },
      ];

      const clusters = createRefactorClusters(duplicates);

      console.log(
        'Input duplicates:',
        duplicates.map((d) => ({
          file1: d.file1,
          file2: d.file2,
          type: d.patternType,
        }))
      );
      console.log(
        'Created clusters:',
        clusters.map((c) => ({ id: c.id, name: c.name, files: c.files }))
      );

      const buttonCluster = clusters.find((c) => c.id.includes('button'));
      const cardCluster = clusters.find((c) => c.id.includes('card'));

      expect(buttonCluster).toBeDefined();
      expect(buttonCluster!.name).toContain('Button');
      expect(buttonCluster!.files.length).toBeGreaterThanOrEqual(2);

      expect(cardCluster).toBeDefined();
      expect(cardCluster!.name).toContain('Card');
      expect(cardCluster!.files.length).toBeGreaterThanOrEqual(2);
    });

    it('should create e2e-test cluster', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'e2e/login.test.ts',
          file2: 'e2e/signup.test.ts',
          line1: 10,
          endLine1: 30,
          line2: 10,
          endLine2: 30,
          similarity: 0.92,
          patternType: 'function',
          tokenCost: 400,
          severity: 'minor',
          reason: 'Test helpers',
          suggestion: 'Extract test utilities',
          matchedRule: null,
        },
        {
          file1: 'e2e/login.test.ts',
          file2: 'e2e/profile.test.ts',
          line1: 10,
          endLine1: 30,
          line2: 10,
          endLine2: 30,
          similarity: 0.88,
          patternType: 'function',
          tokenCost: 380,
          severity: 'minor',
          reason: 'Test helpers',
          suggestion: 'Extract test utilities',
          matchedRule: null,
        },
      ];

      const clusters = createRefactorClusters(duplicates);

      const e2eCluster = clusters.find((c) => c.id === 'e2e-test-patterns');
      expect(e2eCluster).toBeDefined();
      expect(e2eCluster!.name).toContain('E2E Test');
      expect(e2eCluster!.suggestion).toContain('test utilities');
    });

    it('should handle empty input', () => {
      const clusters = createRefactorClusters([]);
      expect(clusters).toHaveLength(0);
    });
  });

  describe('filterClustersByImpact', () => {
    it('should filter clusters by minimum token cost', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'a.ts',
          file2: 'b.ts',
          line1: 1,
          endLine1: 10,
          line2: 1,
          endLine2: 10,
          similarity: 0.9,
          patternType: 'function',
          tokenCost: 2000,
          severity: 'major',
          reason: 'High cost',
          suggestion: 'Refactor',
          matchedRule: null,
        },
        {
          file1: 'c.ts',
          file2: 'd.ts',
          line1: 1,
          endLine1: 5,
          line2: 1,
          endLine2: 5,
          similarity: 0.8,
          patternType: 'utility',
          tokenCost: 100,
          severity: 'info',
          reason: 'Low cost',
          suggestion: 'Maybe refactor',
          matchedRule: null,
        },
      ];

      const allClusters = createRefactorClusters(duplicates);
      const filtered = filterClustersByImpact(allClusters, 1000, 1);

      // Only clusters with >= 1000 tokens should remain
      expect(filtered.every((c) => c.totalTokenCost >= 1000)).toBe(true);
    });

    it('should filter clusters by minimum file count', () => {
      const duplicates: DuplicatePattern[] = [
        {
          file1: 'a.ts',
          file2: 'b.ts',
          line1: 1,
          endLine1: 10,
          line2: 1,
          endLine2: 10,
          similarity: 0.9,
          patternType: 'function',
          tokenCost: 500,
          severity: 'major',
          reason: 'Test',
          suggestion: 'Fix',
          matchedRule: null,
        },
        {
          file1: 'a.ts',
          file2: 'c.ts',
          line1: 1,
          endLine1: 10,
          line2: 1,
          endLine2: 10,
          similarity: 0.85,
          patternType: 'function',
          tokenCost: 500,
          severity: 'major',
          reason: 'Test',
          suggestion: 'Fix',
          matchedRule: null,
        },
        {
          file1: 'x.ts',
          file2: 'y.ts',
          line1: 1,
          endLine1: 5,
          line2: 1,
          endLine2: 5,
          similarity: 0.8,
          patternType: 'utility',
          tokenCost: 500,
          severity: 'info',
          reason: 'Test',
          suggestion: 'Fix',
          matchedRule: null,
        },
      ];

      const allClusters = createRefactorClusters(duplicates);
      const filtered = filterClustersByImpact(allClusters, 0, 3);

      // Only clusters with >= 3 files should remain
      expect(filtered.every((c) => c.files.length >= 3)).toBe(true);
    });

    it('should handle empty input', () => {
      const filtered = filterClustersByImpact([], 1000, 3);
      expect(filtered).toHaveLength(0);
    });
  });
});
