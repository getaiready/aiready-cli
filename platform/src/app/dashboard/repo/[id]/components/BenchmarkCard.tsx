'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';

interface BenchmarkData {
  percentile: number;
  averageScore: number;
  totalRepos: number;
  rank: string;
}

interface BenchmarkCardProps {
  data: BenchmarkData;
}

export function BenchmarkCard({ data }: BenchmarkCardProps) {
  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 bg-slate-900/50 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Icon name="GlobeIcon" className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Industry Benchmark</h3>
        </div>
        <span
          className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
            data.rank === 'Elite'
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {data.rank} Rank
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-4 space-y-2">
        <div className="relative w-full h-24 flex items-end justify-center gap-1">
          {/* Simulated Bell Curve */}
          {[...Array(20)].map((_, i) => {
            const isActive = i === Math.floor((100 - data.percentile) / 5);
            const height = Math.exp(-Math.pow(i - 10, 2) / 30) * 80;
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                className={`w-2 rounded-t-full transition-colors ${
                  isActive
                    ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'bg-slate-700'
                }`}
              />
            );
          })}

          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
            <span>Low Ready</span>
            <span>Platform Average ({data.averageScore})</span>
            <span>Elite</span>
          </div>
        </div>
      </div>

      <div className="pt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
          <p className="text-[10px] font-black text-slate-500 uppercase">
            Percentile
          </p>
          <p className="text-2xl font-black text-white">
            Top {data.percentile}%
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
          <p className="text-[10px] font-black text-slate-500 uppercase">
            Cohort Size
          </p>
          <p className="text-2xl font-black text-white">
            {data.totalRepos} Repos
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center italic">
        "Your repository is performing better than {100 - data.percentile}% of
        monitored projects."
      </p>
    </div>
  );
}
