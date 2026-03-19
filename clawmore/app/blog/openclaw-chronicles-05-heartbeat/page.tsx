'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  Activity,
  Zap,
  Bell,
  Search,
  CheckCircle,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const HEARTBEAT_NODES = [
  {
    id: 'idle',
    data: { label: 'Agent Idle', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'heartbeat',
    data: { label: 'Heartbeat Trigger (60s)', type: 'bus' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'task_scan',
    data: { label: 'Task Scanner', type: 'agent' },
    position: { x: 400, y: -50 },
  },
  {
    id: 'exec',
    data: { label: 'Proactive Execution', type: 'agent' },
    position: { x: 400, y: 50 },
  },
];

const HEARTBEAT_EDGES = [
  {
    id: 'e1',
    source: 'idle',
    target: 'heartbeat',
    label: 'Wait',
    animated: false,
  },
  {
    id: 'e2',
    source: 'heartbeat',
    target: 'task_scan',
    label: 'Wake',
    animated: true,
  },
  {
    id: 'e3',
    source: 'task_scan',
    target: 'exec',
    label: 'Action',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'The Heartbeat: Scheduling Proactive Intelligence',
    description:
      'Moving from reactive chat to proactive assistance. How OpenClaw uses a heartbeat scheduler to perform tasks without being prompted.',
    datePublished: '2026-04-12',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image:
      'https://clawmore.getaiready.dev/blog-assets/eventbridge-the-neural-spine.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-05-heartbeat',
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
                OPENCLAW_CHRONICLES // PART_05
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: heartbeat</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>07 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              The Heartbeat: <br />
              <span className="text-cyber-purple">Proactive Intelligence</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Beyond the Prompt. How OpenClaw wakes itself up to anticipate your
              needs, automate your chores, and monitor your digital world 24/7.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/eventbridge-the-neural-spine.png"
                alt="Proactive Intelligence"
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
                  label: 'HEARTBEAT',
                  href: '/blog/openclaw-chronicles-05-heartbeat',
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
                    The Problem with Prompts
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Traditional AI is reactive. It sits there, waiting for you
                    to type something. But a true assistant shouldn't wait for
                    instructions for every single task. It should know that at
                    9:00 AM you need a summary of your GitHub notifications, or
                    that when a production server goes down, it needs to
                    investigate immediately.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    **OpenClaw** introduces the "Heartbeat"—a background
                    scheduler that allows the agent to exist as a persistent,
                    proactive service.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    How the Heartbeat Works
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    The Heartbeat is a simple but powerful mechanism. Every few
                    seconds or minutes (configurable), the OpenClaw runtime
                    triggers a "pulse". During this pulse, the agent wakes up,
                    checks its scheduled tasks, scans for external signals (like
                    new emails or webhooks), and determines if any autonomous
                    action is required.
                  </p>
                </section>

                <SystemFlow
                  nodes={HEARTBEAT_NODES}
                  edges={HEARTBEAT_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Proactive Use Cases
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg mb-8">
                    By leveraging the Heartbeat, OpenClaw can perform complex,
                    multi-step automations without human intervention:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <Bell className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Signal Monitoring
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Monitoring GitHub PRs, Slack mentions, or Gmail filters
                        and surfacing only what's critical.
                      </p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <Search className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        System Health
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Running periodic health checks on your infrastructure
                        and auto-remediating common issues.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    The Path to Self-Improvement
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Proactive intelligence is the first step toward true
                    autonomy. But what happens when the agent realizes it lacks
                    a skill to solve a recurring problem? In our next entry,
                    **Self-Improvement**, we'll explore the "Molt" mechanism:
                    how OpenClaw agents write their own code to expand their
                    capabilities.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Chronicles
                </div>
                <Link
                  href="/blog/openclaw-chronicles-06-self-improvement"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 06 // SELF_IMPROVEMENT
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          Self-Improvement: When Agents Write Their Own Skills
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
