import { vi, describe, it, expect } from 'vitest';

const fakeProgram = {
  command: vi.fn().mockReturnThis(),
  description: vi.fn().mockReturnThis(),
  argument: vi.fn().mockReturnThis(),
  option: vi.fn().mockReturnThis(),
  addHelpText: vi.fn().mockReturnThis(),
  action: vi.fn().mockReturnThis(),
} as any;

describe('Define command registrations', () => {
  it('should define scan command without throwing', async () => {
    const mod = await import('../scan');
    expect(() => mod.setupScanCommand(fakeProgram)).not.toThrow();
  }, 20000);

  it('should define patterns command without throwing', async () => {
    const mod = await import('../patterns');
    expect(() => mod.definePatternsCommand(fakeProgram)).not.toThrow();
  });

  it('should define context command without throwing', async () => {
    const mod = await import('../context');
    expect(() => mod.defineContextCommand(fakeProgram)).not.toThrow();
  });

  it('should define consistency command without throwing', async () => {
    const mod = await import('../consistency');
    expect(() => mod.defineConsistencyCommand(fakeProgram)).not.toThrow();
  });

  it('should define agent grounding command without throwing', async () => {
    const mod = await import('../agent-grounding');
    expect(() => mod.defineAgentGroundingCommand(fakeProgram)).not.toThrow();
  });

  it('should define testability command without throwing', async () => {
    const mod = await import('../testability');
    expect(() => mod.defineTestabilityCommand(fakeProgram)).not.toThrow();
  });

  it('should define contract enforcement command without throwing', async () => {
    const mod = await import('../contract-enforcement');
    expect(() =>
      mod.defineContractEnforcementCommand(fakeProgram)
    ).not.toThrow();
  });
});
