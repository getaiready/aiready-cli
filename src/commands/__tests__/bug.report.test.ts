import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bugAction } from '../bug';

const { execSyncMock } = vi.hoisted(() => ({
  execSyncMock: vi.fn(),
}));

vi.mock('chalk', () => ({
  default: {
    blue: (s: string) => s,
    green: (s: string) => s,
    cyan: (s: string) => s,
    yellow: (s: string) => s,
    red: (s: string) => s,
    dim: (s: string) => s,
    bold: (s: string) => s,
    white: (s: string) => s,
  },
}));

vi.mock('child_process', () => ({
  execSync: execSyncMock,
}));

describe('bugAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prints generic report links when no message is provided', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await bugAction(undefined, {});

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Feedback & Bug Reports')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('template=bug_report.md')
    );
    logSpy.mockRestore();
  });

  it('creates prefilled URL for bug type by default', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await bugAction('search is slow', {});

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Issue Draft Prepared')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('template=bug_report.md')
    );
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('labels=bug'));
    logSpy.mockRestore();
  });

  it('submits issue through gh CLI when submit flag is enabled', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    execSyncMock
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(
        'https://github.com/getaiready/aiready-cli/issues/1'
      );

    await bugAction('need new metric', { type: 'metric', submit: true });

    expect(execSyncMock).toHaveBeenCalledWith('gh auth status', {
      stdio: 'ignore',
    });
    expect(execSyncMock).toHaveBeenCalledWith(
      expect.stringContaining('gh issue create --repo getaiready/aiready-cli'),
      { encoding: 'utf8' }
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Issue Created Successfully')
    );
    logSpy.mockRestore();
  });

  it('falls back to URL generation when gh submission fails', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    execSyncMock.mockImplementation(() => {
      throw new Error('gh unavailable');
    });

    await bugAction('cannot login', { type: 'feature', submit: true });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to submit via gh CLI')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('template=feature_request.md')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('labels=enhancement')
    );
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
