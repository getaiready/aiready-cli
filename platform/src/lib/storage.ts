/**
 * S3 Storage utilities for AIReady Platform
 *
 * Bucket: aiready-platform-analysis
 *
 * Key patterns:
 *   analyses/<userId>/<repoId>/<timestamp>.json  - Raw analysis JSON
 *   uploads/<userId>/<filename>                  - User uploads
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ToolName, FRIENDLY_TOOL_NAMES } from '@aiready/core/client';

// Initialize S3 client
const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-southeast-2' });

// Type assertion for getSignedUrl compatibility
const s3Client = s3 as any;

export const getBucketName = () =>
  process.env.S3_BUCKET || 'aiready-platform-analysis';

// Types
export interface AnalysisUpload {
  userId: string;
  repoId: string;
  timestamp: string;
  data: unknown;
}

export interface AnalysisData {
  metadata: {
    repository: string;
    branch: string;
    commit: string;
    timestamp: string;
    toolVersion: string;
  };
  summary: {
    aiReadinessScore: number;
    totalFiles: number;
    totalIssues: number;
    criticalIssues: number;
    warnings: number;
  };
  breakdown: Record<
    string,
    {
      score: number;
      count: number;
      details: any[];
    }
  >;
  rawOutput?: unknown;
}

/**
 * Store raw analysis JSON in S3
 */
export async function storeAnalysis(analysis: AnalysisUpload): Promise<string> {
  const BUCKET_NAME = getBucketName();
  const key = `analyses/${analysis.userId}/${analysis.repoId}/${analysis.timestamp}.json`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(analysis.data, null, 2),
      ContentType: 'application/json',
      Metadata: {
        userId: analysis.userId,
        repoId: analysis.repoId,
        timestamp: analysis.timestamp,
      },
    })
  );

  return key;
}

/**
 * Retrieve raw analysis JSON from S3
 */
export async function getAnalysis(key: string): Promise<AnalysisData | null> {
  const BUCKET_NAME = getBucketName();
  try {
    const result = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    const body = await result.Body?.transformToString();
    if (!body) return null;

    const raw = JSON.parse(body);
    // Force re-normalization for all S3 retrievals to apply latest mapping rules
    return normalizeReport(raw, true);
  } catch (error) {
    console.error('Error fetching analysis from S3:', error);
    return null;
  }
}

/**
 * Delete analysis from S3
 */
export async function deleteAnalysis(key: string): Promise<void> {
  const BUCKET_NAME = getBucketName();
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}

/**
 * List all analyses for a repository
 */
export async function listRepositoryAnalyses(
  userId: string,
  repoId: string
): Promise<string[]> {
  const BUCKET_NAME = getBucketName();
  const prefix = `analyses/${userId}/${repoId}/`;

  const result = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    })
  );

  return (result.Contents || [])
    .map((obj) => obj.Key)
    .filter((key): key is string => key !== undefined);
}

/**
 * Delete all assets for a repository from S3
 */
export async function deleteRepositoryAssets(
  userId: string,
  repoId: string
): Promise<void> {
  const BUCKET_NAME = getBucketName();
  const keys = await listRepositoryAnalyses(userId, repoId);

  if (keys.length === 0) return;

  // S3 DeleteObjects can handle up to 1000 keys at once
  // For safety and simplicity, we'll chunk if needed, though repos rarely have > 1000 analyses
  const chunks = [];
  for (let i = 0; i < keys.length; i += 1000) {
    chunks.push(keys.slice(i, i + 1000));
  }

  for (const chunk of chunks) {
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: chunk.map((key) => ({ Key: key })),
        },
      })
    );
  }
}

/**
 * Generate a presigned URL for downloading analysis
 */
export async function getAnalysisDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const BUCKET_NAME = getBucketName();
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Calculate AI Readiness Score from analysis data
 */
export function calculateAiScore(data: Partial<AnalysisData>): number {
  // Use scores from breakdown directly
  const b = data.breakdown || {};

  // Weights matching packages/core/src/scoring.ts
  const weights: Record<string, number> = {
    [ToolName.PatternDetect]: 22,
    [ToolName.ContextAnalyzer]: 19,
    [ToolName.NamingConsistency]: 14,
    [ToolName.AiSignalClarity]: 11,
    [ToolName.AgentGrounding]: 10,
    [ToolName.TestabilityIndex]: 10,
    [ToolName.DocDrift]: 8,
    [ToolName.DependencyHealth]: 6,
    [ToolName.ChangeAmplification]: 8,
    [ToolName.CognitiveLoad]: 7,
    [ToolName.PatternEntropy]: 6,
    [ToolName.ConceptCohesion]: 6,
    [ToolName.SemanticDistance]: 5,
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const val = (b as any)[key];
    const score = typeof val === 'number' ? val : (val as any)?.score;

    if (typeof score === 'number' && score > 0) {
      weightedSum += score * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round(weightedSum / totalWeight);
}

/**
 * Extract summary for DynamoDB storage
 */
export function extractSummary(data: AnalysisData) {
  return {
    totalFiles: data.summary.totalFiles,
    totalIssues: data.summary.totalIssues,
    criticalIssues: data.summary.criticalIssues,
    warnings: data.summary.warnings,
  };
}

/**
 * Extract breakdown for DynamoDB storage
 */
export function extractBreakdown(data: AnalysisData) {
  const b = data.breakdown || {};
  const result: Record<string, number> = {};

  for (const key of Object.values(ToolName)) {
    const val = (b as any)[key];
    if (val !== undefined && val !== null) {
      const score = typeof val === 'number' ? val : (val as any).score;
      if (typeof score === 'number' && score >= 0) {
        result[key] = score;
      }
    }
  }

  return result;
}

/**
 * Cleans a file path by removing absolute prefixes and common temp patterns.
 */
function cleanPath(filePath: string, rootDir?: string): string {
  if (!filePath) return filePath;

  let cleaned = filePath;

  // 1. If explicit rootDir provided, strip it first
  if (rootDir && cleaned.startsWith(rootDir)) {
    cleaned = cleaned.substring(rootDir.length);
  }

  // 2. Remove common absolute prefixes used in worker/local scans
  // Patterns like /tmp/repo-uuid/
  cleaned = cleaned.replace(/^\/tmp\/repo-[^/]+\//, '');

  // 3. Remove leading slash if any
  cleaned = cleaned.replace(/^\/+/, '');

  return cleaned;
}

/**
 * Normalize raw CLI report data into AnalysisData schema
 * Enforces Canonical IDs for all tools.
 */
export function normalizeReport(
  raw: any,
  force = false,
  rootDir?: string
): AnalysisData {
  // If it's already in the target format AND has breakdown details, and we are not forcing, return as is.
  if (
    !force &&
    raw.metadata &&
    raw.summary &&
    raw.breakdown &&
    typeof raw.breakdown === 'object' &&
    !Array.isArray(raw.breakdown)
  ) {
    const values = Object.values(raw.breakdown);
    if (
      values.length > 0 &&
      typeof values[0] === 'object' &&
      values[0] !== null &&
      'details' in (values[0] as any)
    ) {
      return raw as AnalysisData;
    }
  }

  const source = raw.rawOutput || raw;
  const scoring = source.scoring || {};
  const summary = source.summary || {};
  const metadata = source.metadata || {};
  const repo = metadata.repository || source.repository || {};

  // Tool Legacy Mappings (For historical reports and mapping IssueType to ToolName)
  const legacyMappings: Record<string, string> = {
    // CLI Old Shorthands
    patterns: ToolName.PatternDetect,
    context: ToolName.ContextAnalyzer,
    consistency: ToolName.NamingConsistency,
    'ai-signal': ToolName.AiSignalClarity,
    grounding: ToolName.AgentGrounding,
    testability: ToolName.TestabilityIndex,
    'doc-drift': ToolName.DocDrift,
    'deps-health': ToolName.DependencyHealth,
    'naming-inconsistency': ToolName.NamingConsistency,
    'naming-quality': ToolName.NamingConsistency,
    'architecture-inconsistency': ToolName.NamingConsistency,
    'magic-literal': ToolName.AiSignalClarity,
    'boolean-trap': ToolName.AiSignalClarity,
    'agent-navigation-failure': ToolName.AgentGrounding,
    'ambiguous-api': ToolName.AiSignalClarity,
    'change-amplification': ToolName.ChangeAmplification,
    // Very old legacy keys
    semanticDuplicates: ToolName.PatternDetect,
    contextFragmentation: ToolName.ContextAnalyzer,
  };

  const breakdown: any = {};

  // Initialize all canonical tool keys
  Object.values(ToolName).forEach((key) => {
    breakdown[key] = { score: 0, count: 0, details: [] };
  });

  // 1. First, populate scores from scoring.breakdown (Standardized source)
  if (Array.isArray(scoring.breakdown)) {
    scoring.breakdown.forEach((item: any) => {
      const canonicalId = (Object.values(ToolName) as string[]).includes(
        item.toolName
      )
        ? item.toolName
        : legacyMappings[item.toolName] || item.toolName;

      if (breakdown[canonicalId]) {
        breakdown[canonicalId].score = item.score || 0;
      }
    });
  }

  // 1.5 Also check top-level breakdown if it exists (Legacy CLI/Platform format)
  if (
    source.breakdown &&
    typeof source.breakdown === 'object' &&
    !Array.isArray(source.breakdown)
  ) {
    for (const [k, v] of Object.entries(source.breakdown)) {
      const canonicalId = legacyMappings[k] || k;
      if (breakdown[canonicalId]) {
        const score = typeof v === 'number' ? v : (v as any).score;
        if (typeof score === 'number' && breakdown[canonicalId].score === 0) {
          breakdown[canonicalId].score = score;
        }
      }
    }
  }

  // 2. Populate details from results array (New standardized results format)
  if (Array.isArray(source.results)) {
    source.results.forEach((r: any) => {
      if (r.issues && Array.isArray(r.issues)) {
        r.issues.forEach((issue: any) => {
          // Map issue type to canonical tool ID
          const canonicalId = (Object.values(ToolName) as string[]).includes(
            issue.type
          )
            ? issue.type
            : legacyMappings[issue.type] ||
              legacyMappings[issue.category] ||
              'unknown';

          if (breakdown[canonicalId]) {
            const normalized = {
              ...issue,
              location: {
                ...issue.location,
                file: cleanPath(issue.location?.file || r.fileName, rootDir),
              },
            };
            breakdown[canonicalId].details.push(normalized);
            breakdown[canonicalId].count++;
          }
        });
      }
    });
  }

  // 3. Fallback for older formats or missing results (Top-level tool objects)
  Object.values(ToolName).forEach((toolId) => {
    // Only proceed if we don't have many details yet
    if (breakdown[toolId]?.count > 0) return;

    // Try finding data under various possible keys (hyphenated, camelCase, legacy)
    const possibleKeys = [
      toolId,
      toolId.replace(/-([a-z])/g, (g) => g[1].toUpperCase()), // camelCase
      Object.keys(legacyMappings).find((k) => legacyMappings[k] === toolId),
    ].filter(Boolean) as string[];

    for (const key of possibleKeys) {
      const toolData = source[key];
      if (toolData) {
        const score = toolData.score || toolData.summary?.score || 0;
        if (breakdown[toolId].score === 0) {
          breakdown[toolId].score = score;
        }

        const resultsArray =
          toolData.results ||
          toolData.issues ||
          (Array.isArray(toolData) ? toolData : []);

        if (Array.isArray(resultsArray)) {
          resultsArray.forEach((r: any) => {
            const normalizedList =
              typeof r === 'string'
                ? [{ message: r, severity: 'major' as const }]
                : r.issues && Array.isArray(r.issues)
                  ? r.issues.map((i: any) => ({
                      ...i,
                      location: i.location || {
                        file: r.fileName || r.file,
                        line: 1,
                      },
                    }))
                  : [{ ...r }];

            normalizedList.forEach((normalized: any) => {
              if (normalized.location?.file) {
                normalized.location.file = cleanPath(
                  normalized.location.file,
                  rootDir
                );
              } else if (normalized.file) {
                normalized.location = {
                  ...normalized.location,
                  file: cleanPath(normalized.file, rootDir),
                };
              }
              breakdown[toolId].details.push(normalized);
              breakdown[toolId].count++;
            });
          });
        }
        break; // found it
      }
    }
  });

  // Final cleanup: remove keys with no data
  Object.keys(breakdown).forEach((key) => {
    if (
      breakdown[key].score === 0 &&
      breakdown[key].count === 0 &&
      breakdown[key].details.length === 0
    ) {
      delete breakdown[key];
    }
  });

  // Calculate overall score if missing or zero
  let aiReadinessScore = scoring.overall || 0;
  if (aiReadinessScore === 0) {
    aiReadinessScore = calculateAiScore({ breakdown });
  }

  return {
    metadata: {
      repository: repo.name || 'unknown',
      branch: repo.branch || 'main',
      commit: repo.commit || 'unknown',
      timestamp: scoring.timestamp || new Date().toISOString(),
      toolVersion: repo.version || '0.1.0',
    },
    summary: {
      aiReadinessScore,
      totalFiles: summary.totalFiles || 0,
      totalIssues: summary.totalIssues || 0,
      criticalIssues: summary.criticalIssues || 0,
      warnings: summary.warnings || 0,
    },
    breakdown,
    rawOutput: source,
  };
}

export { s3 };
