'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface NewKeyModalProps {
  apiKey: string | null;
  onClose: () => void;
}

export function NewKeyModal({ apiKey, onClose }: NewKeyModalProps) {
  return (
    <AnimatePresence>
      {apiKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[60] p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="glass-card rounded-3xl p-10 max-w-lg w-full border border-cyan-500/30 shadow-[0_0_100px_-20px_rgba(6,182,212,0.3)]"
          >
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 mx-auto border border-cyan-500/20">
              <svg
                className="w-8 h-8 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-white text-center mb-2">
              Key Generated Successfully
            </h3>
            <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">
              Copy this key now. It provides full access to your account via the
              CLI and{' '}
              <span className="text-white font-medium">
                cannot be shown again
              </span>{' '}
              for security reasons.
            </p>

            <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center gap-4 mb-8">
              <code className="text-cyan-300 font-mono text-xl tracking-tight break-all text-center">
                {apiKey}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  toast.success('Copied to clipboard!');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-lg border border-cyan-500/20 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy Secret Key
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-white text-[#0a0a0f] font-black rounded-2xl shadow-xl hover:bg-slate-100 transition-all text-sm uppercase tracking-widest"
            >
              I've backed up this key
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
