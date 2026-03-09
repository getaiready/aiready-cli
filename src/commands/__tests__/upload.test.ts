import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadAction } from '../upload';
import fs from 'fs';

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(true),
    readFileSync: vi.fn().mockReturnValue('{"test": true}'),
  },
}));

vi.mock('@aiready/core', () => ({
  handleCLIError: vi.fn(),
}));

describe('Upload CLI Action', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () =>
          Promise.resolve({
            success: true,
            analysis: { id: '123', aiScore: 80 },
          }),
      })
    );
    vi.stubGlobal('process', {
      ...process,
      exit: vi.fn(),
    });
  });

  it('should upload report successfully', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await uploadAction('report.json', { apiKey: 'test-key' });
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Upload successful')
    );
    consoleSpy.mockRestore();
  });

  it('should fail if API key is missing', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await uploadAction('report.json', {});
    expect(process.exit).toHaveBeenCalledWith(1);
    consoleSpy.mockRestore();
  });
});
