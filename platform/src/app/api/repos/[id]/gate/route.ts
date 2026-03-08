import { NextRequest, NextResponse } from 'next/server';
import { getRepository, getLatestAnalysis } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = req.nextUrl.searchParams;
    const threshold = parseInt(searchParams.get('threshold') || '70');
    const failOn = searchParams.get('failOn') || 'critical';

    const repo = await getRepository(id);
    if (!repo) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      );
    }

    const latestAnalysis = await getLatestAnalysis(id);
    if (!latestAnalysis) {
      return NextResponse.json({
        pass: false,
        reason: 'No analysis found for this repository',
      });
    }

    const score = latestAnalysis.aiScore || 0;
    const criticalCount = (latestAnalysis as any).metrics?.criticalIssues || 0;

    let pass = true;
    let reason = 'AI-Readiness check passed';

    if (score < threshold) {
      pass = false;
      reason = `AI Score ${score} is below threshold ${threshold}`;
    } else if (failOn === 'critical' && criticalCount > 0) {
      pass = false;
      reason = `Found ${criticalCount} critical issues`;
    }

    return NextResponse.json({
      pass,
      score,
      threshold,
      criticalIssues: criticalCount,
      reason,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[GateAPI] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
