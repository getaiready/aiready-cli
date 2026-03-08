import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getIndustryBenchmarks } from '@/lib/db/benchmarks';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const benchmarks = await getIndustryBenchmarks(id);

    if (!benchmarks) {
      return NextResponse.json(
        { error: 'Benchmark data unavailable' },
        { status: 404 }
      );
    }

    return NextResponse.json({ benchmarks });
  } catch (error) {
    console.error('[BenchmarksAPI] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
