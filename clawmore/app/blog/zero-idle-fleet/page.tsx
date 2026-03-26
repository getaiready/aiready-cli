'use client';

import Link from 'next/link';
import { Clock, Hash, ChevronRight, Zap, Activity } from 'lucide-react';
import SystemFlow from '../../../components/SystemFlow';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';

const IDLE_NODES = [
  {
    id: 'legacy',
    data: { label: 'Legacy VPS ($0.05/min)', type: 'agent' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'idle-waste',
    data: { label: 'IDLE WASTE ($72/mo)', type: 'event' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'serverless',
    data: { label: 'ServerlessClaw ($0.00/min)', type: 'bus' },
    position: { x: 0, y: 100 },
  },
  {
    id: 'execution',
    data: { label: 'UTILITY BILLING ($0.01)', type: 'event' },
    position: { x: 250, y: 100 },
  },
];

const IDLE_EDGES = [
  {
    id: 'e1',
    source: 'legacy',
    target: 'idle-waste',
    label: 'Always On',
    style: { stroke: '#ef4444' },
  },
  {
    id: 'e2',
    source: 'serverless',
    target: 'execution',
    label: 'Event Triggered',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Zero-Idle Fleet: Scaling to Infinity for $0.00',
    description:
      'How to run a fleet of 100 on-call agents for a week for less than the price of a coffee by leveraging the physics of serverless.',
    datePublished: '2026-03-27',
    author: {
      '@type': 'Person',
      name: 'Eclawnomist',
    },
    image: '/blog-assets/zero-idle-fleet.png',
    url: '/blog/zero-idle-fleet',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-purple/30 selection:text-cyber-purple font-sans">
      <JsonLd data={BLOG_JSON_LD} />
      <Navbar variant="post" />

      <header className="py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(188,0,255,0.05)_0%,_transparent_70%)] opacity-30" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-cyber-purple font-mono text-[9px] uppercase tracking-[0.4em] font-black border border-cyber-purple/20 px-2 py-1 bg-cyber-purple/5">
                MUTATION_LOG_002
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: zeroidle</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>05 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              Zero-Idle <br />
              <span className="text-cyber-purple">Fleet Scaling</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Stop paying for air. Learn how to architect an agentic workforce
              that only exists when it&apos;s working.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/zero-idle-fleet.png"
                alt="Zero-Idle Fleet"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </div>
      </header>

      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs
              items={[
                { label: 'BLOG', href: '/blog' },
                {
                  label: 'ZERO-IDLE FLEET',
                  href: '/blog/zero-idle-fleet',
                },
              ]}
            />
            <article className="prose prose-invert prose-zinc max-w-none">
              <div className="space-y-12">
                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      01
                    </span>
                    The Idle Debt Crisis
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Traditional AI platforms run their agents on permanent
                    servers. This is fine if your agent is busy 24/7. But for
                    most business tasks—audits, CRM updates, code reviews—the
                    agent is idle 99% of the time.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    In the Eclawnomy, we call this <strong>Idle Debt</strong>.
                    It&apos;s the hidden friction that makes agentic scaling
                    impossible for most firms.
                  </p>
                </section>

                <SystemFlow
                  nodes={IDLE_NODES}
                  edges={IDLE_EDGES}
                  height="300px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    Scaling to Infinity for $0.00
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    By leveraging **ServerlessClaw**, we decouple the existence
                    of the agent from its runtime. When a trigger arrives (a
                    GitHub webhook, a Stripe event, a calendar invite), the
                    infrastructure materializes, performs the task, and
                    vanishes.
                  </p>
                  <div className="mt-8 p-6 bg-cyber-purple/5 border border-cyber-purple/20 rounded-sm">
                    <div className="flex items-center gap-3 mb-4 text-cyber-purple">
                      <Zap className="w-5 h-5" />
                      <span className="font-mono text-xs uppercase tracking-widest">
                        Physics_of_Serverless
                      </span>
                    </div>
                    <ul className="space-y-3 text-sm text-zinc-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-1 text-cyber-purple" />
                        <span>
                          <strong>Event-Driven:</strong> Agents only incur cost
                          during compute.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-1 text-cyber-purple" />
                        <span>
                          <strong>Infinite Parallelism:</strong> Run 1 or 1,000
                          agents simultaneously without resource contention.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-1 text-cyber-purple" />
                        <span>
                          <strong>Wait-State Economics:</strong> 10,000 agents
                          waiting for a signal cost exactly $0.00.
                        </span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Real-World ROI
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Last month, a pilot client used our Zero-Idle architecture
                    to run a nightly audit Across 45 different client
                    repositories. Total cost for the month?{' '}
                    <strong>$4.12</strong>. On a traditional VPS setup, the same
                    coverage would have exceeded $250.
                  </p>
                </section>
              </div>

              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Mutation_Diaries
                </div>
                <Link
                  href="/blog/account-vending-secret"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 03 // ISOLATION_ARCHITECTURE
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          The Account Vending Secret: Beyond Containers
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-zinc-700 group-hover:text-cyber-purple group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <footer className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center text-zinc-700 text-[10px] font-mono uppercase tracking-[0.5em]">
          TERMINAL_LOCKED // 2026 PERPETUAL_EVOLUTION
        </div>
      </footer>
    </div>
  );
}
