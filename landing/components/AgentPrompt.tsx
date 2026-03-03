'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';

interface AgentPromptProps {
  variant?: 'basic' | 'detailed' | 'fix' | 'consulting';
  className?: string;
}

const prompts = {
  basic: [
    'Scan this codebase for AI readiness issues. Run:',
    '',
    'npx @aiready/cli scan',
    '',
    'Then visualise the results interactively:',
    'npx @aiready/cli visualise',
    '',
    'Review the report and summarize:',
    '1. Overall AI Readiness Score',
    '2. Top 3 critical issues found',
    '3. Quick wins we can fix immediately',
  ],

  detailed: [
    'Perform a comprehensive AI readiness analysis on this codebase:',
    '',
    'Step 1: Run the scan',
    'npx @aiready/cli scan --score',
    '',
    'Step 2: Visualise dependency graph',
    'npx @aiready/cli visualise',
    '- Inspect clusters of tightly coupled files',
    '- Identify deep import chains visually',
    '- Note any isolated or orphaned modules',
    '',
    'Step 3: Review the report and identify:',
    '- Semantic duplicates (wasted AI context tokens)',
    '- High context budget files (too many dependencies)',
    '- Naming inconsistencies (confuse AI models)',
    '- Deep import chains (exceed context windows)',
    '',
    'Step 4: Prioritize fixes by impact:',
    '- Which issues cause the most AI confusion?',
    '- What quick wins exist (low effort, high impact)?',
    '- What systemic patterns need addressing?',
    '',
    'Step 5: Provide actionable recommendations with file references.',
  ],

  fix: [
    'Fix AI readiness issues in this codebase:',
    '',
    'Step 1: Run analysis and visualise',
    'npx @aiready/cli scan --score',
    'npx @aiready/cli visualise',
    '',
    'Step 2: Use the graph to find hotspots, then fix:',
    '- Semantic duplicates: Extract to shared utilities',
    '- High context files: Break into smaller modules',
    '- Naming issues: Use clear, consistent names',
    '- Deep chains: Flatten or re-layer imports',
    '',
    'Step 3: Re-run to verify improvements',
    'npx @aiready/cli scan --score',
    'npx @aiready/cli visualise',
    '',
    'Step 4: Report before/after AI Readiness Score and changes made.',
  ],
  consulting: [
    'Generate an AI Readiness Audit for this codebase:',
    '',
    'Step 1: Run comprehensive scan',
    'npx @aiready/cli scan --score --output audit-report.json',
    '',
    'Step 2: Generate interactive visualization',
    'npx @aiready/cli visualise --report audit-report.json --output audit.html',
    '',
    'Step 3: Analyze results for professional advisory:',
    '- Identify systemic architectural drift',
    '- Calculate potential token savings from consolidation',
    '- Prioritize refactoring targets by "Readiness ROI"',
    '',
    'Step 4: Create an executive summary suitable for stakeholders.',
  ],
};

const promptTitles = {
  basic: 'Basic Scan',
  detailed: 'Detailed Analysis',
  fix: 'Fix Issues',
  consulting: 'Consulting Audit',
};

export default function AgentPrompt({
  variant = 'basic',
  className = '',
}: AgentPromptProps) {
  const [copied, setCopied] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const promptLines = prompts[variant];

  useEffect(() => {
    // Animate lines appearing one by one
    const delays = promptLines.map(
      (_, index) =>
        setTimeout(
          () => {
            setVisibleLines((prev) => [...prev, index]);
          },
          index * 100 + 500
        ) // Start after 500ms, then 100ms between lines
    );

    return () => delays.forEach(clearTimeout);
  }, [variant, promptLines]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
    >
      {/* Main terminal-style card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-slate-900 rounded-2xl p-6 text-left max-w-3xl mx-auto border border-slate-800 shadow-2xl relative overflow-hidden"
      >
        {/* Window chrome dots and label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-sm text-slate-500 font-mono">
              agent prompt
            </span>
          </div>

          {/* Copy button */}
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy Prompt'}
          </motion.button>
        </div>

        {/* Prompt content with typing animation */}
        <div className="space-y-1 min-h-[200px]">
          <div className="flex items-start gap-2 mb-2">
            <Bot className="w-5 h-5 text-purple-400 mt-1" />
            <span className="text-purple-400 font-mono text-sm">
              {promptTitles[variant]} Prompt
            </span>
          </div>

          <AnimatePresence>
            {promptLines.map(
              (line, index) =>
                visibleLines.includes(index) && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`font-mono text-sm leading-relaxed ${
                      line.startsWith('npx') || line.startsWith('Step')
                        ? 'text-cyan-400 font-semibold'
                        : line.startsWith('-') || line.match(/^\d\./)
                          ? 'text-green-400 pl-4'
                          : line === ''
                            ? 'h-2'
                            : 'text-slate-300 pl-4'
                    }`}
                  >
                    {line || '\u00A0'}
                  </motion.div>
                )
            )}
          </AnimatePresence>

          {/* Blinking cursor at the end */}
          {visibleLines.length === promptLines.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-cyan-400 font-mono text-sm inline-block ml-1"
            >
              |
            </motion.span>
          )}
        </div>

        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 pointer-events-none"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
