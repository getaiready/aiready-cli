'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  TrendingUp,
  Users,
  Star,
  Zap,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const GROWTH_NODES = [
  {
    id: 'clawdbot',
    data: { label: 'Clawdbot (Nov 2025)', type: 'agent' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'openclaw',
    data: { label: 'OpenClaw Pivot', type: 'bus' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'viral',
    data: { label: 'Lobster Phenomenon', type: 'event' },
    position: { x: 400, y: -50 },
  },
  {
    id: 'stars',
    data: { label: '250,000 GitHub Stars', type: 'event' },
    position: { x: 400, y: 50 },
  },
];

const GROWTH_EDGES = [
  {
    id: 'e1',
    source: 'clawdbot',
    target: 'openclaw',
    label: 'Rename',
    animated: true,
  },
  {
    id: 'e2',
    source: 'openclaw',
    target: 'viral',
    label: 'Launch',
    animated: true,
  },
  {
    id: 'e3',
    source: 'openclaw',
    target: 'stars',
    label: 'Growth',
    animated: true,
  },
];

export default function BlogPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'The Origin Story: From Clawdbot to 250k Stars',
    description:
      'The untold story of OpenClaw’s meteoric rise to 250,000 GitHub stars and the birth of the Lobster Phenomenon.',
    datePublished: '2026-03-29',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image:
      'https://clawmore.getaiready.dev/blog-assets/openclaw-101-agentic-revolution.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-01-origin-story',
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
                OPENCLAW_CHRONICLES // PART_01
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: origin</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>08 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              The Origin Story: <br />
              <span className="text-cyber-purple">Clawdbot to 250k Stars</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              The untold story of OpenClaw’s meteoric rise and the birth of the
              Lobster Phenomenon.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/openclaw-101-agentic-revolution.png"
                alt="OpenClaw Origin Story"
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
                  label: 'ORIGIN STORY',
                  href: '/blog/openclaw-chronicles-01-origin-story',
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
                    The Humble Beginnings
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    In November 2025, a small project called **Clawdbot**
                    appeared on GitHub. It was a simple message router for AI
                    agents, designed to connect LLMs to local files. Nobody
                    predicted that within four months, it would surpass React as
                    the most-starred software project in history.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    Peter Steinberger, the visionary behind the project,
                    realized that the world didn't need another chatbot. It
                    needed an **Agentic Engine**—a local-first runtime that
                    could *act*, not just *talk*.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The Lobster Phenomenon
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Why the lobster? It started as a joke in the early Discord
                    community, but it quickly became the symbol of a new era.
                    The "Lobster Phenomenon" represents the resilient,
                    hard-shelled, and decentralized nature of the OpenClaw
                    ecosystem.
                  </p>
                </section>

                <SystemFlow
                  nodes={GROWTH_NODES}
                  edges={GROWTH_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Breaking the 250k Star Barrier
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    The explosion happened overnight. Developers realized that
                    OpenClaw's local-first philosophy meant they could run a
                    24/7 Jarvis-like assistant on their own hardware, without
                    sending sensitive data to the cloud. This privacy-first
                    execution model was the match that lit the fire.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <TrendingUp className="w-3 h-3" />
                      <span>GITHUB_METRICS.json</span>
                    </div>
                    {`{
  "project": "OpenClaw",
  "stars": 250421,
  "forks": 18402,
  "contributors": 1240,
  "velocity": "Record Breaking"
}`}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    What’s Next?
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    The origin story is just the beginning. In our next entry,
                    **OpenClaw 101**, we’ll dive deep into the Local-First
                    philosophy that makes this framework so powerful. We’ll
                    explore how OpenClaw manages state in Markdown and why your
                    agent doesn't need a cloud to remember who you are.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Chronicles
                </div>
                <Link
                  href="/blog/openclaw-chronicles-02-local-first"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 02 // LOCAL_FIRST
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          OpenClaw 101: The Local-First Philosophy
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
