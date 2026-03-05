'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUpIcon } from '@/components/Icons';
import PlatformShell from '@/components/PlatformShell';
import { Team, TeamMember } from '@/lib/db';
import WaitingListModal from '@/components/WaitingListModal';

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

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for personal projects and trying out AIReady.',
    features: [
      '1 team',
      '3 repositories',
      '10 analysis runs/month',
      '7-day data retention',
      'Full open-source CLI tools',
      'Local visualization',
      'JSON/HTML export',
    ],
    cta: 'Get Started',
    href: '/login',
    featured: false,
    available: true,
  },
  {
    name: 'Pro',
    price: '$49',
    description:
      'For individual developers serious about AI-friendly code quality.',
    features: [
      'Everything in Free, plus:',
      '10 repositories',
      'Unlimited analysis runs',
      '90-day data retention',
      'Historical trends & charts',
      '5 AI refactoring plans/month',
      'Email support',
    ],
    cta: 'Join Waitlist',
    href: '#',
    featured: true,
    available: false,
  },
  {
    name: 'Team',
    price: '$99',
    description:
      'Avoid the procurement nightmare while getting enterprise-grade protection.',
    features: [
      'Everything in Pro, plus:',
      'Unlimited repositories',
      'Unlimited team members',
      'Team benchmarking',
      '20 AI refactoring plans/month',
      'CI/CD integration',
      'PR Gatekeeper Mode',
      'Priority email support',
    ],
    cta: 'Join Waitlist',
    href: '#',
    featured: false,
    available: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Large organizations with strategic AI adoption programs.',
    features: [
      'Everything in Team, plus:',
      'Unlimited teams/users',
      'Unlimited refactoring plans',
      '1-year+ data retention',
      'Custom thresholds & rules',
      'API access',
      'Dedicated account manager',
      'SLA support',
    ],
    cta: 'Contact Us',
    href: '/contact',
    featured: false,
    available: false,
  },
];

export default function PricingClient({
  user,
  teams = [],
  overallScore,
}: Props) {
  const [waitlistPlan, setWaitlistPlan] = useState<string | null>(null);

  return (
    <PlatformShell
      user={user ? (user as any) : null}
      teams={teams}
      overallScore={overallScore}
    >
      <div className="py-20 px-4">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-cyan-900/30 text-cyan-300 text-sm font-medium rounded-full border border-cyan-500/30"
            >
              <TrendingUpIcon className="w-4 h-4" />
              <span>Pricing Plans</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white mb-6"
            >
              Choose Your <span className="gradient-text-animated">Plan</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 max-w-2xl mx-auto"
            >
              Invest in your codebase's AI readiness. Start for free and scale
              as you grow.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                id={plan.name.toLowerCase()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8 }}
                className={`glass-card rounded-3xl p-8 flex flex-col relative ${
                  plan.featured
                    ? 'border-cyan-500/50 shadow-cyan-500/20 shadow-2xl scale-105 z-20'
                    : ''
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                {!plan.available && plan.name !== 'Enterprise' && (
                  <div className="absolute top-4 right-4 bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Coming Soon
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      {plan.price}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className="text-slate-500 text-sm">/month</span>
                    )}
                  </div>
                  <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="flex-grow space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div
                        className={`mt-1 p-0.5 rounded-full ${plan.featured ? 'bg-cyan-500' : 'bg-slate-700'}`}
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span
                        className={
                          feature.includes('plus')
                            ? 'text-cyan-400 font-medium'
                            : 'text-slate-300'
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.cta === 'Join Waitlist' ? (
                  <button
                    onClick={() => setWaitlistPlan(plan.name)}
                    className={`w-full text-center py-3 rounded-xl font-bold transition-all ${
                      plan.featured
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link
                    href={plan.href}
                    className={`w-full text-center py-3 rounded-xl font-bold transition-all ${
                      plan.featured
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 text-center"
          >
            <Link
              href="/dashboard"
              className="text-slate-500 hover:text-cyan-400 flex items-center justify-center gap-2 transition-colors"
            >
              <span>←</span> Back to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>

      <WaitingListModal
        isOpen={!!waitlistPlan}
        onClose={() => setWaitlistPlan(null)}
        planName={waitlistPlan || ''}
      />
    </PlatformShell>
  );
}
