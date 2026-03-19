'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  ShieldCheck,
  Zap,
  HardDrive,
  FileText,
  Lock,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const LOCAL_NODES = [
  {
    id: 'user_input',
    data: { label: 'User Message', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'router',
    data: { label: 'OpenClaw Router', type: 'bus' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'local_storage',
    data: { label: 'Local Markdown/YAML', type: 'agent' },
    position: { x: 400, y: -50 },
  },
  {
    id: 'local_llm',
    data: { label: 'Ollama / LM Studio', type: 'agent' },
    position: { x: 400, y: 50 },
  },
];

const LOCAL_EDGES = [
  {
    id: 'e1',
    source: 'user_input',
    target: 'router',
    label: 'Inbound',
    animated: true,
  },
  {
    id: 'e2',
    source: 'router',
    target: 'local_storage',
    label: 'Context',
    animated: true,
  },
  {
    id: 'e3',
    source: 'router',
    target: 'local_llm',
    label: 'Inference',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'OpenClaw 101: The Local-First Philosophy',
    description:
      'Why privacy and performance are the pillars of the next generation of AI agents. Exploring the local-first architecture of OpenClaw.',
    datePublished: '2026-04-02',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image:
      'https://clawmore.getaiready.dev/blog-assets/surviving-void-ephemeral-persistence.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-02-local-first',
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
                OPENCLAW_CHRONICLES // PART_02
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: localfirst</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>07 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              OpenClaw 101: <br />
              <span className="text-cyber-purple">Local-First Philosophy</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Privacy isn't just a feature—it's the foundation. Why the most
              powerful AI agents of the future will live on your hardware, not
              in the cloud.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/surviving-void-ephemeral-persistence.png"
                alt="Local-First Philosophy"
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
                  label: 'LOCAL-FIRST',
                  href: '/blog/openclaw-chronicles-02-local-first',
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
                    The Death of the Chatbox
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    For the last two years, we've been trained to think of AI as
                    a web tab. You go to a site, you type a prompt, you get an
                    answer. But for an agent to be truly useful, it needs to be
                    *integrated*. It needs to see your files, run your scripts,
                    and understand your local environment.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    **OpenClaw** breaks this paradigm by being "Local-First". It
                    doesn't live on a server in Virginia; it lives on your
                    MacBook, your Raspberry Pi, or your home lab.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The Privacy Imperative
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    When you give an agent access to your codebase or your
                    personal notes, you're handing over the keys to your digital
                    kingdom. In a cloud-centric world, this is a security
                    nightmare. In a local-first world, your data never leaves
                    your network.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <Lock className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Zero-Knowledge Storage
                      </h4>
                      <p className="text-sm text-zinc-400">
                        OpenClaw stores state in Markdown and YAML files on your
                        local disk. No proprietary database, no cloud sync
                        required.
                      </p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <HardDrive className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Local Inference
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Plug in Ollama or LM Studio to run models like Llama 3
                        or Mistral entirely offline. 100% privacy, 0ms latency
                        to the cloud.
                      </p>
                    </div>
                  </div>
                </section>

                <SystemFlow
                  nodes={LOCAL_NODES}
                  edges={LOCAL_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    State as Source Control
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    One of OpenClaw's most radical ideas is treating agent state
                    as text. Your agent's memory, its "skills", and its
                    preferences are just files. This means you can `git init`
                    your agent's brain. You can branch its personality, roll
                    back its memory, and sync it across your own devices
                    securely.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <FileText className="w-3 h-3" />
                      <span>AGENT_BRAIN.yaml</span>
                    </div>
                    {`# OpenClaw Local State Example
identity:
  name: "ClawOne"
  persona: "Architect"
memory_path: "./memory/context.md"
skills_enabled:
  - shell_execution
  - filesystem_observer
  - git_sync
inference_engine: "ollama://llama3"`}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    Bridging to the Cloud
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    If everything is local, how do we handle scale? This is
                    where **ClawMore** comes in. In Part 07 of this series,
                    we'll explain how we bridge these local-first agents into a
                    managed AWS infrastructure without sacrificing the privacy
                    and control that makes OpenClaw special.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Chronicles
                </div>
                <Link
                  href="/blog/openclaw-chronicles-03-neural-spine"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 03 // NEURAL_SPINE
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          The Message Router: OpenClaw's Neural Spine
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
