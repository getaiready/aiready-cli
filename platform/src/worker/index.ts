import { SQSEvent } from 'aws-lambda';
import * as fs from 'fs';
import * as path from 'path';
import * as git from 'isomorphic-git';
// @ts-ignore
import http from 'isomorphic-git/http/node';
import { randomUUID } from 'crypto';
import {
  normalizeReport,
  calculateAiScore,
  extractBreakdown,
  extractSummary,
  storeAnalysis,
} from '../lib/storage';
import { createAnalysis, getRepository } from '../lib/db';

export async function handler(event: SQSEvent) {
  for (const record of event.Records) {
    const { repoId, userId } = JSON.parse(record.body) as {
      repoId: string;
      userId: string;
    };

    console.log(`[ScanWorker] Processing repo ${repoId} for user ${userId}`);

    const repo = await getRepository(repoId);
    if (!repo) {
      console.error(`[ScanWorker] Repository ${repoId} not found`);
      continue;
    }

    const tempDir = path.join('/tmp', `repo-${randomUUID()}`);

    try {
      console.log(`[ScanWorker] Cloning ${repo.url} to ${tempDir}...`);

      await git.clone({
        fs,
        http,
        dir: tempDir,
        url: repo.url,
        singleBranch: true,
        depth: 1,
      });

      console.log(`[ScanWorker] Running AIReady analysis...`);

      // Dynamic import of CLI to avoid loading it if not needed
      const { analyzeUnified } = await import('@aiready/cli');

      const results = await analyzeUnified({
        rootDir: tempDir,
        tools: [
          'patterns',
          'context',
          'consistency',
          'changeAmplification',
          'aiSignalClarity',
          'grounding',
          'testability',
          'doc-drift',
          'deps-health',
        ],
      } as any);

      console.log(`[ScanWorker] Analysis complete. Normalizing results...`);

      const data = normalizeReport(results);
      const timestamp = new Date().toISOString();
      const analysisId = randomUUID();

      // Calculate scores
      const aiScore = calculateAiScore(data);

      // Store in S3
      const rawKey = await storeAnalysis({
        userId,
        repoId,
        timestamp,
        data,
      });

      // Create record in DynamoDB
      await createAnalysis({
        id: analysisId,
        repoId,
        userId,
        timestamp,
        aiScore,
        breakdown: extractBreakdown(data),
        rawKey,
        summary: extractSummary(data),
        createdAt: new Date().toISOString(),
      });

      console.log(
        `[ScanWorker] Successfully completed analysis ${analysisId} for repo ${repoId}`
      );
    } catch (error) {
      console.error(`[ScanWorker] Error processing repo ${repoId}:`, error);
    } finally {
      // Cleanup temp directory
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (cleanupError) {
        console.error(`[ScanWorker] Cleanup error:`, cleanupError);
      }
    }
  }
}
