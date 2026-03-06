'use client';

import { motion } from 'framer-motion';
import { PlayIcon, TerminalIcon, UploadIcon } from '@/components/Icons';

interface CliQuickstartProps {
  onScanAll?: () => void;
  isScanning?: boolean;
}

export function CliQuickstart({ onScanAll, isScanning }: CliQuickstartProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-8 border-indigo-500/20 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-500" />

      <div className="relative z-10">
        <h3 className="font-bold text-2xl text-white mb-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <PlayIcon className="w-5 h-5 text-indigo-400" />
          </div>
          Run your first analysis
        </h3>

        <p className="text-slate-400 text-base mb-8 max-w-2xl leading-relaxed">
          Get your AI-readiness score in seconds. You can trigger a remote scan
          directly or manually upload a local report.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Option 1: Remote Scan */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-white font-bold text-sm uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">
                1
              </span>
              The Easy Way
            </div>
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 flex-1 flex flex-col items-center justify-center text-center group/btn hover:border-indigo-500/30 transition-all duration-300">
              <p className="text-slate-400 text-sm mb-6">
                Trigger a remote scan for all your repositories with a single
                click.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onScanAll}
                disabled={isScanning}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-xl transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 border border-indigo-400/30"
              >
                <PlayIcon className="w-5 h-5" />
                {isScanning
                  ? 'Scanning Repositories...'
                  : 'Scan All Repositories Now'}
              </motion.button>
            </div>
          </div>

          {/* Option 2: CLI/Manual */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-white font-bold text-sm uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">
                2
              </span>
              Manual / CLI
            </div>
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 flex-1">
              <p className="text-slate-400 text-sm mb-4">
                Run the analysis locally and upload the generated{' '}
                <span className="text-cyan-400 font-mono">report.json</span>.
              </p>
              <div className="font-mono text-[13px] bg-black/40 rounded-xl p-4 border border-slate-700/50 mb-4 group/code">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-cyan-400">
                    npx @aiready/cli scan . --output json
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] mt-2 flex items-start gap-2">
                  <UploadIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>
                    Then upload the report via the button on your repository
                    card above.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
