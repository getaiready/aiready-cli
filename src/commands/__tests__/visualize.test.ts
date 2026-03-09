import { describe, it, expect, vi } from 'vitest';
import { visualizeAction } from '../visualize';
import * as fs from 'fs';

vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    readFileSync: vi
      .fn()
      .mockReturnValue(JSON.stringify({ scoring: { overall: 80 } })),
    existsSync: vi.fn().mockReturnValue(true),
    writeFileSync: vi.fn(),
  };
});

vi.mock('@aiready/visualizer/graph', () => ({
  GraphBuilder: {
    buildFromReport: vi.fn().mockReturnValue({ nodes: [], edges: [] }),
  },
}));

vi.mock('@aiready/core', () => ({
  handleCLIError: vi.fn(),
  generateHTML: vi.fn().mockReturnValue('<html></html>'),
}));

vi.mock('../utils/helpers', () => ({
  findLatestScanReport: vi.fn().mockReturnValue('report.json'),
}));

describe('Visualize CLI Action', () => {
  it('should generate HTML from report', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await visualizeAction('.', { report: 'report.json' });
    expect(fs.writeFileSync).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
