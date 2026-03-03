'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface ScanIssue {
  id: number;
  type: 'duplicate' | 'context' | 'consistency';
  file: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
}

const issuesList: ScanIssue[] = [
  {
    id: 1,
    type: 'duplicate',
    file: 'src/utils/helpers.ts',
    severity: 'high',
    message: 'Semantic duplicate detected',
  },
  {
    id: 2,
    type: 'context',
    file: 'src/components/Auth.tsx',
    severity: 'medium',
    message: 'Context fragmentation detected',
  },
  {
    id: 3,
    type: 'consistency',
    file: 'src/api/users.ts',
    severity: 'high',
    message: 'Inconsistent naming pattern',
  },
  {
    id: 4,
    type: 'duplicate',
    file: 'src/lib/validation.ts',
    severity: 'medium',
    message: 'Similar logic found in 3 files',
  },
  {
    id: 5,
    type: 'context',
    file: 'src/services/payment.ts',
    severity: 'low',
    message: 'High context window cost',
  },
  {
    id: 6,
    type: 'consistency',
    file: 'src/models/Product.ts',
    severity: 'medium',
    message: 'Style inconsistency detected',
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return {
        border: 'border-red-500/30',
        bg: 'bg-gradient-to-r from-red-950/40 to-red-900/20',
        text: 'text-red-400',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
      };
    case 'medium':
      return {
        border: 'border-yellow-500/30',
        bg: 'bg-gradient-to-r from-yellow-950/40 to-yellow-900/20',
        text: 'text-yellow-400',
        glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',
        badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      };
    case 'low':
      return {
        border: 'border-blue-500/30',
        bg: 'bg-gradient-to-r from-blue-950/40 to-blue-900/20',
        text: 'text-blue-400',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      };
    default:
      return {
        border: 'border-slate-500/30',
        bg: 'bg-gradient-to-r from-slate-900/40 to-slate-800/20',
        text: 'text-slate-400',
        glow: 'shadow-[0_0_15px_rgba(100,116,139,0.3)]',
        badge: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
      };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'duplicate':
      return '🔄';
    case 'context':
      return '📊';
    case 'consistency':
      return '⚡';
    default:
      return '🔍';
  }
};

export default function LiveScanDemo() {
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleIssues, setVisibleIssues] = useState<ScanIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!isInView) {
      setScore(0);
      setProgress(0);
      setVisibleIssues([]);
      setIsScanning(false);
      return;
    }

    setIsScanning(true);

    const scoreInterval = setInterval(() => {
      setScore((prev) => {
        if (prev >= 67) {
          clearInterval(scoreInterval);
          return 67;
        }
        return prev + 1;
      });
    }, 30);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    issuesList.forEach((issue, index) => {
      setTimeout(
        () => {
          setVisibleIssues((prev) => [...prev, issue]);
        },
        300 + index * 200
      );
    });

    return () => {
      clearInterval(scoreInterval);
      clearInterval(progressInterval);
    };
  }, [isInView]);

  const getScoreColor = () => {
    if (score >= 80)
      return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' };
    if (score >= 60)
      return { stroke: '#eab308', glow: 'rgba(234, 179, 8, 0.3)' };
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' };
  };

  const scoreColor = getScoreColor();

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        }}
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Real-Time Scanning
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Watch AIReady analyze your codebase and surface issues that confuse
            AI models
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-50 transition-all duration-500"
                style={{ backgroundColor: scoreColor.glow }}
              />

              <svg className="w-full h-full transform -rotate-90 relative z-10">
                {Array.from({ length: 20 }).map((_, i) => {
                  const angle = (i * 360) / 20;
                  const startAngle = angle - 85;
                  const radius = 90;
                  const strokeWidth = 8;
                  const gapAngle = 4;

                  const startX =
                    50 + radius * Math.cos((startAngle * Math.PI) / 180);
                  const startY =
                    50 + radius * Math.sin((startAngle * Math.PI) / 180);
                  const endX =
                    50 +
                    radius *
                      Math.cos(
                        ((startAngle + 360 / 20 - gapAngle) * Math.PI) / 180
                      );
                  const endY =
                    50 +
                    radius *
                      Math.sin(
                        ((startAngle + 360 / 20 - gapAngle) * Math.PI) / 180
                      );

                  const isActive = (i / 20) * 100 <= progress;

                  return (
                    <motion.line
                      key={i}
                      x1={`${startX}%`}
                      y1={`${startY}%`}
                      x2={`${endX}%`}
                      y2={`${endY}%`}
                      stroke={isActive ? scoreColor.stroke : '#334155'}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      initial={{ opacity: 0.3 }}
                      animate={{
                        opacity: isActive ? 1 : 0.3,
                        filter: isActive
                          ? `drop-shadow(0 0 4px ${scoreColor.stroke})`
                          : 'none',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center"
                >
                  <motion.div
                    className="text-6xl md:text-7xl font-black mb-2"
                    style={{ color: scoreColor.stroke }}
                    animate={{
                      textShadow: `0 0 20px ${scoreColor.glow}, 0 0 40px ${scoreColor.glow}`,
                    }}
                  >
                    {score}
                  </motion.div>
                  <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">
                    AI Readiness
                  </div>
                  <div
                    className="text-xl md:text-2xl font-black tracking-tight"
                    style={{ color: scoreColor.stroke }}
                  >
                    SCORE
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700"
            >
              {isScanning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                  />
                  <span className="text-sm font-bold text-cyan-400 uppercase tracking-wide">
                    Scanning in progress
                  </span>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 bg-green-500 rounded-full"
                    style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
                  />
                  <span className="text-sm font-bold text-green-400 uppercase tracking-wide">
                    Scan complete
                  </span>
                </>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  boxShadow: [
                    '0 0 10px rgba(34, 211, 238, 0.5)',
                    '0 0 20px rgba(34, 211, 238, 0.8)',
                    '0 0 10px rgba(34, 211, 238, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                ISSUES DETECTED
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
            </div>

            <div className="relative">
              {/* Sci-fi border effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-blue-500/10 rounded-lg blur-sm" />

              <div className="relative space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-cyan-500/30 hover:scrollbar-thumb-cyan-500/50">
                {visibleIssues.map((issue, index) => {
                  const colors = getSeverityColor(issue.severity);
                  return (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`relative border ${colors.border} rounded-lg p-4 backdrop-blur-sm ${colors.bg} ${colors.glow} group cursor-pointer overflow-hidden`}
                    >
                      {/* Animated scan line effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 5,
                          ease: 'linear',
                        }}
                      />

                      {/* Corner decorations */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />

                      <div className="flex items-start gap-3 relative z-10">
                        <motion.span
                          className="text-2xl"
                          animate={{ rotate: [0, 10, 0, -10, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                        >
                          {getTypeIcon(issue.type)}
                        </motion.span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${colors.badge}`}
                            >
                              {issue.severity}
                            </span>
                            <div className="h-px w-2 bg-slate-600" />
                            <span className="text-xs text-slate-500 font-mono truncate">
                              {issue.file}
                            </span>
                          </div>
                          <p
                            className={`text-sm font-medium ${colors.text} leading-relaxed`}
                          >
                            {issue.message}
                          </p>

                          {/* Progress indicator */}
                          <motion.div
                            className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.div
                              className={`h-full ${colors.text.replace('text-', 'bg-')}`}
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              style={{ boxShadow: `0 0 8px currentColor` }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {visibleIssues.length === 0 && (
              <div className="text-center py-16 relative">
                {/* Radar effect */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-32 h-32 border-2 border-cyan-500/20 rounded-full" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-24 h-24 border-2 border-blue-500/20 rounded-full" />
                </motion.div>

                <div className="relative z-10">
                  <motion.div
                    className="text-5xl mb-3"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔍
                  </motion.div>
                  <p className="text-sm font-mono text-cyan-400/60 uppercase tracking-wider">
                    Initializing scan sequence...
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-cyan-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Stats moved to Why AIReady section */}
      </div>
    </section>
  );
}
