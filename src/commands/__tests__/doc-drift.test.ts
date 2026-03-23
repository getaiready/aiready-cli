import { describe, it, expect, vi } from 'vitest';
import { docDriftAction } from '..';

vi.mock('@aiready/doc-drift', () => ({
  analyzeDocDrift: vi.fn().mockResolvedValue({
    summary: { score: 20, rating: 'low' },
    rawData: {},
    recommendations: ['Update docs'],
    issues: [],
  }),
}));

vi.mock('@aiready/core', () => ({
  loadConfig: vi.fn().mockResolvedValue({}),
  mergeConfigWithDefaults: vi
    .fn()
    .mockImplementation((c, d) => ({ ...d, ...c })),
  ToolName: {
    PatternDetect: 'pattern-detect',
    ContextAnalyzer: 'context-analyzer',
    NamingConsistency: 'naming-consistency',
    AiSignalClarity: 'ai-signal-clarity',
    AgentGrounding: 'agent-grounding',
    TestabilityIndex: 'testability-index',
    DocDrift: 'doc-drift',
    DependencyHealth: 'dependency-health',
    ChangeAmplification: 'change-amplification',
    CognitiveLoad: 'cognitive-load',
    PatternEntropy: 'pattern-entropy',
    ConceptCohesion: 'concept-cohesion',
    SemanticDistance: 'semantic-distance',
  },
}));

describe('Doc Drift CLI Action', () => {
  it('should run analysis and return scoring', async () => {
    const result = await docDriftAction('.', { output: 'json' });
    expect(result?.toolName).toBe('doc-drift');
    expect(result?.score).toBe(20);
  });
});
