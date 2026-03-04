import { estimateTokens } from '@aiready/core';
import { calculateSeverity } from './context-rules';
import type {
  DuplicatePattern,
  PatternType,
  FileContent,
  DetectionOptions,
  CodeBlock,
} from './core/types';
import { extractCodeBlocks } from './core/extractor';
import { normalizeCode, tokenize } from './core/normalizer';
import { jaccardSimilarity } from './core/similarity';
import { ApproxEngine } from './core/approx-engine';

export type {
  DuplicatePattern,
  PatternType,
  FileContent,
  DetectionOptions,
  CodeBlock,
};
export { normalizeCode, tokenize, extractCodeBlocks, jaccardSimilarity };

/**
 * Detect duplicate patterns across files with enhanced analysis
 */
export async function detectDuplicatePatterns(
  files: FileContent[],
  options: DetectionOptions
): Promise<DuplicatePattern[]> {
  const {
    minSimilarity,
    minLines,
    batchSize = 100,
    approx = true,
    minSharedTokens = 8,
    maxCandidatesPerBlock = 100,
    streamResults = false,
  } = options;
  const duplicates: DuplicatePattern[] = [];

  const maxComparisons = approx ? Infinity : 500000;

  const allBlocks: CodeBlock[] = files.flatMap((file) =>
    extractCodeBlocks(file.content, minLines)
      .filter(
        (block) => block && block.content && block.content.trim().length > 0
      )
      .map((block) => ({
        ...block,
        file: file.file,
        normalized: normalizeCode(block.content),
        tokenCost: block.content ? estimateTokens(block.content) : 0,
      }))
  );

  // Add Python patterns if any
  const pythonFiles = files.filter((f) => f.file.endsWith('.py'));
  if (pythonFiles.length > 0) {
    const { extractPythonPatterns } =
      await import('./extractors/python-extractor');
    const pythonPatterns = await extractPythonPatterns(
      pythonFiles.map((f) => f.file)
    );
    allBlocks.push(
      ...pythonPatterns.map((p) => ({
        content: p.code,
        startLine: p.startLine,
        endLine: p.endLine,
        file: p.file,
        normalized: normalizeCode(p.code),
        patternType: p.type as PatternType,
        tokenCost: p.code ? estimateTokens(p.code) : 0,
        linesOfCode: p.endLine - p.startLine + 1,
      }))
    );
  }

  const blockTokens = allBlocks.map((b) => tokenize(b.normalized));
  const engine = approx ? new ApproxEngine(allBlocks, blockTokens) : null;

  let comparisonsProcessed = 0;
  const startTime = Date.now();

  for (let i = 0; i < allBlocks.length; i++) {
    if (maxComparisons && comparisonsProcessed >= maxComparisons) break;

    if (i % batchSize === 0 && i > 0) {
      if (options.onProgress) {
        options.onProgress(i, allBlocks.length, 'Analyzing patterns');
      } else {
        const elapsed = (Date.now() - startTime) / 1000;
        console.log(
          `   Processed ${i}/${allBlocks.length} blocks (${elapsed.toFixed(1)}s, ${duplicates.length} duplicates)`
        );
      }
      await new Promise((r) => setImmediate((resolve) => r(resolve)));
    }

    const block1 = allBlocks[i];
    const candidates = engine
      ? engine.findCandidates(i, minSharedTokens, maxCandidatesPerBlock)
      : allBlocks.slice(i + 1).map((_, idx) => ({ j: i + 1 + idx, shared: 0 }));

    for (const { j } of candidates) {
      if (!approx && comparisonsProcessed >= maxComparisons) break;
      comparisonsProcessed++;

      const block2 = allBlocks[j];
      if (block1.file === block2.file) continue;

      const sim = jaccardSimilarity(blockTokens[i], blockTokens[j]);
      if (sim >= minSimilarity) {
        const severity = calculateSeverity(
          block1.file,
          block2.file,
          block1.content,
          sim,
          block1.linesOfCode
        );

        const dup: DuplicatePattern = {
          file1: block1.file,
          file2: block2.file,
          line1: block1.startLine,
          line2: block2.startLine,
          endLine1: block1.endLine,
          endLine2: block2.endLine,
          similarity: sim,
          snippet: block1.content.substring(0, 200),
          patternType: block1.patternType,
          tokenCost: block1.tokenCost,
          linesOfCode: block1.linesOfCode,
          severity: severity.severity,
          reason: severity.reason,
          suggestion: severity.suggestion,
        };

        duplicates.push(dup);
        if (streamResults)
          console.log(
            `[DUPLICATE] ${dup.file1}:${dup.line1} <-> ${dup.file2}:${dup.line2} (${Math.round(sim * 100)}%)`
          );
      }
    }
  }

  return duplicates;
}
