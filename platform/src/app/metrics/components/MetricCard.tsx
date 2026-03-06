'use client';

import { motion, AnimatePresence } from 'framer-motion';
import CodeBlock from '@/components/CodeBlock';

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
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-slate-900/30">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Technical Methodology (The &quot;How&quot;)
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{metric.how}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Scoring Thresholds
                  </h3>
                  <div className="space-y-3">
                    {metric.thresholds.map((t: any) => (
                      <div
                        key={t.score}
                        className="flex items-center gap-4 bg-slate-800/30 p-3 rounded-xl border border-slate-700/30"
                      >
                        <div className="text-lg font-black text-cyan-400 w-16">
                          {t.score}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">
                            {t.label}
                          </div>
                          <div className="text-xs text-slate-500">
                            {t.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Refactoring Playbook
                  </h3>
                  <ul className="space-y-2">
                    {metric.playbook.map((step: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <span className="text-cyan-500 mt-1 font-bold">
                          {i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">
                    Before (The Debt)
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-red-500/20 bg-red-950/10">
                    <CodeBlock lang="typescript">
                      {metric.examples.bad}
                    </CodeBlock>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                    After (AI-Ready)
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-emerald-950/10">
                    <CodeBlock lang="typescript">
                      {metric.examples.good}
                    </CodeBlock>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
