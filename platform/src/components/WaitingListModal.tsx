'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Rocket } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export default function WaitingListModal({ isOpen, onClose, planName }: Props) {
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/waiting-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: planName, notes }),
      });

      if (!res.ok) throw new Error('Failed to join waiting list');
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-card rounded-3xl p-8 border-cyan-500/30 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  You're on the list!
                </h3>
                <p className="text-slate-400 mb-8">
                  We'll contact you at{' '}
                  <span className="text-cyan-400 font-medium">{email}</span> as
                  soon as {planName} is available.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Join {planName} Waitlist
                </h3>
                <p className="text-slate-400 mb-8">
                  Be the first to access our premium {planName.toLowerCase()}{' '}
                  features.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Any specific requirements?
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Number of repositories, team size..."
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      'Join Waiting List'
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm text-center">
                      Failed to join. Please try again.
                    </p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
