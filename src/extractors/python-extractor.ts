/**
 * Python Pattern Extractor
 *
 * Extracts functions and classes from Python code for similarity analysis
 */

import { getParser, Language } from '@aiready/core';
import type { CodePattern } from '../types';

/**
 * Extract patterns from Python files
 */
export async function extractPythonPatterns(
  files: string[]
): Promise<CodePattern[]> {
  const patterns: CodePattern[] = [];
  const parser = getParser('dummy.py');

  if (!parser) {
    console.warn('Python parser not available');
    return patterns;
  }

  const pythonFiles = files.filter((f) => f.toLowerCase().endsWith('.py'));

  for (const file of pythonFiles) {
    try {
      const fs = await import('fs');
      const code = await fs.promises.readFile(file, 'utf-8');
      const result = parser.parse(code, file);

      // Extract function patterns
      for (const exp of result.exports) {
        if (exp.type === 'function') {
          patterns.push({
            file,
            name: exp.name,
            type: 'function',
            startLine: exp.loc?.start.line || 0,
            endLine: exp.loc?.end.line || 0,
            imports: exp.imports || [],
            dependencies: exp.dependencies || [],
            signature: generatePythonSignature(exp),
            language: 'python',
          });
        } else if (exp.type === 'class') {
          patterns.push({
            file,
            name: exp.name,
            type: 'class',
            startLine: exp.loc?.start.line || 0,
            endLine: exp.loc?.end.line || 0,
            imports: exp.imports || [],
            dependencies: exp.dependencies || [],
            signature: `class ${exp.name}`,
            language: 'python',
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to extract patterns from ${file}:`, error);
    }
  }

  return patterns;
}

/**
 * Generate a signature for a Python function
 */
function generatePythonSignature(exp: any): string {
  const params = exp.parameters?.join(', ') || '';
  return `def ${exp.name}(${params})`;
}

/**
 * Calculate similarity between two Python patterns
 */
export function calculatePythonSimilarity(
  pattern1: CodePattern,
  pattern2: CodePattern
): number {
  let similarity = 0;
  let factors = 0;

  // 1. Name similarity (30%)
  const nameSimilarity = calculateNameSimilarity(pattern1.name, pattern2.name);
  similarity += nameSimilarity * 0.3;
  factors += 0.3;

  // 2. Import similarity (40%)
  const importSimilarity = calculateImportSimilarity(
    pattern1.imports || [],
    pattern2.imports || []
  );
  similarity += importSimilarity * 0.4;
  factors += 0.4;

  // 3. Type similarity (10%)
  if (pattern1.type === pattern2.type) {
    similarity += 0.1;
  }
  factors += 0.1;

  // 4. Signature similarity (20%)
  const sigSimilarity = calculateSignatureSimilarity(
    pattern1.signature,
    pattern2.signature
  );
  similarity += sigSimilarity * 0.2;
  factors += 0.2;

  return factors > 0 ? similarity / factors : 0;
}

/**
 * Calculate name similarity using Levenshtein-based approach
 */
function calculateNameSimilarity(name1: string, name2: string): number {
  if (name1 === name2) return 1;

  // Remove common prefixes/suffixes
  const clean1 = name1.replace(
    /^(get|set|is|has|create|delete|update|fetch)_?/,
    ''
  );
  const clean2 = name2.replace(
    /^(get|set|is|has|create|delete|update|fetch)_?/,
    ''
  );

  if (clean1 === clean2) return 0.9;

  // Check for substring match
  if (clean1.includes(clean2) || clean2.includes(clean1)) {
    return 0.7;
  }

  // Simple character overlap
  const set1 = new Set(clean1.split('_'));
  const set2 = new Set(clean2.split('_'));
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Calculate import similarity (Jaccard index)
 */
function calculateImportSimilarity(
  imports1: string[],
  imports2: string[]
): number {
  if (imports1.length === 0 && imports2.length === 0) return 1;
  if (imports1.length === 0 || imports2.length === 0) return 0;

  const set1 = new Set(imports1);
  const set2 = new Set(imports2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Calculate signature similarity
 */
function calculateSignatureSimilarity(sig1: string, sig2: string): number {
  if (sig1 === sig2) return 1;

  // Extract parameter counts
  const params1 = (sig1.match(/\([^)]*\)/)?.[0] || '')
    .split(',')
    .filter(Boolean).length;
  const params2 = (sig2.match(/\([^)]*\)/)?.[0] || '')
    .split(',')
    .filter(Boolean).length;

  if (params1 === params2) return 0.8;
  if (Math.abs(params1 - params2) === 1) return 0.5;

  return 0;
}

/**
 * Detect common Python patterns that indicate duplication
 */
export function detectPythonAntiPatterns(patterns: CodePattern[]): string[] {
  const antiPatterns: string[] = [];

  // Group by similar names
  const nameGroups = new Map<string, CodePattern[]>();

  for (const pattern of patterns) {
    const baseName = pattern.name.replace(
      /^(get|set|create|delete|update)_/,
      ''
    );
    if (!nameGroups.has(baseName)) {
      nameGroups.set(baseName, []);
    }
    nameGroups.get(baseName)!.push(pattern);
  }

  // Check for groups with multiple similar patterns
  for (const [baseName, group] of nameGroups) {
    if (group.length >= 3) {
      antiPatterns.push(
        `Found ${group.length} functions with similar names (${baseName}): Consider consolidating`
      );
    }
  }

  return antiPatterns;
}
