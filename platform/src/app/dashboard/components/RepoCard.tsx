'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  UploadIcon,
  FileIcon,
  ShieldIcon,
  TrendingUpIcon,
  TrashIcon,
  ChartIcon,
  RobotIcon,
  AlertCircleIcon,
} from '@/components/Icons';
import { scoreColor, scoreBg } from '@aiready/components';
import type { Repository, Analysis } from '@/lib/db';

type RepoWithAnalysis = Repository & { latestAnalysis: Analysis | null };

interface RepoCardProps {
  repo: RepoWithAnalysis;
  index: number;
  uploading: boolean;
  scanning: boolean;
  onUpload: () => void;
  onScan: () => void;
  onDelete: () => void;
  onBadge: () => void;
}

export function RepoCard({
  repo,
  index,
  uploading,
  scanning: localScanning,
  onUpload,
  onScan,
  onDelete,
  onBadge,
}: RepoCardProps) {
  const score = repo.aiScore;
  const analysis = repo.latestAnalysis;
  const isScanning = localScanning || repo.isScanning;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`glass-card rounded-2xl p-5 flex flex-col gap-4 card-hover ${isScanning ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''}`}
    >
      {/* Repo header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white truncate text-lg hover:text-cyan-400 transition-colors">
              <Link href={`/dashboard/repo/${repo.id}`}>{repo.name}</Link>
            </h3>
            {isScanning && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  Scanning
                </span>
              </div>
            )}
          </div>
          {repo.description && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {repo.description}
            </p>
          )}
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 truncate block transition-colors"
          >
            {repo.url}
          </a>
        </div>
        {score != null && !isScanning && (
          <div
            className={`flex-shrink-0 text-center px-4 py-2 rounded-xl border ${scoreBg(score)} shadow-lg`}
          >
            <div
              className={`text-2xl font-black leading-none ${scoreColor(score)}`}
            >
              {score}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">/ 100</div>
          </div>
        )}
      </div>

      {repo.lastError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
          <AlertCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{repo.lastError}</p>
        </div>
      )}

      {/* Breakdown grid */}
      {analysis?.breakdown && !isScanning && (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(analysis.breakdown)
            .filter(([_, val]) => {
              const score = typeof val === 'number' ? val : (val as any)?.score;
              return typeof score === 'number' && score >= 0;
            })
            .map(([key, val]) => (
              <BreakdownItem
                key={key}
                repoId={repo.id}
                toolKey={key}
                label={formatBreakdownKey(key)}
                value={typeof val === 'number' ? val : (val as any)?.score}
              />
            ))}
        </div>
      )}

      {/* Summary line */}
      {analysis?.summary && (
        <div className="flex gap-4 text-xs text-slate-400">
          <span>{analysis.summary.totalFiles} files</span>
          {analysis.summary.criticalIssues > 0 && (
            <span className="text-red-400 font-medium">
              {analysis.summary.criticalIssues} critical
            </span>
          )}
          {analysis.summary.warnings > 0 && (
            <span className="text-amber-400">
              {analysis.summary.warnings} warnings
            </span>
          )}
        </div>
      )}

      {!analysis && (
        <p className="text-xs text-slate-500 italic">
          No analysis yet — upload a report to get scored.
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-700/50">
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onScan}
            disabled={isScanning}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500/30"
          >
            <PlayIcon className="w-3.5 h-3.5" />
            {isScanning ? 'Scanning...' : 'Scan'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpload}
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-lg hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-cyan-500/30"
          >
            <UploadIcon className="w-3.5 h-3.5" />
            {uploading ? 'Uploading...' : 'Upload'}
          </motion.button>

          {analysis && (
            <>
              <Link href={`/trends?repoId=${repo.id}`} className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-500/20 transition-all border border-indigo-500/30"
                >
                  <TrendingUpIcon className="w-3.5 h-3.5" />
                  Trends
                </motion.button>
              </Link>
              <Link href={`/map?repoId=${repo.id}`} className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-full flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-lg hover:bg-cyan-500/20 transition-all border border-cyan-500/30"
                >
                  <RobotIcon className="w-3.5 h-3.5" />
                  Codebase Map
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {analysis && (
          <Link href={`/dashboard/repo/${repo.id}`} className="block">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 border border-indigo-400/30"
            >
              <ChartIcon className="w-3.5 h-3.5" />
              View Report Details
            </motion.button>
          </Link>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <IconButton
              onClick={() =>
                window.open(`/api/agent/metadata?repoId=${repo.id}`)
              }
              icon={<FileIcon className="w-4 h-4" />}
              tooltip="Download Metadata"
            />
            <IconButton
              onClick={onBadge}
              icon={<ShieldIcon className="w-4 h-4" />}
              tooltip="AI-Readiness Badge"
            />
          </div>

          <IconButton
            onClick={onDelete}
            icon={<TrashIcon className="w-4 h-4" />}
            tooltip="Delete Repository"
            variant="danger"
          />
        </div>
      </div>

      {repo.lastAnalysisAt && (
        <p className="text-xs text-slate-500 -mt-1">
          Last analyzed {new Date(repo.lastAnalysisAt).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
}

function IconButton({
  onClick,
  icon,
  tooltip,
  variant = 'default',
}: {
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
  variant?: 'default' | 'danger';
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-all border ${
          variant === 'danger'
            ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10 border-transparent hover:border-red-500/30'
            : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border-slate-700/50'
        }`}
      >
        {icon}
      </button>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 border border-slate-700 shadow-xl">
        {tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </div>
    </div>
  );
}

function BreakdownItem({
  repoId,
  toolKey,
  label,
  value,
}: {
  repoId: string;
  toolKey: string;
  label: string;
  value: number;
}) {
  return (
    <Link
      href={`/dashboard/repo/${repoId}?category=${toolKey}`}
      className="bg-slate-800/50 rounded-lg px-2 py-1.5 border border-slate-700/50 hover:bg-slate-700/50 transition-colors block"
    >
      <div className={`text-xs font-bold ${scoreColor(value)}`}>{value}</div>
      <div
        className="text-[10px] text-slate-400 leading-tight truncate mt-0.5"
        title={label}
      >
        {label}
      </div>
    </Link>
  );
}

function formatBreakdownKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
