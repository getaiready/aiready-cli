'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  Terminal,
  ShieldAlert,
  Zap,
  Cpu,
  FileCode,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const SKILL_NODES = [
  {
    id: 'router',
    data: { label: 'Signal Received', type: 'bus' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'skill_manager',
    data: { label: 'Skill Dispatcher', type: 'bus' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'shell_skill',
    data: { label: 'Shell Execution (SKILL.md)', type: 'agent' },
    position: { x: 400, y: -50 },
  },
  {
    id: 'browser_skill',
    data: { label: 'Browser Automation', type: 'agent' },
    position: { x: 400, y: 50 },
  },
];

const SKILL_EDGES = [
  {
    id: 'e1',
    source: 'router',
    target: 'skill_manager',
    label: 'Command',
    animated: true,
  },
  {
    id: 'e2',
    source: 'skill_manager',
    target: 'shell_skill',
    label: 'Execute',
    animated: true,
  },
  {
    id: 'e3',
    source: 'skill_manager',
    target: 'browser_skill',
    label: 'Browse',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'AgentSkills: The Standard for Execution',
    description:
      'Moving beyond chat. Exploring the modular skill system that allows OpenClaw to perform real-world actions safely and autonomously.',
    datePublished: '2026-04-08',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image: 'https://clawmore.getaiready.dev/blog-assets/sst-ion-coder-loop.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-04-agentskills',
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
                OPENCLAW_CHRONICLES // PART_04
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: agentskills</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>08 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              AgentSkills: <br />
              <span className="text-cyber-purple">Standard for Execution</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Moving beyond chat. How OpenClaw turns natural language into
              precise, multi-step actions across your file system and the web.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/sst-ion-coder-loop.png"
                alt="AgentSkills Execution System"
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
                  label: 'AGENTSKILLS',
                  href: '/blog/openclaw-chronicles-04-agentskills',
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
                    The Execution Paradox
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    The biggest limitation of modern AI is the "box". Models can
                    write code, but they can't run it. They can plan a trip, but
                    they can't book the tickets. OpenClaw breaks this box using
                    **AgentSkills**—a modular protocol that grants the agent
                    precise, safe, and powerful capabilities.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The SKILL.md Standard
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Unlike other frameworks that use complex JSON schemas for
                    tool definitions, OpenClaw uses **Markdown**. Every skill is
                    defined in a `SKILL.md` file, combining human-readable
                    documentation with machine-executable instructions. This
                    makes building new skills as easy as writing a blog post.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <FileCode className="w-3 h-3" />
                      <span>S3_UPLOADER_SKILL.md</span>
                    </div>
                    {`# S3 Uploader Skill
Description: Allows the agent to upload files to a specified AWS S3 bucket.

## Prerequisites
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

## Execution
\`\`\`bash
aws s3 cp {{local_path}} s3://{{bucket_name}}/{{remote_path}}
\`\`\``}
                  </div>
                </section>

                <SystemFlow
                  nodes={SKILL_NODES}
                  edges={SKILL_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Safety Guards & Autonomy
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    With great power comes the risk of accidental `rm -rf /`.
                    OpenClaw implements a multi-layered safety architecture.
                    Every skill execution is passed through a **Safety Guard**
                    that analyzes the command for malicious patterns,
                    destructive actions, or prompt injection attempts before it
                    ever touches your shell.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <ShieldAlert className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Recursive Guards
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Prevents agents from calling themselves in infinite
                        loops or spawning unauthorized sub-processes.
                      </p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <Cpu className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Resource Isolation
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Restricts skill execution to specific directories and
                        environment variables, keeping your core system safe.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    Proactive Execution
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Execution is powerful, but it's even better when it's
                    proactive. In our next entry, **The Heartbeat**, we'll
                    explore how OpenClaw uses scheduled tasks to monitor your
                    environment and perform actions without you even asking.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Chronicles
                </div>
                <Link
                  href="/blog/openclaw-chronicles-05-heartbeat"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 05 // THE_HEARTBEAT
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          The Heartbeat: Scheduling Proactive Intelligence
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
