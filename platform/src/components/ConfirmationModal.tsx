'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: Props) {
  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
      iconBg: 'bg-red-500/20',
      button: 'bg-red-500 hover:bg-red-400',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
      iconBg: 'bg-amber-500/20',
      button: 'bg-amber-500 hover:bg-amber-400',
    },
    info: {
      icon: <AlertTriangle className="w-6 h-6 text-cyan-400" />,
      iconBg: 'bg-cyan-500/20',
      button: 'bg-cyan-500 hover:bg-cyan-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative w-full max-w-md glass-card rounded-3xl p-8 border-slate-700/50 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 ${style.iconBg} rounded-full flex items-center justify-center mb-6`}
              >
                {style.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

              <p className="text-slate-400 mb-8">{message}</p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 py-3 ${style.button} text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
