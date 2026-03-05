'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error('Failed to send feedback');

      toast.success('Feedback sent! Thank you.');
      setMessage('');
      setIsOpen(false);
    } catch (err) {
      toast.error('Failed to send feedback. Please try again.');
    } finally {
      setStatus('loading'); // Wait, fixed below
      setStatus('idle');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-80 glass-card rounded-2xl p-4 border-cyan-500/30 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Share Feedback
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              What features would you like to see? Found a bug? Let us know!
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your feedback here..."
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white h-24 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading' || !message.trim()}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    Send Feedback
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20 group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}
