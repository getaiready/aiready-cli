'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Script from 'next/script';
import { ChartIcon } from '@/components/Icons';
import PlatformShell from '@/components/PlatformShell';
import { Team, TeamMember } from '@/lib/db';
import { LANDING_BASE_URL, PLATFORM_BASE_URL } from '@/lib/seo-schema';
import { metrics } from './constants';
import { MetricCard } from './components/MetricCard';

interface Props {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  teams?: (TeamMember & { team: Team })[];
  overallScore?: number | null;
}

export default function MetricsClient({
  user,
  teams = [],
  overallScore,
}: Props) {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'AI Readiness Methodology: The 9 Core Metrics',
    description:
      'Technical breakdown of how AIReady measures codebase AI-readiness across 9 key dimensions.',
    author: {
      '@type': 'Organization',
      name: 'AIReady',
      url: LANDING_BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AIReady',
    },
    url: `${PLATFORM_BASE_URL}/metrics`,
  };

  return (
    <PlatformShell
      user={user ? (user as any) : null}
      teams={teams}
      overallScore={overallScore}
      activePage="metrics"
    >
      <Script
        id="tech-article-schema-metrics"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <div className="py-20 px-4 relative">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="orb orb-blue w-96 h-96 -top-48 -left-48 opacity-20" />
          <div className="orb orb-purple w-96 h-96 bottom-0 right-0 opacity-20" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-cyan-900/30 text-cyan-300 text-sm font-medium rounded-full border border-cyan-500/30"
            >
              <ChartIcon className="w-4 h-4" />
              <span>AI Readiness Methodology</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white mb-6"
            >
              Deep Dive: The{' '}
              <span className="gradient-text-animated">9 Metrics</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 max-w-3xl mx-auto"
            >
              Technical methodology, scoring thresholds, and refactoring
              playbooks for AI-first engineering.
            </motion.p>
          </div>

          <div className="space-y-6">
            {metrics.map((metric, index) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                index={index}
                isExpanded={expandedMetric === metric.id}
                onToggle={() =>
                  setExpandedMetric(
                    expandedMetric === metric.id ? null : metric.id
                  )
                }
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 text-center"
          >
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <span>←</span> Back to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    </PlatformShell>
  );
}
