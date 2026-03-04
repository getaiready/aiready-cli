import type { PatternType } from './types';

/**
 * Categorize code pattern based on content heuristics
 */
export function categorizePattern(code: string): PatternType {
  const lower = code.toLowerCase();

  if (
    (lower.includes('request') && lower.includes('response')) ||
    lower.includes('router.') ||
    lower.includes('app.get') ||
    lower.includes('app.post') ||
    lower.includes('express') ||
    lower.includes('ctx.body')
  ) {
    return 'api-handler';
  }

  if (
    lower.includes('validate') ||
    lower.includes('schema') ||
    lower.includes('zod') ||
    lower.includes('yup') ||
    (lower.includes('if') && lower.includes('throw'))
  ) {
    return 'validator';
  }

  if (
    lower.includes('return (') ||
    lower.includes('jsx') ||
    lower.includes('component') ||
    lower.includes('props')
  ) {
    return 'component';
  }

  if (lower.includes('class ') || lower.includes('this.')) {
    return 'class-method';
  }

  if (
    lower.includes('return ') &&
    !lower.includes('this') &&
    !lower.includes('new ')
  ) {
    return 'utility';
  }

  if (lower.includes('function') || lower.includes('=>')) {
    return 'function';
  }

  return 'unknown';
}

/**
 * Extract function-like blocks from code
 */
export function extractCodeBlocks(
  content: string,
  minLines: number
): Array<{
  content: string;
  startLine: number;
  endLine: number;
  patternType: PatternType;
  linesOfCode: number;
}> {
  const lines = content.split('\n');
  const blocks: any[] = [];

  let currentBlock: string[] = [];
  let blockStart = 0;
  let braceDepth = 0;
  let inFunction = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (
      !inFunction &&
      (trimmed.includes('function ') ||
        trimmed.includes('=>') ||
        trimmed.includes('async ') ||
        /^(export\s+)?(async\s+)?function\s+/.test(trimmed) ||
        /^(export\s+)?const\s+\w+\s*=\s*(async\s*)?\(/.test(trimmed))
    ) {
      inFunction = true;
      blockStart = i;
    }

    for (const char of line) {
      if (char === '{') braceDepth++;
      if (char === '}') braceDepth--;
    }

    if (inFunction) {
      currentBlock.push(line);
    }

    if (inFunction && braceDepth === 0 && currentBlock.length >= minLines) {
      const blockContent = currentBlock.join('\n').trim();
      if (blockContent) {
        const loc = currentBlock.filter(
          (l) => l.trim() && !l.trim().startsWith('//')
        ).length;

        blocks.push({
          content: blockContent,
          startLine: blockStart + 1,
          endLine: i + 1,
          patternType: categorizePattern(blockContent),
          linesOfCode: loc,
        });
      }

      currentBlock = [];
      inFunction = false;
    } else if (inFunction && braceDepth === 0) {
      currentBlock = [];
      inFunction = false;
    }
  }

  return blocks;
}
