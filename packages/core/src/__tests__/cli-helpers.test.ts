import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
} from 'vitest';
import {
  getScoreBar,
  loadMergedConfig,
  handleJSONOutput,
  resolveOutputPath,
  handleCLIError,
  getElapsedTime,
  emitProgress,
  getSeverityColor,
  getSeverityValue,
  getSeverityLevel,
  getSeverityBadge,
  getSeverityEnum,
  getSafetyIcon,
  findLatestReport,
  findLatestScanReport,
} from '../utils/cli-helpers';
import { join } from 'path';
import { existsSync, rmSync, mkdirSync, writeFileSync, statSync } from 'fs';
import { tmpdir } from 'os';

describe('CLI Helpers Advanced', () => {
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = join(tmpdir(), `aiready-cli-helpers-advanced-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loadMergedConfig should merge defaults, config file, and CLI options', async () => {
    const projectDir = join(tmpDir, 'project-config');
    mkdirSync(projectDir);
    writeFileSync(
      join(projectDir, 'aiready.json'),
      JSON.stringify({ scan: { tools: ['t1'] }, someOpt: 'file' })
    );

    const defaults = { tools: ['def'], someOpt: 'def', otherOpt: 'def' };
    const cliOptions = { someOpt: 'cli' };

    const result = await loadMergedConfig(projectDir, defaults, cliOptions);

    expect(result.someOpt).toBe('cli'); // cli overrides file
    expect(result.otherOpt).toBe('def'); // from defaults
    expect(result.rootDir).toBe(projectDir);
  });

  it('handleJSONOutput should write to file', () => {
    const outFile = join(tmpDir, 'out.json');
    const data = { test: true };

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    handleJSONOutput(data, outFile, 'Success');

    expect(existsSync(outFile)).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith('Success');
    consoleSpy.mockRestore();
  });

  it('handleJSONOutput should log to console if no file provided', () => {
    const data = { test: true };
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    handleJSONOutput(data);

    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
    consoleSpy.mockRestore();
  });

  it('getScoreBar handles boundaries', () => {
    expect(getScoreBar(-10)).toBe('░░░░░░░░░░');
    expect(getScoreBar(110)).toBe('██████████');
  });

  // New tests for uncovered functions

  describe('resolveOutputPath', () => {
    it('should use user-provided path', () => {
      const userPath = join(tmpDir, 'custom', 'output.json');
      const result = resolveOutputPath(userPath, 'default.json', tmpDir);
      expect(result).toBe(userPath);
    });

    it('should create default .aiready directory path', () => {
      const result = resolveOutputPath(undefined, 'report.json', tmpDir);
      expect(result).toContain('.aiready');
      expect(result).toMatch(/report\.json$/);
    });

    it('should handle file path as workingDir', () => {
      const filePath = join(tmpDir, 'somefile.txt');
      writeFileSync(filePath, 'test');
      const result = resolveOutputPath(undefined, 'report.json', filePath);
      expect(result).toContain('.aiready');
    });

    it('should create parent directories if they dont exist', () => {
      const customPath = join(tmpDir, 'newdir', 'subdir', 'output.json');
      const result = resolveOutputPath(customPath, 'default.json', tmpDir);
      expect(result).toBe(customPath);
      expect(existsSync(join(tmpDir, 'newdir', 'subdir'))).toBe(true);
    });
  });

  describe('handleCLIError', () => {
    it('should log error and exit with code 1', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      expect(() => handleCLIError(new Error('test error'), 'test-command')).toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('❌ test-command failed:', new Error('test error'));
      expect(exitSpy).toHaveBeenCalledWith(1);

      consoleSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should handle string error message', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      expect(() => handleCLIError('string error', 'test-command')).toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('❌ test-command failed:', 'string error');

      consoleSpy.mockRestore();
      exitSpy.mockRestore();
    });
  });

  describe('getElapsedTime', () => {
    it('should calculate elapsed time in seconds', () => {
      const startTime = Date.now() - 5000; // 5 seconds ago
      const result = getElapsedTime(startTime);
      expect(parseFloat(result)).toBeGreaterThan(4);
      expect(parseFloat(result)).toBeLessThan(6);
    });

    it('should handle current time as start', () => {
      const result = getElapsedTime(Date.now());
      expect(parseFloat(result)).toBeCloseTo(0, 1);
    });
  });

  describe('emitProgress', () => {
    it('should not call onProgress when not provided', () => {
      const onProgress = vi.fn();
      expect(() => emitProgress(10, 100, 'tool', 'Processing')).not.toThrow();
    });

    it('should call onProgress at throttle count', () => {
      const onProgress = vi.fn();
      emitProgress(50, 100, 'tool', 'Processing', onProgress, 50);
      expect(onProgress).toHaveBeenCalledWith(50, 100, 'Processing (50/100)');
    });

    it('should call onProgress at end', () => {
      const onProgress = vi.fn();
      emitProgress(100, 100, 'tool', 'Processing', onProgress, 50);
      expect(onProgress).toHaveBeenCalledWith(100, 100, 'Processing (100/100)');
    });

    it('should not call onProgress between throttle points', () => {
      const onProgress = vi.fn();
      emitProgress(25, 100, 'tool', 'Processing', onProgress, 50);
      expect(onProgress).not.toHaveBeenCalled();
    });
  });

  describe('getSeverityColor', () => {
    it('should return red for critical', () => {
      const mockChalk = { red: vi.fn((s) => s), yellow: vi.fn(), green: vi.fn(), blue: vi.fn(), white: vi.fn() };
      const result = getSeverityColor('critical', mockChalk);
      expect(result).toBe(mockChalk.red);
    });

    it('should return red for high-risk', () => {
      const mockChalk = { red: vi.fn((s) => s), yellow: vi.fn(), green: vi.fn(), blue: vi.fn(), white: vi.fn() };
      const result = getSeverityColor('high-risk', mockChalk);
      expect(result).toBe(mockChalk.red);
    });

    it('should return red for blind-risk', () => {
      const mockChalk = { red: vi.fn((s) => s), yellow: vi.fn(), green: vi.fn(), blue: vi.fn(), white: vi.fn() };
      const result = getSeverityColor('blind-risk', mockChalk);
      expect(result).toBe(mockChalk.red);
    });

    it('should return yellow for major', () => {
      const mockChalk = { red: vi.fn(), yellow: vi.fn((s) => s), green: vi.fn(), blue: vi.fn(), white: vi.fn() };
      const result = getSeverityColor('major', mockChalk);
      expect(result).toBe(mockChalk.yellow);
    });

    it('should return yellow for moderate-risk', () => {
      const mockChalk = { red: vi.fn(), yellow: vi.fn((s) => s), green: vi.fn(), blue: vi.fn(), white: vi.fn() };
      const result = getSeverityColor('moderate-risk', mockChalk);
      expect(result).toBe(mockChalk.yellow);
    });

    it('should return green for minor', () => {
      const mockChalk = { red: vi.fn(), yellow: vi.fn(), green: vi.fn((s) => s), blue: vi.fn(), white: vi.fn() };
      const result = getSeverityColor('minor', mockChalk);
      expect(result).toBe(mockChalk.green);
    });

    it('should return green for safe', () => {
      const mockChalk = { red: vi.fn(), yellow: vi.fn(), green: vi.fn((s) => s), blue: vi.fn(), white: vi.fn() };
      const result = getSeverityColor('safe', mockChalk);
      expect(result).toBe(mockChalk.green);
    });

    it('should return blue for info', () => {
      const mockChalk = { red: vi.fn(), yellow: vi.fn(), green: vi.fn(), blue: vi.fn((s) => s), white: vi.fn() };
      const result = getSeverityColor('info', mockChalk);
      expect(result).toBe(mockChalk.blue);
    });

    it('should return white for unknown severity', () => {
      const mockChalk = { red: vi.fn(), yellow: vi.fn(), green: vi.fn(), blue: vi.fn(), white: vi.fn((s) => s) };
      const result = getSeverityColor('unknown', mockChalk);
      expect(result).toBe(mockChalk.white);
    });
  });

  describe('getSeverityValue', () => {
    it('should return 4 for critical', () => {
      expect(getSeverityValue('critical')).toBe(4);
    });

    it('should return 3 for major', () => {
      expect(getSeverityValue('major')).toBe(3);
    });

    it('should return 2 for minor', () => {
      expect(getSeverityValue('minor')).toBe(2);
    });

    it('should return 1 for info', () => {
      expect(getSeverityValue('info')).toBe(1);
    });

    it('should return 0 for undefined', () => {
      expect(getSeverityValue(undefined)).toBe(0);
    });

    it('should return 0 for unknown', () => {
      expect(getSeverityValue('unknown')).toBe(0);
    });

    it('should handle case insensitive', () => {
      expect(getSeverityValue('CRITICAL')).toBe(4);
      expect(getSeverityValue('Major')).toBe(3);
    });
  });

  describe('getSeverityLevel', () => {
    it('should return same as getSeverityValue', () => {
      expect(getSeverityLevel('critical')).toBe(4);
      expect(getSeverityLevel('major')).toBe(3);
      expect(getSeverityLevel('minor')).toBe(2);
      expect(getSeverityLevel('info')).toBe(1);
      expect(getSeverityLevel(undefined)).toBe(0);
    });
  });

  describe('getSeverityBadge', () => {
    it('should return CRITICAL badge', () => {
      const mockChalk = {
        bgRed: { white: { bold: vi.fn((s) => s) } },
      };
      const result = getSeverityBadge('critical', mockChalk);
      expect(mockChalk.bgRed.white.bold).toHaveBeenCalled();
    });

    it('should return MAJOR badge', () => {
      const mockChalk = {
        bgYellow: { black: { bold: vi.fn((s) => s) } },
      };
      const result = getSeverityBadge('major', mockChalk);
      expect(mockChalk.bgYellow.black.bold).toHaveBeenCalled();
    });

    it('should return MINOR badge', () => {
      const mockChalk = {
        bgBlue: { white: { bold: vi.fn((s) => s) } },
      };
      const result = getSeverityBadge('minor', mockChalk);
      expect(mockChalk.bgBlue.white.bold).toHaveBeenCalled();
    });

    it('should return INFO badge for info', () => {
      const mockChalk = {
        bgCyan: { black: vi.fn((s) => s) },
      };
      const result = getSeverityBadge('info', mockChalk);
      expect(mockChalk.bgCyan.black).toHaveBeenCalled();
    });

    it('should return INFO badge for unknown', () => {
      const mockChalk = {
        bgCyan: { black: vi.fn((s) => s) },
      };
      const result = getSeverityBadge('unknown', mockChalk);
      expect(mockChalk.bgCyan.black).toHaveBeenCalled();
    });
  });

  describe('getSeverityEnum', () => {
    it('should return critical for critical', () => {
      expect(getSeverityEnum('critical')).toBe('critical');
    });

    it('should return major for major', () => {
      expect(getSeverityEnum('major')).toBe('major');
    });

    it('should return minor for minor', () => {
      expect(getSeverityEnum('minor')).toBe('minor');
    });

    it('should return info for info', () => {
      expect(getSeverityEnum('info')).toBe('info');
    });

    it('should return info for undefined', () => {
      expect(getSeverityEnum(undefined)).toBe('info');
    });

    it('should return info for unknown', () => {
      expect(getSeverityEnum('unknown')).toBe('info');
    });
  });

  describe('getSafetyIcon', () => {
    it('should return checkmark for safe', () => {
      expect(getSafetyIcon('safe')).toBe('✅');
    });

    it('should return warning for moderate-risk', () => {
      expect(getSafetyIcon('moderate-risk')).toBe('⚠️ ');
    });

    it('should return red circle for high-risk', () => {
      expect(getSafetyIcon('high-risk')).toBe('🔴');
    });

    it('should return skull for blind-risk', () => {
      expect(getSafetyIcon('blind-risk')).toBe('💀');
    });

    it('should return question for unknown', () => {
      expect(getSafetyIcon('unknown')).toBe('❓');
    });
  });

  describe('findLatestReport', () => {
    it('should return null if .aiready directory does not exist', () => {
      const result = findLatestReport(join(tmpDir, 'nonexistent'));
      expect(result).toBeNull();
    });

    it('should return null if no report files exist', () => {
      const emptyDir = join(tmpDir, 'empty');
      mkdirSync(join(emptyDir, '.aiready'), { recursive: true });
      const result = findLatestReport(emptyDir);
      expect(result).toBeNull();
    });

    it('should find new format report files', () => {
      const reportDir = join(tmpDir, 'reports-new');
      mkdirSync(join(reportDir, '.aiready'), { recursive: true });
      // Create files with different names/numbers - sort is by mtime, not name
      writeFileSync(join(reportDir, '.aiready', 'aiready-report-1.json'), '{}');
      writeFileSync(join(reportDir, '.aiready', 'aiready-report-2.json'), '{}');
      
      const result = findLatestReport(reportDir);
      // The function sorts by mtime, so either file could be returned
      expect(result).toMatch(/aiready-report-\d+\.json$/);
    });

    it('should find legacy format report files when no new format', () => {
      const reportDir = join(tmpDir, 'legacy-reports');
      mkdirSync(join(reportDir, '.aiready'), { recursive: true });
      writeFileSync(join(reportDir, '.aiready', 'aiready-scan-1.json'), '{}');
      writeFileSync(join(reportDir, '.aiready', 'aiready-scan-2.json'), '{}');
      
      const result = findLatestReport(reportDir);
      expect(result).toContain('aiready-scan-');
    });
  });

  describe('findLatestScanReport', () => {
    it('should return null if directory does not exist', () => {
      const result = findLatestScanReport(join(tmpDir, 'nonexistent'), 'report-');
      expect(result).toBeNull();
    });

    it('should return null if no matching files', () => {
      const reportDir = join(tmpDir, 'empty-reports');
      mkdirSync(reportDir, { recursive: true });
      const result = findLatestScanReport(reportDir, 'report-');
      expect(result).toBeNull();
    });

    it('should find matching report files', () => {
      const reportDir = join(tmpDir, 'scan-reports');
      mkdirSync(reportDir, { recursive: true });
      writeFileSync(join(reportDir, 'report-1.json'), '{}');
      writeFileSync(join(reportDir, 'report-2.json'), '{}');
      writeFileSync(join(reportDir, 'report-10.json'), '{}');
      
      const result = findLatestScanReport(reportDir, 'report-');
      expect(result).toContain('report-10.json');
    });

    it('should handle errors gracefully', () => {
      // Passing a file instead of directory should cause error
      const filePath = join(tmpDir, 'somefile.txt');
      writeFileSync(filePath, 'test');
      const result = findLatestScanReport(filePath, 'report-');
      expect(result).toBeNull();
    });
  });
});
