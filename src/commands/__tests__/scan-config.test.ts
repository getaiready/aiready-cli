import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveScanConfig, SCAN_DEFAULTS } from '../scan-config';
import * as core from '@aiready/core';

vi.mock('@aiready/core', async () => {
  const actual = await vi.importActual('@aiready/core');
  return {
    ...actual,
    loadMergedConfig: vi.fn(),
  };
});

describe('Scan Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(core.loadMergedConfig).mockImplementation(
      async (dir, defaults, overrides) => {
        return { ...defaults, ...overrides, rootDir: dir };
      }
    );
  });

  it('resolves default config', async () => {
    const config = await resolveScanConfig('.', {});
    expect(config.tools).toEqual(SCAN_DEFAULTS.tools);
  });

  it('handles tool overrides', async () => {
    const config = await resolveScanConfig('.', {
      tools: 'pattern-detect,context-analyzer',
    });
    expect(config.tools).toEqual(['pattern-detect', 'context-analyzer']);
  });

  it('handles profile mapping', async () => {
    const config = await resolveScanConfig('.', { profile: 'agentic' });
    // Agentic profile has AiSignalClarity, AgentGrounding, TestabilityIndex
    expect(config.tools).toContain('ai-signal-clarity');
    expect(config.tools).toContain('agent-grounding');
  });

  it('merges include/exclude options', async () => {
    const config = await resolveScanConfig('.', {
      include: 'src/**/*.ts',
      exclude: 'node_modules',
    });
    expect(config.include).toEqual(['src/**/*.ts']);
    expect(config.exclude).toEqual(['node_modules']);
  });
});
