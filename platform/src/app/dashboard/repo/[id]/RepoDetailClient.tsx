'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PlatformShell from '@/components/PlatformShell';
import {
  AlertCircleIcon,
  InfoIcon,
  SettingsIcon,
  FileIcon,
} from '@/components/Icons';
import type { Repository, Team, TeamMember } from '@/lib/db';
import type { AnalysisData } from '@/lib/storage';
import { ToolName, FRIENDLY_TOOL_NAMES } from '@aiready/core/client';
import { RepoHeader } from './components/RepoHeader';
import { RepoDimensions } from './components/RepoDimensions';
import { IssueFeed } from './components/IssueFeed';
import { BusinessImpact } from './components/BusinessImpact';
import { RemediationQueue } from './components/RemediationQueue';
import { MethodologyPanel } from '@/components/MethodologyPanel';
import CodeBlock from '@/components/CodeBlock';
import { TrendCharts } from './components/TrendCharts';
import { BenchmarkCard } from './components/BenchmarkCard';
import { metrics as metricDefinitions } from '@/app/metrics/constants';
import { toast } from 'sonner';
import { Icon } from '@/components/Icon';
import { auth } from '@/lib/auth';

interface Props {
  repo: Repository;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  teams: (TeamMember & { team: Team })[];
  overallScore: number | null;
}

function RepoDetailContent({ repo, user, teams, overallScore }: Props) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(
    initialCategory
  );
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    severity?: string;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [historicalMetrics, setHistoricalMetrics] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'issues' | 'insights' | 'remediation'
  >('insights');
  const ITEMS_PER_PAGE = 25;

  const toggleIssue = (index: number) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIssues(newExpanded);
  };

  useEffect(() => {
    fetchLatestAnalysis();
    fetchHistoricalMetrics();
  }, [repo.id]);

  async function fetchHistoricalMetrics() {
    try {
      const [metricsRes, benchmarksRes] = await Promise.all([
        fetch(`/api/repos/${repo.id}/metrics?limit=100`),
        fetch(`/api/repos/${repo.id}/benchmarks`),
      ]);

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setHistoricalMetrics(data.metrics || []);
      }

      if (benchmarksRes.ok) {
        const data = await benchmarksRes.json();
        setBenchmarks(data.benchmarks);
      }
    } catch (err) {
      console.error('Error fetching historical metrics:', err);
    }
  }

  async function fetchLatestAnalysis() {
    try {
      setLoading(true);
      const res = await fetch(`/api/repos/${repo.id}/analysis/latest`);
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Failed to fetch analysis results');
      }
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  // Flatten issues from breakdown for easy filtering/display
  const allIssues: any[] = [];
  if (analysis?.breakdown) {
    // Determine the likely project root to relativize paths
    // Look for /tmp/repo-uuid/ or the repo name
    const repoName = repo.name.split('/').pop() || repo.name;
    const pathPrefixRegex = new RegExp(
      `(?:.*\\/repo-[a-f0-9-]+\\/|.*\\/${repoName}\\/)`,
      'g'
    );

    const cleanPath = (p: string) => {
      if (!p) return p;
      return p.replace(pathPrefixRegex, '');
    };

    const cleanPathInText = (text: string) => {
      if (!text) return text;
      return text.replace(pathPrefixRegex, '');
    };

    Object.entries(analysis.breakdown).forEach(
      ([toolName, toolData]: [string, any]) => {
        if (!toolData || !toolData.details || !Array.isArray(toolData.details))
          return;

        toolData.details.forEach((issue: any) => {
          if (!issue) return;

          // Normalize locations (files/lines)
          const locations: Array<{ path: string; line?: number }> = [];

          if (issue.location?.file) {
            locations.push({
              path: cleanPath(issue.location.file),
              line: issue.location.line,
            });
          }

          if (issue.file && !issue.location?.file) {
            locations.push({ path: cleanPath(issue.file), line: issue.line });
          }
          if (issue.file1)
            locations.push({ path: cleanPath(issue.file1), line: issue.line1 });
          if (issue.file2)
            locations.push({ path: cleanPath(issue.file2), line: issue.line2 });
          if (issue.fileName && locations.length === 0) {
            locations.push({ path: cleanPath(issue.fileName) });
          }

          if (Array.isArray(issue.affectedPaths)) {
            issue.affectedPaths.forEach((p: string) => {
              if (p && typeof p === 'string')
                locations.push({ path: cleanPath(p) });
            });
          }

          // Normalize message
          let msg = issue.message || issue.description || issue.title || '';
          msg = cleanPathInText(msg);

          // Normalize recommendation/action
          let act =
            issue.suggestion ||
            issue.action ||
            (Array.isArray(issue.recommendations)
              ? issue.recommendations[0]
              : issue.recommendation);

          if (act && typeof act === 'string') {
            act = cleanPathInText(act);
          }

          if (!msg) {
            if (typeof issue === 'string') msg = issue;
            else if (act && typeof act === 'string') {
              msg = act;
              act = undefined;
            } else {
              msg = 'Issue detected';
            }
          }

          if (toolName === ToolName.PatternDetect && issue.similarity) {
            msg = `${issue.patternType ? issue.patternType.charAt(0).toUpperCase() + issue.patternType.slice(1) : 'Duplicate'} (${Math.round(issue.similarity * 100)}% similarity)`;
          }

          allIssues.push({
            ...issue,
            tool: toolName,
            locations,
            message: msg,
            action: act,
            severity:
              issue.severity ||
              (issue.priority === 'high' ? 'critical' : 'major'),
            type: issue.type || issue.category || 'logic',
          });
        });
      }
    );
  }

  const toolLabels = FRIENDLY_TOOL_NAMES;

  const filteredIssues = allIssues.filter((issue) => {
    if (filter.severity && issue.severity !== filter.severity) return false;
    if (selectedTool && issue.tool !== selectedTool) return false;
    return true;
  });

  const paginatedIssues = filteredIssues.slice(0, currentPage * ITEMS_PER_PAGE);
  const hasMore = currentPage * ITEMS_PER_PAGE < filteredIssues.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTool, filter.severity]);

  const severityColors: any = {
    critical: 'text-red-400 border-red-500/30 bg-red-500/10',
    major: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    minor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    info: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
  };

  const selectedMetric = metricDefinitions.find((m) => {
    // Map camelCase tool names to kebab-case metric IDs
    const mappedId = selectedTool
      ?.replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
    return m.id === mappedId;
  });

  return (
    <PlatformShell
      user={user}
      teams={teams}
      overallScore={overallScore}
      activePage="repo"
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 text-white">
        <RepoHeader
          repo={repo}
          analysis={analysis}
          onViewConfig={() => setShowConfig(true)}
        />

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">
              Analyzing Results...
            </p>
          </div>
        ) : error ? (
          <div className="glass-card rounded-3xl p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <AlertCircleIcon className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-bold">Analysis Unavailable</h2>
            <p className="text-slate-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors border border-slate-700 font-bold text-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          analysis && (
            <div className="space-y-8">
              {/* Methodology Panel for selected tool */}
              {selectedMetric && (
                <div className="glass-card rounded-3xl overflow-hidden border border-cyan-500/20 bg-cyan-500/5 shadow-2xl shadow-cyan-500/5">
                  <div
                    className="p-8 flex items-center justify-between cursor-pointer hover:bg-cyan-500/10 transition-colors"
                    onClick={() => setShowMethodology(!showMethodology)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
                        {selectedMetric.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {selectedMetric.name} Methodology
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {selectedMetric.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-500 text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                        {showMethodology ? 'Hide Details' : 'Deep Dive'}
                      </span>
                      <motion.div
                        animate={{ rotate: showMethodology ? 180 : 0 }}
                        className="text-cyan-500"
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
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {showMethodology && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-cyan-500/10"
                      >
                        <div className="p-8">
                          <MethodologyPanel metric={selectedMetric} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Tabs Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-900/50 border border-slate-800 rounded-2xl w-fit">
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'insights'
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Insights
                </button>
                <button
                  onClick={() => setActiveTab('remediation')}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'remediation'
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Remediation
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'insights' ? (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <BusinessImpact
                      businessImpact={analysis.summary.businessImpact}
                      aiScore={analysis.summary.aiReadinessScore}
                    />

                    {benchmarks && <BenchmarkCard data={benchmarks} />}

                    {historicalMetrics.length > 1 && (
                      <TrendCharts metrics={historicalMetrics} />
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-3">
                        <RepoDimensions
                          analysis={analysis}
                          selectedTool={selectedTool}
                          onSelectTool={setSelectedTool}
                          toolLabels={toolLabels}
                          totalIssues={allIssues.length}
                        />
                      </div>

                      <div className="lg:col-span-9">
                        <IssueFeed
                          issues={paginatedIssues}
                          allIssues={filteredIssues}
                          expandedIssues={expandedIssues}
                          onToggleIssue={toggleIssue}
                          onExpandAll={() =>
                            setExpandedIssues(new Set(allIssues.keys()))
                          }
                          onCollapseAll={() => setExpandedIssues(new Set())}
                          filter={filter}
                          onFilterChange={(sev) =>
                            setFilter((f) => ({
                              ...f,
                              severity: sev || undefined,
                            }))
                          }
                          toolLabels={toolLabels}
                          severityColors={severityColors}
                          currentPage={currentPage}
                          onLoadMore={() => setCurrentPage((p) => p + 1)}
                          hasMore={hasMore}
                          itemsPerPage={ITEMS_PER_PAGE}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="remediation"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8">
                        <RemediationQueue
                          repoId={repo.id}
                          hasIssues={allIssues.length > 0}
                        />
                      </div>
                      <div className="lg:col-span-4">
                        <div className="glass-card rounded-3xl p-8 border border-slate-800 bg-slate-900/30">
                          <h4 className="text-lg font-bold mb-4">
                            Action Center
                          </h4>
                          <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            This workspace allows you to apply agentic
                            remediations directly to your repository. High-ROI
                            fixes are prioritized to optimize context window
                            efficiency immediately.
                          </p>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                Active Agent
                              </span>
                              <span className="text-cyan-400 font-black">
                                Remediation-V1
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        )}

        <AnimatePresence>
          {showConfig && analysis && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfig(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                      <SettingsIcon className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Scan Configuration</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-black mt-0.5">
                        Used for scan on{' '}
                        {new Date(analysis.metadata.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConfig(false)}
                    className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                      This configuration was active at the time of the scan. You
                      can adjust future scan parameters in the
                      <Link
                        href={`/dashboard/repo/${repo.id}/settings`}
                        className="text-cyan-400 hover:underline mx-1"
                      >
                        Repo Settings
                      </Link>
                      page to uplift standards or reduce noise.
                    </p>
                    <div className="rounded-2xl overflow-hidden border border-slate-800">
                      <CodeBlock lang="json">
                        {JSON.stringify(
                          analysis.summary.config ||
                            analysis.metadata.config ||
                            (analysis.rawOutput as any)?.summary?.config ||
                            (analysis.rawOutput as any)?.config ||
                            {},
                          null,
                          2
                        )}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setShowConfig(false)}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-bold text-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PlatformShell>
  );
}

export default function RepoDetailClient(props: Props) {
  return (
    <Suspense
      fallback={
        <PlatformShell
          user={props.user}
          teams={props.teams}
          overallScore={props.overallScore}
          activePage="repo"
        >
          <div className="p-4 sm:p-6 lg:p-8 space-y-8 text-white">
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          </div>
        </PlatformShell>
      }
    >
      <RepoDetailContent {...props} />
    </Suspense>
  );
}
