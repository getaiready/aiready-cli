'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PlatformShell from '@/components/PlatformShell';
import { AlertCircleIcon } from '@/components/Icons';
import type { Repository, Team, TeamMember } from '@/lib/db';
import type { AnalysisData } from '@/lib/storage';
import { RepoHeader } from './components/RepoHeader';
import { RepoDimensions } from './components/RepoDimensions';
import { IssueFeed } from './components/IssueFeed';
import { MethodologyPanel } from '@/components/MethodologyPanel';
import { metrics } from '@/app/metrics/constants';

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
  }, [repo.id]);

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
              path: issue.location.file,
              line: issue.location.line,
            });
          }

          if (issue.file && !issue.location?.file) {
            locations.push({ path: issue.file, line: issue.line });
          }
          if (issue.file1)
            locations.push({ path: issue.file1, line: issue.line1 });
          if (issue.file2)
            locations.push({ path: issue.file2, line: issue.line2 });
          if (issue.fileName && locations.length === 0) {
            locations.push({ path: issue.fileName });
          }

          if (Array.isArray(issue.affectedPaths)) {
            issue.affectedPaths.forEach((p: string) => {
              if (p && typeof p === 'string') locations.push({ path: p });
            });
          }

          // Normalize message
          let msg = issue.message || issue.description || issue.title || '';

          // Normalize recommendation/action
          let act =
            issue.suggestion ||
            issue.action ||
            (Array.isArray(issue.recommendations)
              ? issue.recommendations[0]
              : issue.recommendation);

          if (!msg) {
            if (typeof issue === 'string') msg = issue;
            else if (act && typeof act === 'string') {
              msg = act;
              act = undefined;
            } else {
              msg = 'Issue detected';
            }
          }

          if (toolName === 'semanticDuplicates' && issue.similarity) {
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

  const toolLabels: Record<string, string> = {
    semanticDuplicates: 'Semantic Duplicates',
    contextFragmentation: 'Context Budget',
    namingConsistency: 'Naming & Patterns',
    aiSignalClarity: 'AI Signal Clarity',
    agentGrounding: 'Agent Grounding',
    testabilityIndex: 'Testability Index',
    documentationHealth: 'Documentation Drift',
    dependencyHealth: 'Dependency Health',
    changeAmplification: 'Change Amplification',
    cognitiveLoad: 'Cognitive Load',
    patternEntropy: 'Pattern Entropy',
    conceptCohesion: 'Concept Cohesion',
    docDrift: 'Documentation Drift',
    semanticDistance: 'Semantic Distance',
  };

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

  const selectedMetric = metrics.find((m) => {
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
        <RepoHeader repo={repo} analysis={analysis} />

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
                <div className="glass-card rounded-3xl p-8 border border-cyan-500/20 bg-cyan-500/5 shadow-2xl shadow-cyan-500/5">
                  <div className="flex items-center gap-4 mb-6">
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
                  <MethodologyPanel metric={selectedMetric} />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <RepoDimensions
                  analysis={analysis}
                  selectedTool={selectedTool}
                  onSelectTool={setSelectedTool}
                  toolLabels={toolLabels}
                  totalIssues={allIssues.length}
                />

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
                    setFilter((f) => ({ ...f, severity: sev || undefined }))
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
          )
        )}
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
