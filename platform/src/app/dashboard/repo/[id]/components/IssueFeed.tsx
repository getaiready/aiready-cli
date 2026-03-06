'use client';

import { motion } from 'framer-motion';
import { ShieldIcon } from '@/components/Icons';
import { IssueItem } from './IssueItem';

interface IssueFeedProps {
  issues: any[];
  allIssues: any[];
  expandedIssues: Set<number>;
  onToggleIssue: (index: number) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  filter: { severity?: string };
  onFilterChange: (severity: string) => void;
  toolLabels: Record<string, string>;
  severityColors: Record<string, string>;
  currentPage: number;
  onLoadMore: () => void;
  hasMore: boolean;
  itemsPerPage: number;
}

export function IssueFeed({
  issues,
  allIssues,
  expandedIssues,
  onToggleIssue,
  onExpandAll,
  onCollapseAll,
  filter,
  onFilterChange,
  toolLabels,
  severityColors,
  currentPage,
  onLoadMore,
  hasMore,
  itemsPerPage,
}: IssueFeedProps) {
  return (
    <div className="lg:col-span-3 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">
          Identified Issues
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={
              expandedIssues.size === issues.length
                ? onCollapseAll
                : onExpandAll
            }
            className="text-[10px] font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors"
          >
            {expandedIssues.size === issues.length
              ? 'Collapse All'
              : 'Expand All'}
          </button>
          <select
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer pr-8"
            value={filter.severity || ''}
            onChange={(e) => onFilterChange(e.target.value)}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1rem',
            }}
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {issues.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border border-emerald-500/10">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 mb-4">
              <ShieldIcon className="w-8 h-8 text-emerald-500" />
            </div>
            <h4 className="text-lg font-bold text-white">All Clear!</h4>
            <p className="text-slate-500 text-sm">
              No issues found for the current selection.
            </p>
          </div>
        ) : (
          <>
            {issues.map((issue, i) => {
              const idx = allIssues.indexOf(issue);
              return (
                <IssueItem
                  key={idx}
                  issue={issue}
                  isExpanded={expandedIssues.has(idx)}
                  onToggle={() => onToggleIssue(idx)}
                  severityColors={severityColors}
                  toolLabels={toolLabels}
                />
              );
            })}

            {hasMore && (
              <div className="pt-4 text-center">
                <button
                  onClick={onLoadMore}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-all shadow-lg"
                >
                  Load More Issues
                  <span className="ml-2 opacity-50 font-mono">
                    ({allIssues.length - issues.length} remaining)
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
