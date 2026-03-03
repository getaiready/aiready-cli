import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getContextMap } from '../context-map/route';
import { GET as getRemediate } from '../remediate/route';
import { GET as getGrounding } from '../grounding/route';
import { NextRequest } from 'next/server';
import { getRepository, getLatestAnalysis } from '@/lib/db';

// Mock DB
vi.mock('@/lib/db', () => ({
  getRepository: vi.fn(),
  getLatestAnalysis: vi.fn(),
}));

describe('Agent APIs', () => {
  const mockRepo = {
    id: 'repo_123',
    name: 'test-repo',
    aiScore: 85,
    lastAnalysisAt: '2026-03-03',
  };
  const mockAnalysis = {
    summary: { totalFiles: 100, criticalIssues: 2, warnings: 5 },
    breakdown: { agentGrounding: 75, contextFragmentation: 20 },
    details: [
      {
        file: 'src/lib/logic.ts',
        type: 'duplicate-pattern',
        severity: 'critical',
        message: 'Duplicated logic found',
      },
      {
        file: 'src/ui/Button.tsx',
        type: 'naming-inconsistency',
        severity: 'major',
        message: 'Poor naming',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getRepository as any).mockResolvedValue(mockRepo);
    (getLatestAnalysis as any).mockResolvedValue(mockAnalysis);
  });

  const createRequest = (url: string) => new NextRequest(url);

  describe('GET /api/agent/context-map', () => {
    it('should return a valid context map', async () => {
      const req = createRequest(
        'http://localhost/api/agent/context-map?repoId=repo_123'
      );
      const res = await getContextMap(req);
      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data.repoName).toBe('test-repo');
      expect(data.clusters).toHaveLength(3);
      expect(data.hotspots).toHaveLength(2);
      expect(data.hotspots[0].file).toBe('src/lib/logic.ts');
    });
  });

  describe('GET /api/agent/remediate', () => {
    it('should return remediation suggestions', async () => {
      const req = createRequest(
        'http://localhost/api/agent/remediate?repoId=repo_123'
      );
      const res = await getRemediate(req);
      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data.remediationQueue).toHaveLength(1); // Only criticalIssues were filtered
      expect(data.remediationQueue[0].type).toBe('consolidation');
      expect(data.remediationQueue[0].action).toContain('npx @aiready/cli fix');
    });
  });

  describe('GET /api/agent/grounding', () => {
    it('should map semantic queries to clusters', async () => {
      const req = createRequest(
        'http://localhost/api/agent/grounding?repoId=repo_123&query=where is the logic'
      );
      const res = await getGrounding(req);
      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data.match.keyword).toBe('logic');
      expect(data.match.cluster).toBe('core');
      expect(data.advice).toContain('Start exploration');
    });
  });
});
