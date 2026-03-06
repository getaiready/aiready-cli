import { estimateTokens, Severity } from '@aiready/core';
import { calculateSeverity } from './context-rules';
import type {
  DuplicatePattern,
  PatternType,
  FileContent,
  DetectionOptions,
  CodeBlock,
} from './core/types';

export type { PatternType, DuplicatePattern };

/**
 * Standardize code for similarity comparison
 */
function normalizeCode(code: string): string {
  return code
    .replace(/\/\/.*/g, '') // remove single line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
    .replace(/['"`]/g, '"') // unify quotes
    .replace(/\s+/g, ' ') // unify whitespace
    .trim()
    .toLowerCase();
}

/**
 * Split file content into logical blocks (functions, classes, methods)
 */
function extractBlocks(file: string, content: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const lines = content.split('\n');

  // Regex to match declarations and app.get/post handlers
  // Allow leading whitespace
  const blockRegex =
    /^\s*(?:export\s+)?(?:async\s+)?(function|class|const|interface|type)\s+([a-zA-Z0-9_]+)|^\s*(app\.(?:get|post|put|delete|patch|use))\(/gm;

  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    const startLine = content.substring(0, match.index).split('\n').length;

    let type: string;
    let name: string;

    if (match[1]) {
      type = match[1];
      name = match[2];
    } else {
      type = 'handler';
      name = match[3];
    }

    // Find end of block (matching braces heuristic)
    let endLine = -1;
    let openBraces = 0;
    let foundStart = false;

    for (let i = match.index; i < content.length; i++) {
      if (content[i] === '{') {
        openBraces++;
        foundStart = true;
      } else if (content[i] === '}') {
        openBraces--;
      }

      if (foundStart && openBraces === 0) {
        endLine = content.substring(0, i + 1).split('\n').length;
        break;
      }
    }

    if (endLine === -1) {
      // Fallback: look for end of line
      const remaining = content.slice(match.index);
      const nextLineMatch = remaining.indexOf('\n');
      if (nextLineMatch !== -1) {
        endLine = startLine;
      } else {
        endLine = lines.length;
      }
    }

    // Ensure at least 1 line
    endLine = Math.max(startLine, endLine);

    const blockCode = lines.slice(startLine - 1, endLine).join('\n');
    const tokens = estimateTokens(blockCode);

    blocks.push({
      file,
      startLine,
      endLine,
      code: blockCode,
      tokens,
      patternType: inferPatternType(type, name),
    });
  }

  return blocks;
}

function inferPatternType(keyword: string, name: string): PatternType {
  const n = name.toLowerCase();
  if (
    keyword === 'handler' ||
    n.includes('handler') ||
    n.includes('controller') ||
    n.startsWith('app.')
  ) {
    return 'api-handler';
  }
  if (n.includes('validate') || n.includes('schema')) return 'validator';
  if (n.includes('util') || n.includes('helper')) return 'utility';
  if (keyword === 'class') return 'class-method';
  if (n.match(/^[A-Z]/)) return 'component';
  if (keyword === 'function') return 'function';
  return 'unknown';
}

/**
 * Calculate Jaccard similarity between two strings
 * Splitting by non-alphanumeric to be more robust
 */
function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;

  const tokensA = a.split(/[^a-zA-Z0-9]+/).filter((t) => t.length > 0);
  const tokensB = b.split(/[^a-zA-Z0-9]+/).filter((t) => t.length > 0);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

/**
 * Detect duplicate patterns across files
 */
export async function detectDuplicatePatterns(
  fileContents: FileContent[],
  options: DetectionOptions
): Promise<DuplicatePattern[]> {
  const { minSimilarity, minLines, streamResults, onProgress } = options;
  const allBlocks: CodeBlock[] = [];

  for (const { file, content } of fileContents) {
    const blocks = extractBlocks(file, content);
    allBlocks.push(
      ...blocks.filter((b) => b.endLine - b.startLine + 1 >= minLines)
    );
  }

  const duplicates: DuplicatePattern[] = [];
  const totalBlocks = allBlocks.length;
  let comparisons = 0;
  const totalComparisons = (totalBlocks * (totalBlocks - 1)) / 2;

  if (onProgress) {
    onProgress(
      0,
      totalComparisons,
      `Starting duplicate detection on ${totalBlocks} blocks...`
    );
  }

  for (let i = 0; i < allBlocks.length; i++) {
    // Yield to the event loop every 50 blocks to prevent blocking for too long
    if (i % 50 === 0 && i > 0) {
      await new Promise((resolve) => setImmediate(resolve));
      if (onProgress) {
        onProgress(
          comparisons,
          totalComparisons,
          `Analyzing blocks (${i}/${totalBlocks})...`
        );
      }
    }

    for (let j = i + 1; j < allBlocks.length; j++) {
      comparisons++;
      const b1 = allBlocks[i];
      const b2 = allBlocks[j];

      if (b1.file === b2.file) continue;

      const norm1 = normalizeCode(b1.code);
      const norm2 = normalizeCode(b2.code);

      const sim = calculateSimilarity(norm1, norm2);

      if (sim >= minSimilarity) {
        const { severity, reason, suggestion, matchedRule } = calculateSeverity(
          b1.file,
          b2.file,
          b1.code,
          sim,
          b1.endLine - b1.startLine + 1
        );

        const dup: DuplicatePattern = {
          file1: b1.file,
          line1: b1.startLine,
          endLine1: b1.endLine,
          file2: b2.file,
          line2: b2.startLine,
          endLine2: b2.endLine,
          code1: b1.code,
          code2: b2.code,
          similarity: sim,
          patternType: b1.patternType,
          tokenCost: b1.tokens + b2.tokens,
          severity: severity as Severity,
          reason,
          suggestion,
          matchedRule,
        };

        duplicates.push(dup);
        if (streamResults)
          console.log(
            `[DUPLICATE] ${dup.file1}:${dup.line1} <-> ${dup.file2}:${dup.line2} (${Math.round(sim * 100)}%)`
          );
      }
    }
  }

  if (onProgress) {
    onProgress(
      totalComparisons,
      totalComparisons,
      `Duplicate detection complete. Found ${duplicates.length} patterns.`
    );
  }

  return duplicates.sort((a, b) => b.similarity - a.similarity);
}
