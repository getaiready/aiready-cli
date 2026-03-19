'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  Cpu,
  Zap,
  RotateCcw,
  FileCode,
  Brain,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const MOLT_NODES = [
  {
    id: 'gap',
    data: { label: 'Capability Gap Detected', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'coder',
    data: { label: 'Molt Coder Agent', type: 'agent' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'new_skill',
    data: { label: 'New SKILL.md Generated', type: 'bus' },
    position: { x: 400, y: -50 },
  },
  {
    id: 'registry',
    data: { label: 'Skill Registry Update', type: 'bus' },
    position: { x: 400, y: 50 },
  },
];

const MOLT_EDGES = [
  {
    id: 'e1',
    source: 'gap',
    target: 'coder',
    label: 'Trigger',
    animated: true,
  },
  {
    id: 'e2',
    source: 'coder',
    target: 'new_skill',
    label: 'Code',
    animated: true,
  },
  {
    id: 'e3',
    source: 'new_skill',
    target: 'registry',
    label: 'Register',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Self-Improvement: When Agents Write Their Own Skills',
    description:
      'The "Molt" mechanism. How OpenClaw agents autonomously code new skills to solve complex tasks and expand their capabilities recursively.',
    datePublished: '2026-04-15',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image:
      'https://clawmore.getaiready.dev/blog-assets/the-reflector-self-critique.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-06-self-improvement',
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
                OPENCLAW_CHRONICLES // PART_06
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: molt</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>09 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              Self-Improvement: <br />
              <span className="text-cyber-purple">Autonomous Molting</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              The Recursive Loop. How OpenClaw agents identify their own
              limitations and write the code necessary to overcome them without
              human intervention.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/the-reflector-self-critique.png"
                alt="Self-Improving Agents"
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
                  label: 'SELF-IMPROVEMENT',
                  href: '/blog/openclaw-chronicles-06-self-improvement',
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
                    The Capability Wall
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Every agent eventually hits a "wall"—a task that requires a
                    tool it doesn't have. Most systems fail here and ask the
                    human for help. But OpenClaw is built on the philosophy of
                    **Evolution**. If an agent can't solve a problem, it doesn't
                    just give up; it builds the solution.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The Molt Mechanism
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    We call this process "Molting." Just as a lobster sheds its
                    shell to grow, an OpenClaw agent sheds its current
                    limitations by generating new skills. When a capability gap
                    is detected, the agent triggers a high-reasoning **Coder
                    Agent** to draft a new `SKILL.md` file.
                  </p>
                </section>

                <SystemFlow
                  nodes={MOLT_NODES}
                  edges={MOLT_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Recursive Improvement
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg mb-8">
                    The beauty of the local-first architecture is that this new
                    skill is immediately written to the local disk, registered
                    in the agent's brain, and ready for use. The agent can then
                    retry the original task using its newly acquired power.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <RotateCcw className="w-3 h-3" />
                      <span>EVOLUTION_LOG.json</span>
                    </div>
                    {`{
  "timestamp": "2026-04-15T10:24:00Z",
  "event": "MOLT_TRIGGERED",
  "reason": "Missing capability: 'analyze_pcap_files'",
  "status": "Generating 'pcap_inspector' skill...",
  "output_path": "./skills/pcap_inspector.md",
  "validation": "PASSED"
}`}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    Scaling the Evolution
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Self-improvement on a single machine is powerful, but what
                    if these mutations could be shared? In our next entry,
                    **Persistence**, we'll explore how we scale this local-first
                    state to the cloud using S3 and DynamoDB, enabling a global
                    ecosystem of evolving agents.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Chronicles
                </div>
                <Link
                  href="/blog/openclaw-chronicles-07-persistence"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Brain className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 07 // PERSISTENCE
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          Persistence: S3 + DynamoDB State Management
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
