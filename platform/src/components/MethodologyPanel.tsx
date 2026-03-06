'use client';

import { motion } from 'framer-motion';
import CodeBlock from '@/components/CodeBlock';

interface MethodologyPanelProps {
  metric: any;
}

export function MethodologyPanel({ metric }: MethodologyPanelProps) {
  if (!metric) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                    <div className="text-xs text-slate-500">{t.detail}</div>
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
                  <span className="text-cyan-500 mt-1 font-bold">{i + 1}.</span>
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
              <CodeBlock lang="typescript">{metric.examples.bad}</CodeBlock>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
              After (AI-Ready)
            </h3>
            <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-emerald-950/10">
              <CodeBlock lang="typescript">{metric.examples.good}</CodeBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
