/**
 * Grouping and clustering utilities for duplicate patterns
 * Reduces noise by consolidating similar duplicates and creating refactor clusters
 */

import type { DuplicatePattern, PatternType } from './detector';
import type { Severity } from './context-rules';

export interface DuplicateGroup {
  filePair: string; // "file1::file2" (normalized)
  duplicates: DuplicatePattern[];
  totalTokenCost: number;
  averageSimilarity: number;
  maxSimilarity: number;
  severity: Severity;
  patternType: PatternType;
  occurrences: number;
  lineRanges: Array<{
    file1: { start: number; end: number };
    file2: { start: number; end: number };
  }>;
}

export interface RefactorCluster {
  id: string;
  name: string; // e.g., "Blog SEO Boilerplate"
  files: string[];
  patternType: PatternType;
  severity: Severity;
  totalTokenCost: number;
  averageSimilarity: number;
  duplicateCount: number;
  suggestion: string;
  reason: string;
}

/**
 * Normalize file pair to ensure consistent ordering
 * file1::file2 === file2::file1
 */
function normalizeFilePair(file1: string, file2: string): string {
  return file1 < file2 ? `${file1}::${file2}` : `${file2}::${file1}`;
}

/**
 * Check if two line ranges overlap or are adjacent
 */
function rangesOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number,
  tolerance: number = 5
): boolean {
  // Allow small tolerance for adjacent blocks
  return start1 <= end2 + tolerance && start2 <= end1 + tolerance;
}

/**
 * Group duplicates by file pair, consolidating similar line ranges
 * Reduces "80% similar entries for the same file pairs" noise
 */
export function groupDuplicatesByFilePair(
  duplicates: DuplicatePattern[]
): DuplicateGroup[] {
  const groups = new Map<string, DuplicatePattern[]>();

  // Group by file pair
  for (const dup of duplicates) {
    const key = normalizeFilePair(dup.file1, dup.file2);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(dup);
  }

  // Convert to DuplicateGroup with aggregated metrics
  const result: DuplicateGroup[] = [];

  for (const [filePair, groupDups] of groups.entries()) {
    // Deduplicate overlapping line ranges
    const deduplicated = deduplicateOverlappingRanges(groupDups);

    // Calculate aggregate metrics
    const totalTokenCost = deduplicated.reduce(
      (sum, d) => sum + d.tokenCost,
      0
    );
    const averageSimilarity =
      deduplicated.reduce((sum, d) => sum + d.similarity, 0) /
      deduplicated.length;
    const maxSimilarity = Math.max(...deduplicated.map((d) => d.similarity));

    // Use highest severity in group
    const severity = getHighestSeverity(deduplicated.map((d) => d.severity));

    // Use most common pattern type
    const patternType = getMostCommonPatternType(deduplicated);

    // Collect line ranges
    const lineRanges = deduplicated.map((d) => ({
      file1: { start: d.line1, end: d.endLine1 },
      file2: { start: d.line2, end: d.endLine2 },
    }));

    result.push({
      filePair,
      duplicates: deduplicated,
      totalTokenCost,
      averageSimilarity,
      maxSimilarity,
      severity,
      patternType,
      occurrences: deduplicated.length,
      lineRanges,
    });
  }

  // Sort by total token cost (highest first)
  return result.sort((a, b) => b.totalTokenCost - a.totalTokenCost);
}

/**
 * Deduplicate overlapping line ranges within the same file pair
 * Keeps the duplicate with highest similarity for each overlapping region
 */
function deduplicateOverlappingRanges(
  duplicates: DuplicatePattern[]
): DuplicatePattern[] {
  if (duplicates.length === 0) return [];

  // Sort by line1, then by similarity (descending)
  const sorted = [...duplicates].sort((a, b) => {
    if (a.line1 !== b.line1) return a.line1 - b.line1;
    return b.similarity - a.similarity;
  });

  const result: DuplicatePattern[] = [];
  let current: DuplicatePattern | null = null;

  for (const dup of sorted) {
    if (!current) {
      current = dup;
      result.push(dup);
      continue;
    }

    // Check if this duplicate overlaps with current
    const overlapsFile1 = rangesOverlap(
      current.line1,
      current.endLine1,
      dup.line1,
      dup.endLine1
    );
    const overlapsFile2 = rangesOverlap(
      current.line2,
      current.endLine2,
      dup.line2,
      dup.endLine2
    );

    if (overlapsFile1 && overlapsFile2) {
      // Overlaps - keep current (higher similarity due to sort)
      // Update current to cover merged range
      current = {
        ...current,
        endLine1: Math.max(current.endLine1, dup.endLine1),
        endLine2: Math.max(current.endLine2, dup.endLine2),
        tokenCost: Math.max(current.tokenCost, dup.tokenCost),
      };
      // Update in result
      result[result.length - 1] = current;
    } else {
      // No overlap - add as new duplicate
      current = dup;
      result.push(dup);
    }
  }

  return result;
}

/**
 * Create refactor clusters for related duplicates
 * Groups UI patterns, components, etc. into actionable clusters
 */
export function createRefactorClusters(
  duplicates: DuplicatePattern[]
): RefactorCluster[] {
  const clusters = new Map<string, DuplicatePattern[]>();

  for (const dup of duplicates) {
    const clusterId = identifyCluster(dup);
    if (!clusters.has(clusterId)) {
      clusters.set(clusterId, []);
    }
    clusters.get(clusterId)!.push(dup);
  }

  const result: RefactorCluster[] = [];

  for (const [clusterId, clusterDups] of clusters.entries()) {
    // Only create cluster if there are multiple related duplicates
    if (clusterDups.length < 2) continue;

    const files = getUniqueFiles(clusterDups);
    const totalTokenCost = clusterDups.reduce((sum, d) => sum + d.tokenCost, 0);
    const averageSimilarity =
      clusterDups.reduce((sum, d) => sum + d.similarity, 0) /
      clusterDups.length;
    const severity = getHighestSeverity(clusterDups.map((d) => d.severity));
    const patternType = getMostCommonPatternType(clusterDups);

    const clusterInfo = getClusterInfo(clusterId, patternType, files.length);

    result.push({
      id: clusterId,
      name: clusterInfo.name,
      files,
      patternType,
      severity,
      totalTokenCost,
      averageSimilarity,
      duplicateCount: clusterDups.length,
      suggestion: clusterInfo.suggestion,
      reason: clusterInfo.reason,
    });
  }

  // Sort by token cost (highest first)
  return result.sort((a, b) => b.totalTokenCost - a.totalTokenCost);
}

/**
 * Identify which cluster a duplicate belongs to based on file patterns
 */
function identifyCluster(dup: DuplicatePattern): string {
  const file1 = dup.file1.toLowerCase();
  const file2 = dup.file2.toLowerCase();

  // Blog/article patterns
  if (
    (file1.includes('/blog/') ||
      file1.startsWith('blog/') ||
      file1.includes('/articles/') ||
      file1.startsWith('articles/')) &&
    (file2.includes('/blog/') ||
      file2.startsWith('blog/') ||
      file2.includes('/articles/') ||
      file2.startsWith('articles/'))
  ) {
    return 'blog-seo-boilerplate';
  }

  // Component patterns
  if (
    (file1.includes('/components/') || file1.startsWith('components/')) &&
    (file2.includes('/components/') || file2.startsWith('components/')) &&
    dup.patternType === 'component'
  ) {
    // Group by component type (e.g., Button, Card, Modal)
    // Use original file paths (not lowercased) for component name extraction
    const component1 = extractComponentName(dup.file1);
    const component2 = extractComponentName(dup.file2);
    console.log(
      `Component check: ${dup.file1} -> ${component1}, ${dup.file2} -> ${component2}`
    );
    if (
      component1 &&
      component2 &&
      areSimilarComponents(component1, component2)
    ) {
      const category = getComponentCategory(component1);
      console.log(`Creating cluster: component-${category}`);
      return `component-${category}`;
    }
  }

  // E2E test patterns
  if (
    (file1.includes('/e2e/') ||
      file1.startsWith('e2e/') ||
      file1.includes('.e2e.')) &&
    (file2.includes('/e2e/') ||
      file2.startsWith('e2e/') ||
      file2.includes('.e2e.'))
  ) {
    return 'e2e-test-patterns';
  }

  // API handler patterns
  if (dup.patternType === 'api-handler') {
    return 'api-handlers';
  }

  // Validator patterns
  if (dup.patternType === 'validator') {
    return 'validators';
  }

  // Infrastructure scripts
  if (
    (file1.includes('/scripts/') ||
      file1.startsWith('scripts/') ||
      file1.includes('/infra/') ||
      file1.startsWith('infra/')) &&
    (file2.includes('/scripts/') ||
      file2.startsWith('scripts/') ||
      file2.includes('/infra/') ||
      file2.startsWith('infra/'))
  ) {
    return 'infrastructure-scripts';
  }

  // Default: group by pattern type
  return `${dup.patternType}-patterns`;
}

/**
 * Extract component name from file path
 */
function extractComponentName(filePath: string): string | null {
  const match = filePath.match(/[/\\]?([A-Z][a-zA-Z0-9]*)\.(tsx|jsx|ts|js)$/);
  return match ? match[1] : null;
}

/**
 * Check if two component names are similar (same category)
 */
function areSimilarComponents(name1: string, name2: string): boolean {
  const category1 = getComponentCategory(name1);
  const category2 = getComponentCategory(name2);
  return category1 === category2;
}

/**
 * Categorize component by name pattern
 */
function getComponentCategory(name: string): string {
  name = name.toLowerCase();

  if (name.includes('button') || name.includes('btn')) return 'button';
  if (name.includes('card')) return 'card';
  if (name.includes('modal') || name.includes('dialog')) return 'modal';
  if (name.includes('form')) return 'form';
  if (name.includes('input') || name.includes('field')) return 'input';
  if (name.includes('table') || name.includes('grid')) return 'table';
  if (name.includes('nav') || name.includes('menu')) return 'navigation';
  if (name.includes('header') || name.includes('footer')) return 'layout';

  return 'misc';
}

/**
 * Get unique files from duplicates
 */
function getUniqueFiles(duplicates: DuplicatePattern[]): string[] {
  const files = new Set<string>();
  for (const dup of duplicates) {
    files.add(dup.file1);
    files.add(dup.file2);
  }
  return Array.from(files).sort();
}

/**
 * Get highest severity from a list
 */
function getHighestSeverity(severities: Severity[]): Severity {
  const order: Record<Severity, number> = {
    critical: 4,
    major: 3,
    minor: 2,
    info: 1,
  };

  let highest: Severity = 'info';
  let highestValue = 0;

  for (const severity of severities) {
    if (order[severity] > highestValue) {
      highestValue = order[severity];
      highest = severity;
    }
  }

  return highest;
}

/**
 * Get most common pattern type
 */
function getMostCommonPatternType(duplicates: DuplicatePattern[]): PatternType {
  const counts = new Map<PatternType, number>();

  for (const dup of duplicates) {
    counts.set(dup.patternType, (counts.get(dup.patternType) || 0) + 1);
  }

  let mostCommon: PatternType = 'unknown';
  let maxCount = 0;

  for (const [type, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = type;
    }
  }

  return mostCommon;
}

/**
 * Get cluster-specific information
 */
function getClusterInfo(
  clusterId: string,
  patternType: PatternType,
  fileCount: number
): { name: string; suggestion: string; reason: string } {
  const templates: Record<
    string,
    { name: string; suggestion: string; reason: string }
  > = {
    'blog-seo-boilerplate': {
      name: `Blog SEO Boilerplate (${fileCount} files)`,
      suggestion:
        'Create BlogPageLayout component with SEO schema generator, breadcrumb component, and metadata helpers',
      reason:
        'SEO boilerplate duplication increases maintenance burden and schema consistency risk',
    },
    'e2e-test-patterns': {
      name: `E2E Test Patterns (${fileCount} files)`,
      suggestion:
        'Extract page object helpers and common test utilities (waitFor, fillForm, etc.)',
      reason:
        'Test helper extraction improves maintainability while preserving test independence',
    },
    'api-handlers': {
      name: `API Handler Patterns (${fileCount} files)`,
      suggestion:
        'Extract common middleware, error handling, and response formatting',
      reason:
        'API handler duplication leads to inconsistent error handling and response formats',
    },
    validators: {
      name: `Validator Patterns (${fileCount} files)`,
      suggestion:
        'Consolidate into shared schema validators (Zod/Yup) with reusable rules',
      reason:
        'Validator duplication causes inconsistent validation and harder maintenance',
    },
    'infrastructure-scripts': {
      name: `Infrastructure Scripts (${fileCount} files)`,
      suggestion:
        'Extract common CLI parsing, file I/O, and error handling utilities',
      reason:
        'Script duplication is often acceptable for one-off tasks, but common patterns can be shared',
    },
    'component-button': {
      name: `Button Component Variants (${fileCount} files)`,
      suggestion: 'Create unified Button component with variant props',
      reason: 'Multiple button variants should share base styles and behavior',
    },
    'component-card': {
      name: `Card Component Variants (${fileCount} files)`,
      suggestion: 'Create unified Card component with composition pattern',
      reason: 'Card variants should share layout structure and styling',
    },
    'component-modal': {
      name: `Modal Component Variants (${fileCount} files)`,
      suggestion: 'Create base Modal component with customizable content',
      reason:
        'Modal variants should share overlay, animation, and accessibility logic',
    },
  };

  if (templates[clusterId]) {
    return templates[clusterId];
  }

  // Default template
  return {
    name: `${patternType} Cluster (${fileCount} files)`,
    suggestion: `Extract common ${patternType} patterns into shared utilities`,
    reason: `Multiple similar ${patternType} patterns detected across ${fileCount} files`,
  };
}

/**
 * Filter clusters by minimum impact threshold
 * Reduces noise from minor refactoring opportunities
 */
export function filterClustersByImpact(
  clusters: RefactorCluster[],
  minTokenCost: number = 1000,
  minFileCount: number = 3
): RefactorCluster[] {
  return clusters.filter(
    (cluster) =>
      cluster.totalTokenCost >= minTokenCost ||
      cluster.files.length >= minFileCount
  );
}
