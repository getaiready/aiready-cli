'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  MessageSquare,
  Zap,
  Share2,
  Terminal,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const ROUTER_NODES = [
  {
    id: 'channels',
    data: { label: 'WhatsApp / Discord / Slack', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'router',
    data: { label: 'Omni-Channel Router', type: 'bus' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'agent_core',
    data: { label: 'OpenClaw Agent Core', type: 'agent' },
    position: { x: 400, y: 0 },
  },
];

const ROUTER_EDGES = [
  {
    id: 'e1',
    source: 'channels',
    target: 'router',
    label: 'Signal',
    animated: true,
  },
  {
    id: 'e2',
    source: 'router',
    target: 'agent_core',
    label: 'Route',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: "The Message Router: OpenClaw's Neural Spine",
    description:
      'How OpenClaw handles omni-channel communication. Integrating WhatsApp, Discord, and Slack into a unified agentic spine.',
    datePublished: '2026-04-05',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image:
      'https://clawmore.getaiready.dev/blog-assets/omni-channel-ai-gateway.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-03-neural-spine',
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
                OPENCLAW_CHRONICLES // PART_03
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: neuralspine</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>06 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              The Message Router: <br />
              <span className="text-cyber-purple">OpenClaw's Neural Spine</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              One agent, infinite channels. How OpenClaw unified WhatsApp,
              Discord, and Slack into a single, proactive nervous system.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/omni-channel-ai-gateway.png"
                alt="Neural Spine Router"
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
                  label: 'NEURAL SPINE',
                  href: '/blog/openclaw-chronicles-03-neural-spine',
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
                    The Fragmentation Problem
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    As developers, our lives are scattered across platforms.
                    We're on Slack for work, Discord for communities, WhatsApp
                    for family, and Terminal for code. Most AI agents force you
                    to come to *them*. OpenClaw's philosophy is the opposite:
                    the agent should come to *you*.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The Unified Signal Architecture
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    OpenClaw uses a centralized **Message Router** that acts as
                    the neural spine of the system. It abstracts the
                    complexities of different APIs (Webhooks, WebSockets, Long
                    Polling) into a unified "Signal" format that the agent core
                    can understand.
                  </p>
                </section>

                <SystemFlow
                  nodes={ROUTER_NODES}
                  edges={ROUTER_EDGES}
                  height="300px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Omni-Channel Context
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Because the router is centralized, OpenClaw maintains
                    context across channels. You can start a task on your phone
                    via WhatsApp and finish it at your desk via the Terminal.
                    The agent knows exactly where you left off, regardless of
                    the interface.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <Share2 className="w-3 h-3" />
                      <span>ROUTER_CONFIG.yaml</span>
                    </div>
                    {`# OpenClaw Neural Spine Config
channels:
  whatsapp:
    enabled: true
    provider: "twilio"
  discord:
    enabled: true
    token: "ENV_DISCORD_TOKEN"
  slack:
    enabled: true
    workspace: "aiready-dev"
  terminal:
    enabled: true
    mode: "interactive"`}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    The Road to Execution
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Routing messages is just the first step. For an agent to be
                    useful, it needs to turn those messages into actions. In our
                    next entry, **AgentSkills**, we'll explore the execution
                    standard that allows OpenClaw to run shell commands and
                    manage your system safely.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Chronicles
                </div>
                <Link
                  href="/blog/openclaw-chronicles-04-agentskills"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Terminal className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 04 // AGENTSKILLS
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          AgentSkills: The Standard for Execution
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
