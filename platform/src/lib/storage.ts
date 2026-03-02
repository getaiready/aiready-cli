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
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-southeast-2' });

// Type assertion for getSignedUrl compatibility
const s3Client = s3 as any;

const BUCKET_NAME = process.env.S3_BUCKET || 'aiready-platform-analysis';

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
  breakdown: {
    semanticDuplicates: {
      score: number;
      count: number;
      details: Array<{
        type: string;
        file1: string;
        file2: string;
        similarity: number;
      }>;
    };
    contextFragmentation: {
      score: number;
      chains: Array<{
        file: string;
        chainLength: number;
        contextCost: number;
      }>;
    };
    namingConsistency: {
      score: number;
      inconsistencies: Array<{
        type: string;
        expected: string;
        actual: string;
        file: string;
      }>;
    };
    documentationHealth: {
      score: number;
      missingDocs: string[];
      outdatedDocs: string[];
    };
    dependencyHealth: {
      score: number;
      issues: any[];
    };
    aiSignalClarity: {
      score: number;
      signals: any[];
    };
    agentGrounding: {
      score: number;
      issues: any[];
    };
    testabilityIndex: {
      score: number;
      issues: any[];
    };
    changeAmplification: {
      score: number;
      issues: any[];
    };
  };
  rawOutput?: unknown;
}

/**
 * Store raw analysis JSON in S3
 */
export async function storeAnalysis(analysis: AnalysisUpload): Promise<string> {
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
  try {
    const result = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    const body = await result.Body?.transformToString();
    if (!body) return null;

    return JSON.parse(body) as AnalysisData;
  } catch (error) {
    console.error('Error fetching analysis from S3:', error);
    return null;
  }
}

/**
 * Delete analysis from S3
 */
export async function deleteAnalysis(key: string): Promise<void> {
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
 * Generate a presigned URL for downloading analysis
 */
export async function getAnalysisDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Calculate AI Readiness Score from analysis data
 */
export function calculateAiScore(data: AnalysisData): number {
  // Weighted average of breakdown scores (weights sum to 100)
  const weights = {
    semanticDuplicates: 22,
    contextFragmentation: 19,
    namingConsistency: 14,
    documentationHealth: 8,
    aiSignalClarity: 11,
    agentGrounding: 10,
    testabilityIndex: 10,
    dependencyHealth: 6,
  };

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const score = (data.breakdown?.[key as keyof typeof data.breakdown] as any)
      ?.score;
    if (typeof score === 'number') {
      totalWeightedScore += score * weight;
      totalWeight += weight;
    }
  }

  // Handle changeAmplification if present (dynamically add weight)
  if (data.breakdown?.changeAmplification?.score !== undefined) {
    totalWeightedScore += data.breakdown.changeAmplification.score * 5;
    totalWeight += 5;
  }

  if (totalWeight === 0) return 0;
  return Math.round(totalWeightedScore / totalWeight);
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
  return {
    semanticDuplicates: b.semanticDuplicates?.score || 0,
    contextFragmentation: b.contextFragmentation?.score || 0,
    namingConsistency: b.namingConsistency?.score || 0,
    documentationHealth: b.documentationHealth?.score || 0,
    dependencyHealth: b.dependencyHealth?.score || 0,
    aiSignalClarity: b.aiSignalClarity?.score || 0,
    agentGrounding: b.agentGrounding?.score || 0,
    testabilityIndex: b.testabilityIndex?.score || 0,
    changeAmplification: b.changeAmplification?.score || 0,
  };
}

/**
 * Normalize raw CLI report data into AnalysisData schema
 */
export function normalizeReport(raw: any): AnalysisData {
  // If it's already in the target format, return as is
  if (raw.metadata && raw.summary && raw.breakdown) {
    return raw as AnalysisData;
  }

  const scoring = raw.scoring || {};
  const summary = raw.summary || {};
  const repo = raw.repository || {};

  const breakdown: any = {};
  const toolMappings: Record<string, string> = {
    'pattern-detect': 'semanticDuplicates',
    'context-analyzer': 'contextFragmentation',
    consistency: 'namingConsistency',
    'ai-signal-clarity': 'aiSignalClarity',
    'agent-grounding': 'agentGrounding',
    testability: 'testabilityIndex',
    'doc-drift': 'documentationHealth',
    'dependency-health': 'dependencyHealth',
    'change-amplification': 'changeAmplification',
  };

  if (Array.isArray(scoring.breakdown)) {
    for (const item of scoring.breakdown) {
      const platformKey = toolMappings[item.toolName];
      if (platformKey) {
        breakdown[platformKey] = {
          score: item.score || 0,
          count: item.rawMetrics?.totalIssues || item.rawMetrics?.count || 0,
          details: item.recommendations || [],
        };
      }
    }
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
      aiReadinessScore: scoring.overall || 0,
      totalFiles: summary.totalFiles || 0,
      totalIssues: summary.totalIssues || 0,
      criticalIssues: summary.criticalIssues || 0,
      warnings: summary.warnings || 0,
    },
    breakdown,
    rawOutput: raw,
  };
}

export { s3, BUCKET_NAME };
