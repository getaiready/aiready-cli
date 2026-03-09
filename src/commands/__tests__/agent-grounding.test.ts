import { describe, it, expect, vi } from 'vitest';
import { agentGroundingAction } from '../agent-grounding';

vi.mock('@aiready/agent-grounding', () => ({
  analyzeAgentGrounding: vi.fn().mockResolvedValue({
    summary: { score: 75, rating: 'good', dimensions: { apiClarityScore: 60 } },
    results: [],
  }),
  calculateGroundingScore: vi.fn().mockReturnValue({ score: 75 }),
}));

vi.mock('@aiready/core', () => ({
  loadConfig: vi.fn().mockResolvedValue({}),
  mergeConfigWithDefaults: vi
    .fn()
    .mockImplementation((c, d) => ({ ...d, ...c })),
}));

describe('Agent Grounding CLI Action', () => {
  it('should run analysis and return scoring', async () => {
    const result = await agentGroundingAction('.', { output: 'json' });
    expect(result?.score).toBe(75);
  });
});
