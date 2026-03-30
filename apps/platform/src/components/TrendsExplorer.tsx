'use client';

import { useState, useEffect } from 'react';
import type { Repository, Analysis } from '@/lib/db';
import { TrendingUpIcon } from './Icons';
import { TrendChart } from './trends/TrendChart';
import { InsightCard } from './trends/InsightCard';
import { RecentScans } from './trends/RecentScans';
import { fetchRepoHistory } from '@/lib/api/history';

interface Props {
  repos: Repository[];
}

export default function TrendsExplorer({ repos }: Props) {
  const [selectedRepoId, setSelectedRepoId] = useState<string>(
    repos[0]?.id || ''
  );
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedRepoId) {
      fetchHistory(selectedRepoId);
    }
  }, [selectedRepoId]);

  async function fetchHistory(repoId: string) {
    try {
      setLoading(true);
      const data = await fetchRepoHistory(repoId, 30);
      setHistory(data);
    } catch (_err) {
      console.error('Failed to fetch history:', _err);
    } finally {
      setLoading(false);
    }
  }

  const selectedRepo = repos.find((r) => r.id === selectedRepoId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUpIcon className="w-8 h-8 text-cyan-400" />
            Trends Explorer
          </h1>
          <p className="text-slate-400 mt-1">
            Track your AI-Readiness progress over time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Repository:
          </label>
          <select
            value={selectedRepoId}
            onChange={(e) => setSelectedRepoId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            {repos.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-slate-900/20 rounded-3xl border border-slate-800">
          <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
            Loading History...
          </p>
        </div>
      ) : history.length < 2 ? (
        <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/20 rounded-3xl border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 text-3xl">
            📉
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Not enough data</h3>
          <p className="text-slate-400 max-w-sm">
            We need at least two analysis runs for{' '}
            <strong>{selectedRepo?.name}</strong> to show trend insights.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <TrendingUpIcon className="w-48 h-48" />
              </div>

              <TrendChart history={history} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InsightCard
                title="Total Progress"
                value={`${history[history.length - 1].aiScore! - history[0].aiScore!} pts`}
                description="Change since first scan"
                trend={
                  history[history.length - 1].aiScore! >= history[0].aiScore!
                    ? 'up'
                    : 'down'
                }
              />
              <InsightCard
                title="Latest Jump"
                value={`${history[history.length - 1].aiScore! - (history[history.length - 2]?.aiScore || 0)} pts`}
                description="Change from previous scan"
                trend={
                  history[history.length - 1].aiScore! >=
                  (history[history.length - 2]?.aiScore || 0)
                    ? 'up'
                    : 'down'
                }
              />
            </div>
          </div>

          <RecentScans history={history} />
        </div>
      )}
    </div>
  );
}
