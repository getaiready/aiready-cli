import { describe, it, expect } from 'vitest';
import { GraphBuilder } from '../builder';

describe('GraphBuilder', () => {
  describe('buildFromReport', () => {
    it('should handle a basic report with duplicates at root of tool data', () => {
      const report = {
        summary: {
          totalIssues: 1,
          totalFiles: 1,
          toolsRun: ['pattern-detect'],
        },
        'pattern-detect': {
          results: [],
          duplicates: [
            { file1: 'a.ts', file2: 'b.ts', similarity: 0.9, tokenCost: 100 },
          ],
        },
      };

      const graph = GraphBuilder.buildFromReport(report);
      expect(graph.nodes.length).toBeGreaterThan(0);
      expect(graph.edges.some((e) => e.type === 'similarity')).toBe(true);
    });

    it('should handle a unified report with duplicates nested in summary', () => {
      const report = {
        summary: {
          totalIssues: 1,
          totalFiles: 1,
          toolsRun: ['pattern-detect'],
        },
        'pattern-detect': {
          results: [],
          summary: {
            duplicates: [
              { file1: 'a.ts', file2: 'b.ts', similarity: 0.9, tokenCost: 100 },
            ],
          },
        },
      };

      const graph = GraphBuilder.buildFromReport(report);
      expect(graph.nodes.length).toBeGreaterThan(0);
      expect(graph.edges.some((e) => e.type === 'similarity')).toBe(true);
    });

    it('should handle reports with missing tool data gracefully', () => {
      const report = {
        summary: { totalIssues: 0, totalFiles: 0, toolsRun: [] },
      };

      const graph = GraphBuilder.buildFromReport(report);
      expect(graph.nodes).toEqual([]);
      expect(graph.edges).toEqual([]);
    });

    it('should handle malformed duplicates (not an array) gracefully', () => {
      const report = {
        summary: {
          totalIssues: 1,
          totalFiles: 1,
          toolsRun: ['pattern-detect'],
        },
        'pattern-detect': {
          summary: {
            duplicates: { not: 'an array' },
          },
        },
      };

      // This should not throw "duplicates.forEach is not a function"
      const graph = GraphBuilder.buildFromReport(report);
      expect(graph.nodes).toEqual([]);
    });

    it('should handle dependency health tool results', () => {
      const report = {
        summary: {
          totalIssues: 1,
          totalFiles: 1,
          toolsRun: ['dependencyHealth'],
        },
        dependencyHealth: {
          results: [
            {
              fileName: 'src/app.ts',
              severity: 'major',
              message: 'Outdated dependency',
            },
            {
              location: { file: 'src/utils.ts' },
              severity: 'critical',
              message: 'Vulnerable dependency',
            },
          ],
        },
      };

      const graph = GraphBuilder.buildFromReport(report, '/root');
      // Should have nodes for both files
      expect(graph.nodes.length).toBe(2);
      // Should have counted the issues
      expect(graph.metadata.majorIssues).toBe(1);
      expect(graph.metadata.criticalIssues).toBe(1);
    });

    it('should handle minor severity correctly', () => {
      const report = {
        summary: {
          totalIssues: 1,
          toolsRun: ['pattern-detect'],
        },
        patternDetect: {
          results: [
            {
              fileName: 'src/app.ts',
              issues: [{ severity: 'minor', message: 'Minor issue' }],
              metrics: { tokenCost: 10 },
            },
          ],
        },
      };

      const graph = GraphBuilder.buildFromReport(report, '/root');
      expect(graph.nodes.length).toBe(1);
      expect(graph.metadata.minorIssues).toBe(1);
      // Check that node has yellow color (#ffd666)
      const node = graph.nodes.find((n) => n.id.includes('app.ts'));
      expect(node?.color).toBe('#ffd666');
    });

    it('should handle info severity correctly', () => {
      const report = {
        summary: {
          totalIssues: 1,
          toolsRun: ['pattern-detect'],
        },
        patternDetect: {
          results: [
            {
              fileName: 'src/app.ts',
              issues: [{ severity: 'info', message: 'Info message' }],
              metrics: { tokenCost: 10 },
            },
          ],
        },
      };

      const graph = GraphBuilder.buildFromReport(report, '/root');
      expect(graph.nodes.length).toBe(1);
      expect(graph.metadata.infoIssues).toBe(1);
      // Check that node has light blue color (#91d5ff)
      const node = graph.nodes.find((n) => n.id.includes('app.ts'));
      expect(node?.color).toBe('#91d5ff');
    });

    it('should handle doc drift tool results', () => {
      const report = {
        summary: {
          totalIssues: 1,
          toolsRun: ['docDrift'],
        },
        docDrift: {
          results: [
            {
              fileName: 'src/README.md',
              severity: 'minor',
              message: 'Documentation drift detected',
            },
            {
              location: { file: 'src/CHANGELOG.md' },
              severity: 'info',
              message: 'Missing documentation',
            },
          ],
        },
      };

      const graph = GraphBuilder.buildFromReport(report, '/root');
      expect(graph.nodes.length).toBe(2);
      expect(graph.metadata.minorIssues).toBe(1);
      expect(graph.metadata.infoIssues).toBe(1);
    });

    it('should handle legacy dependencyHealth format', () => {
      const report = {
        dependencyHealth: [
          {
            fileName: 'src/app.ts',
            severity: 'major',
            message: 'Outdated dependency',
          },
        ],
      };

      const graph = GraphBuilder.buildFromReport(report, '/root');
      expect(graph.nodes.length).toBe(1);
      expect(graph.metadata.majorIssues).toBe(1);
    });

    it('should assign correct colors for different severity levels', () => {
      const report = {
        summary: { totalIssues: 4, toolsRun: ['pattern-detect'] },
        patternDetect: {
          results: [
            {
              fileName: 'src/critical.ts',
              issues: [{ severity: 'critical', message: 'Critical issue' }],
              metrics: { tokenCost: 10 },
            },
            {
              fileName: 'src/major.ts',
              issues: [{ severity: 'major', message: 'Major issue' }],
              metrics: { tokenCost: 10 },
            },
            {
              fileName: 'src/minor.ts',
              issues: [{ severity: 'minor', message: 'Minor issue' }],
              metrics: { tokenCost: 10 },
            },
            {
              fileName: 'src/info.ts',
              issues: [{ severity: 'info', message: 'Info issue' }],
              metrics: { tokenCost: 10 },
            },
            {
              fileName: 'src/no-severity.ts',
              issues: [{ message: 'No severity' }],
              metrics: { tokenCost: 10 },
            },
          ],
        },
      };

      const graph = GraphBuilder.buildFromReport(report, '/root');

      const criticalNode = graph.nodes.find((n) =>
        n.id.includes('critical.ts')
      );
      const majorNode = graph.nodes.find((n) => n.id.includes('major.ts'));
      const minorNode = graph.nodes.find((n) => n.id.includes('minor.ts'));
      const infoNode = graph.nodes.find((n) => n.id.includes('info.ts'));
      const noSevNode = graph.nodes.find((n) =>
        n.id.includes('no-severity.ts')
      );

      expect(criticalNode?.color).toBe('#ff4d4f'); // red
      expect(majorNode?.color).toBe('#ff9900'); // orange
      expect(minorNode?.color).toBe('#ffd666'); // yellow
      expect(infoNode?.color).toBe('#91d5ff'); // light blue
      expect(noSevNode?.color).toBe('#97c2fc'); // default blue

      expect(graph.metadata.criticalIssues).toBe(1);
      expect(graph.metadata.majorIssues).toBe(1);
      expect(graph.metadata.minorIssues).toBe(1);
      expect(graph.metadata.infoIssues).toBe(1);
    });
  });
});
