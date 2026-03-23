import { describe, it, expect, vi } from 'vitest';
import { depsHealthAction } from '..';

vi.mock('@aiready/deps', () => ({
  analyzeDeps: vi.fn().mockResolvedValue({
    summary: { score: 90, rating: 'excellent' },
    rawData: {},
    recommendations: [],
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

describe('Deps Health CLI Action', () => {
  it('should run analysis and return scoring', async () => {
    const result = await depsHealthAction('.', { output: 'json' });
    expect(result?.toolName).toBe('dependency-health');
    expect(result?.score).toBe(90);
  });
});
