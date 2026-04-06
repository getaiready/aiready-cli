import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@aiready/core', async () => {
  const actual = await vi.importActual('@aiready/core');
  return {
    ...actual,
    formatToolScore: vi.fn().mockReturnValue('Formatted Score'),
    getTerminalDivider: vi.fn().mockReturnValue('-----'),
  };
});

import * as tr from '../terminal-renderers';

describe('terminal-renderers', () => {
  let spy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('renderToolHeader prints header', () => {
    tr.renderToolHeader('MyTool', '🔧', 90, 'safe');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('MyTool'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('/100'));
  });

  it('renderSafetyRating prints safety label', () => {
    tr.renderSafetyRating('safe');
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('AI Change Safety')
    );
  });

  it('renderIssueSummaryBlock prints success when none', () => {
    tr.renderIssueSummaryBlock({
      criticalIssues: 0,
      majorIssues: 0,
      minorIssues: 0,
    });
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('No significant issues')
    );
  });

  it('renderIssueSummaryBlock prints issues when present', () => {
    tr.renderIssueSummaryBlock({
      criticalIssues: 1,
      majorIssues: 2,
      minorIssues: 0,
      totalPotentialSavings: 1000,
    });
    expect(spy).toHaveBeenCalled();
  });

  it('renderSubSection prints divider and title', () => {
    tr.renderSubSection('Tests');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('-----'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('TESTS'));
  });

  it('renderToolScoreFooter prints formatted score', () => {
    tr.renderToolScoreFooter({ score: 80, toolName: 'Tool' });
    expect(spy).toHaveBeenCalled();
  });
});
