'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Visualizer from '@/components/Visualizer';
import { GraphBuilder, GraphData } from '@/lib/graph-builder';
import { toast } from 'sonner';

interface Props {
  params: Promise<{ id: string }>;
}

export default function VisualizePage({ params: paramsPromise }: Props) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [data, setData] = useState<GraphData | null>(null);
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/repos/${params.id}/analysis/latest`);
        const result = await res.json();

        if (!res.ok) {
          toast.error(result.error || 'Failed to fetch visualization data');
          if (res.status === 404) {
            router.push(`/dashboard/repo/${params.id}`);
          }
          return;
        }

        setRepo(result.repo);

        // Transform report to graph data
        const graphData = GraphBuilder.buildFromReport(result.analysis);
        setData(graphData);
      } catch (_err) {
        console.error('Error fetching visualization data:', _err);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id, router]);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-hidden text-white">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/dashboard/repo/${params.id}`)}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white border border-transparent hover:border-white/10"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {repo?.name || 'Repository'}{' '}
              <span className="text-slate-500 font-medium ml-2">
                Visualizer
              </span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 ml-12">
            Interactive relationship map based on AI-readiness analysis.
          </p>
        </div>

        {data?.metadata && (
          <div className="flex items-center gap-6 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-center">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                Files
              </div>
              <div className="text-lg font-black text-white">
                {data.metadata.totalFiles}
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                Issues
              </div>
              <div className="text-lg font-black text-red-400">
                {data.metadata.criticalIssues + data.metadata.majorIssues}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visualizer Container */}
      <div className="flex-1 relative min-h-[500px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a0f]/50 backdrop-blur-sm z-50 rounded-3xl border border-white/5">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
              Mapping Architecture...
            </p>
          </div>
        ) : data ? (
          <Visualizer data={data} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-slate-500 italic">
              No data available for visualization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
