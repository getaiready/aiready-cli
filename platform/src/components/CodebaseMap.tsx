'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Visualizer from '@/components/Visualizer';
import { GraphBuilder, GraphData, IssueSeverity } from '@/lib/graph-builder';
import { toast } from 'sonner';
import type { Repository } from '@/lib/db';
import { RobotIcon } from './Icons';

interface Props {
  repos: Repository[];
  initialRepoId?: string;
}

export default function CodebaseMap({ repos, initialRepoId }: Props) {
  const [selectedRepoId, setSelectedRepoId] = useState<string>(
    initialRepoId || repos[0]?.id || ''
  );
  const [fullData, setFullData] = useState<GraphData | null>(null);
  const [filteredData, setFilteredData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);

  // Default: only critical and major
  const [filters, setFilters] = useState<
    Record<IssueSeverity | 'healthy', boolean>
  >({
    critical: true,
    major: true,
    minor: true,
    info: true,
    healthy: true,
  });

  useEffect(() => {
    if (selectedRepoId) {
      fetchData(selectedRepoId);
    }
  }, [selectedRepoId]);

  useEffect(() => {
    if (fullData) {
      applyFilters();
    }
  }, [fullData, filters]);

  async function fetchData(repoId: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/repos/${repoId}/analysis/latest`);
      const result = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setFullData(null);
        } else {
          toast.error(result.error || 'Failed to fetch visualization data');
        }
        return;
      }

      const graphData = GraphBuilder.buildFromReport(result.analysis);
      setFullData(graphData);
    } catch (err) {
      console.error('Error fetching visualization data:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    if (!fullData) return;

    // Filter nodes based on severity
    const visibleNodes = fullData.nodes.filter((node) => {
      // Structural nodes (folders) are always visible if they have visible children
      // But for now, let's just use the severity field we added
      const sev = (node.severity as IssueSeverity | 'healthy') || 'healthy';
      return filters[sev];
    });

    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));

    // Also include structural nodes (folders) if any of their children are visible
    // A node is a folder if it has structural outgoing edges
    const folderIds = new Set<string>();
    fullData.edges.forEach((edge) => {
      if (edge.type === 'structural' && visibleNodeIds.has(edge.target)) {
        folderIds.add(edge.source);
      }
    });

    const allVisibleNodes = fullData.nodes.filter(
      (node) => visibleNodeIds.has(node.id) || folderIds.has(node.id)
    );
    const allVisibleNodeIds = new Set(allVisibleNodes.map((n) => n.id));

    // Filter edges: only show if both ends are visible
    const visibleEdges = fullData.edges.filter(
      (edge) =>
        allVisibleNodeIds.has(edge.source) && allVisibleNodeIds.has(edge.target)
    );

    setFilteredData({
      nodes: allVisibleNodes,
      edges: visibleEdges,
      metadata: fullData.metadata,
    });
  }

  const toggleFilter = (sev: IssueSeverity | 'healthy') => {
    setFilters((prev) => ({ ...prev, [sev]: !prev[sev] }));
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <RobotIcon className="w-8 h-8 text-cyan-400" />
            Codebase Map
          </h1>
          <p className="text-slate-400 mt-1">
            Interactive relationship map based on AI-readiness analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Repo:
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

      <div className="flex-1 relative min-h-[600px] bg-slate-900/20 rounded-3xl border border-slate-800 overflow-hidden flex flex-col">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a0f]/50 backdrop-blur-sm z-50">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
              Mapping Codebase...
            </p>
          </div>
        ) : filteredData ? (
          <>
            {/* Overlay Info */}
            <div className="absolute top-6 right-6 z-20 flex flex-col gap-4 pointer-events-none">
              <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md pointer-events-auto">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                  Map View
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-lg font-black text-white">
                      {filteredData.nodes.length}
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">
                      Nodes
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-cyan-400">
                      {filteredData.edges.length}
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">
                      Links
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Visualizer
              data={filteredData}
              filters={filters}
              onToggleFilter={toggleFilter}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-800/50 flex items-center justify-center text-4xl grayscale opacity-50">
              🗺️
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                No visualization data
              </h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                Run an analysis for{' '}
                <strong>
                  {repos.find((r) => r.id === selectedRepoId)?.name}
                </strong>{' '}
                to generate its map.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
