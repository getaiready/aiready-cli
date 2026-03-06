'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileNode, GraphData, IssueSeverity } from '@/lib/graph-builder';
import { GraphCanvas } from './visualizer/GraphCanvas';
import { LegendItem, StatItem } from './visualizer/SubComponents';

interface Props {
  data: GraphData;
  filters?: Record<IssueSeverity | 'healthy', boolean>;
  onToggleFilter?: (sev: IssueSeverity | 'healthy') => void;
}

export default function Visualizer({ data, filters, onToggleFilter }: Props) {
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-[#0a0a0f] rounded-3xl overflow-hidden border border-white/5 shadow-2xl"
    >
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(#ffffff11 1px, transparent 1px), linear-gradient(90deg, #ffffff11 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {dimensions.width > 0 && (
        <GraphCanvas
          data={data}
          width={dimensions.width}
          height={dimensions.height}
          onNodeClick={setSelectedNode}
        />
      )}

      {/* Legend */}
      <div className="absolute top-6 left-6 z-20 space-y-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 shadow-xl backdrop-blur-md">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Entity Health
          </h4>
          <div className="space-y-2">
            <LegendItem
              color="#ff4d4f"
              label="Critical"
              active={filters?.critical}
              onClick={() => onToggleFilter?.('critical')}
            />
            <LegendItem
              color="#fbbf24"
              label="Major"
              active={filters?.major}
              onClick={() => onToggleFilter?.('major')}
            />
            <LegendItem
              color="#fde047"
              label="Minor"
              active={filters?.minor}
              onClick={() => onToggleFilter?.('minor')}
            />
            <LegendItem
              color="#38bdf8"
              label="Info"
              active={filters?.info}
              onClick={() => onToggleFilter?.('info')}
            />
            <LegendItem
              color="#818cf8"
              label="Healthy"
              active={filters?.healthy}
              onClick={() => onToggleFilter?.('healthy')}
            />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 shadow-xl backdrop-blur-md">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Connection Types
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-0.5 bg-cyan-400 opacity-80" />
              <span className="text-[11px] font-bold text-slate-400">
                Dependency
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-1 bg-amber-400 opacity-90" />
              <span className="text-[11px] font-bold text-slate-400">
                Similarity
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-0.5 border-t-2 border-dashed border-blue-400 opacity-80" />
              <span className="text-[11px] font-bold text-slate-400">
                Reference
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Help */}
      <div className="absolute bottom-6 left-6 z-20">
        <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 flex items-center gap-3 shadow-lg">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]" />{' '}
            Drag to move
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]" />{' '}
            Scroll to zoom
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />{' '}
            Click for details
          </span>
        </div>
      </div>

      {/* Node Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="absolute top-6 right-6 bottom-6 w-80 z-30"
          >
            <div className="glass-card h-full rounded-3xl border border-cyan-500/20 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-bold text-white truncate pr-4">
                  {selectedNode.label}
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-500 hover:text-white transition-colors p-1"
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
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 scrollbar-thin">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Full Path
                  </label>
                  <p className="text-xs text-slate-300 font-mono break-all bg-black/30 p-3 rounded-xl border border-white/5">
                    {selectedNode.id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <StatItem
                    label="Context Budget"
                    value={
                      selectedNode.tokenCost != null
                        ? `${selectedNode.tokenCost.toLocaleString()} tokens`
                        : 'N/A'
                    }
                  />
                  <StatItem
                    label="Duplicates"
                    value={selectedNode.duplicates || 0}
                  />
                </div>

                {selectedNode.title && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Insights
                    </label>
                    <div className="space-y-2">
                      {selectedNode.title.split('\n').map((line, i) => (
                        <p
                          key={i}
                          className="text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
