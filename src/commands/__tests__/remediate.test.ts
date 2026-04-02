import { beforeEach, describe, expect, it, vi } from 'vitest';
import { remediateAction } from '../remediate';

const { printTerminalHeaderMock, existsSyncMock, readdirSyncMock } = vi.hoisted(
  () => ({
    printTerminalHeaderMock: vi.fn(),
    existsSyncMock: vi.fn(),
    readdirSyncMock: vi.fn(),
  })
);

vi.mock('chalk', () => ({
  default: {
    cyan: (s: string) => s,
    dim: (s: string) => s,
    yellow: (s: string) => s,
    white: (s: string) => s,
    green: (s: string) => s,
    bold: (s: string) => s,
  },
}));

vi.mock('@aiready/core', () => ({
  printTerminalHeader: printTerminalHeaderMock,
}));

vi.mock('fs', () => ({
  existsSync: existsSyncMock,
  readdirSync: readdirSyncMock,
}));

describe('remediateAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/cwd');
  });

  it('shows warning when no report exists', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    existsSyncMock.mockReturnValue(false);

    await remediateAction('.', {});

    expect(printTerminalHeaderMock).toHaveBeenCalledWith(
      'AIREADY REMEDIATION SWARM'
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('No AIReady report found')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('aiready scan')
    );
    logSpy.mockRestore();
  });

  it('uses latest report from .aiready and prints default strategies', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    existsSyncMock.mockImplementation((target: string) => {
      if (target.endsWith('/.aiready')) return true;
      if (target.includes('aiready-report-2026-04-02.json')) return true;
      return false;
    });
    readdirSyncMock.mockReturnValue([
      'ignore.txt',
      'aiready-report-2026-04-01.json',
      'aiready-report-2026-04-02.json',
    ]);

    await remediateAction('.', {});

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Using latest report: aiready-report-2026-04-02.json'
      )
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Pattern Consolidation')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Naming Alignment')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Context Optimization')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://platform.getaiready.dev/remediate')
    );
    logSpy.mockRestore();
  });

  it('filters strategy output by selected tool and custom server', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    existsSyncMock.mockReturnValue(true);

    await remediateAction('.', {
      report: '/cwd/custom.json',
      tool: 'patterns',
      server: 'https://local.test',
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Pattern Consolidation')
    );
    expect(logSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Naming Alignment')
    );
    expect(logSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Context Optimization')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://local.test/remediate')
    );
    logSpy.mockRestore();
  });
});
