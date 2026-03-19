'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  Share2,
  Zap,
  RefreshCw,
  Layers,
  Activity,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const SYNC_NODES = [
  {
    id: 'mutation',
    data: { label: 'New Mutation Found', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'sync_bus',
    data: { label: 'ClawSync Bus', type: 'bus' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'broadcast',
    data: { label: 'Global Broadcast', type: 'event' },
    position: { x: 400, y: -50 },
  },
  {
    id: 'apply',
    data: { label: 'Atomic Application', type: 'agent' },
    position: { x: 400, y: 50 },
  },
];

const SYNC_EDGES = [
  {
    id: 'e1',
    source: 'mutation',
    target: 'sync_bus',
    label: 'Identify',
    animated: true,
  },
  {
    id: 'e2',
    source: 'sync_bus',
    target: 'broadcast',
    label: 'Propagate',
    animated: true,
  },
  {
    id: 'e3',
    source: 'broadcast',
    target: 'apply',
    label: 'Mutate',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Sync Architecture: Scaling to a Managed Empire',
    description:
      'Cross-account mutation synchronization. How ClawMore manages global infrastructure evolution across thousands of AWS accounts using ClawSync.',
    datePublished: '2026-04-30',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image:
      'https://clawmore.getaiready.dev/blog-assets/eventbridge-the-neural-spine.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-11-sync-architecture',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-purple/30 selection:text-cyber-purple font-sans">
      <JsonLd data={BLOG_JSON_LD} />
      <Navbar variant="post" />

      {/* Article Header */}
      <header className="py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(188,0,255,0.05)_0%,_transparent_70%)] opacity-30" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-cyber-purple font-mono text-[9px] uppercase tracking-[0.4em] font-black border border-cyber-purple/20 px-2 py-1 bg-cyber-purple/5">
                OPENCLAW_CHRONICLES // PART_11
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: clawsync</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>08 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              Sync Architecture: <br />
              <span className="text-cyber-purple">Scaling the Empire</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Global Orchestration. How we achieve atomic, cross-account
              infrastructure mutations across thousands of spokes in real-time.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/eventbridge-the-neural-spine.png"
                alt="Sync Architecture - ClawSync"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs
              items={[
                { label: 'BLOG', href: '/blog' },
                {
                  label: 'SYNC ARCHITECTURE',
                  href: '/blog/openclaw-chronicles-11-sync-architecture',
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
                    The Scaling Challenge
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    In a Hub-and-Spoke architecture, the biggest challenge is
                    synchronization. If the Hub identifies a critical security
                    vulnerability in Spoke A, it must be able to propagate that
                    fix to Spoke B through Spoke Z immediately. Traditional
                    CI/CD is too slow and too rigid for this level of agentic
                    evolution.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    Introducing ClawSync
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    We built **ClawSync**—a specialized synchronization bus that
                    handles atomic mutations across multiple AWS accounts. When
                    a mutation is approved, ClawSync broadcasts the change to
                    all relevant spokes. Each spoke's local OpenClaw agent
                    receives the signal, validates it against its local security
                    policy, and applies the change.
                  </p>
                </section>

                <SystemFlow
                  nodes={SYNC_NODES}
                  edges={SYNC_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Atomic Propagation
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg mb-8">
                    Atomic propagation ensures that mutations are applied
                    consistently across the entire fleet. If a mutation fails in
                    one spoke, it's automatically rolled back, and the Hub is
                    notified for analysis.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <Layers className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Versioned Evolution
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Every mutation is versioned, allowing us to track the
                        evolution of the entire empire over time.
                      </p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <RefreshCw className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Event-Driven Sync
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Mutations are triggered by events, not schedules. This
                        allows for sub-second response times to critical
                        changes.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    The Series Finale
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    We've covered the origins, the philosophy, the execution,
                    and the economics. But what does the future hold for
                    autonomous businesses? In our final entry, **The Future**,
                    we'll look beyond the current horizon to a world of fully
                    autonomous business entities.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  The_Chronicles_Finale
                </div>
                <Link
                  href="/blog/openclaw-chronicles-12-future"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 12 // THE_FUTURE
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          Beyond the Bridge: The Future of Autonomy
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

      {/* Footer */}
      <footer className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center text-zinc-700 text-[10px] font-mono uppercase tracking-[0.5em]">
          TERMINAL_LOCKED // 2026 PERPETUAL_EVOLUTION
        </div>
      </footer>
    </div>
  );
}
