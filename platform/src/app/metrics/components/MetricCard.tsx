'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MethodologyPanel } from '@/components/MethodologyPanel';

interface MetricCardProps {
  metric: any;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export function MetricCard({
  metric,
  isExpanded,
  onToggle,
  index,
}: MetricCardProps) {
  return (
    <motion.section
      key={metric.id}
      id={metric.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="glass-card rounded-3xl overflow-hidden scroll-mt-24 border-l-4 border-l-cyan-500/30"
    >
      <div
        className="p-8 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-shrink-0">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 shadow-inner">
              {metric.icon}
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{metric.name}</h2>
              <span className="text-cyan-500 text-sm font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                {isExpanded ? 'Hide Details' : 'Deep Dive'}
              </span>
            </div>
            <p className="text-lg text-slate-400 mt-2">{metric.description}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-800/50 overflow-hidden"
          >
            <div className="p-8 bg-slate-900/30">
              <MethodologyPanel metric={metric} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
