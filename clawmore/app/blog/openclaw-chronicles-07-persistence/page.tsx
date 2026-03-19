'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  Database,
  Cloud,
  Zap,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const PERSISTENCE_NODES = [
  {
    id: 'local_agent',
    data: { label: 'OpenClaw Local Agent', type: 'agent' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'sync_engine',
    data: { label: 'ClawMore Sync Engine', type: 'bus' },
    position: { x: 200, y: 0 },
  },
  {
    id: 's3_storage',
    data: { label: 'S3 (Persistent Memory)', type: 'agent' },
    position: { x: 400, y: -50 },
  },
  {
    id: 'dynamodb',
    data: { label: 'DynamoDB (State/Locks)', type: 'agent' },
    position: { x: 400, y: 50 },
  },
];

const PERSISTENCE_EDGES = [
  {
    id: 'e1',
    source: 'local_agent',
    target: 'sync_engine',
    label: 'Push State',
    animated: true,
  },
  {
    id: 'e2',
    source: 'sync_engine',
    target: 's3_storage',
    label: 'Archive',
    animated: true,
  },
  {
    id: 'e3',
    source: 'sync_engine',
    target: 'dynamodb',
    label: 'Index',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Persistence: S3 + DynamoDB State Management',
    description:
      'Scaling local-first state to cloud scale. How we use S3 and DynamoDB to provide a persistent, high-availability backbone for OpenClaw agents.',
    datePublished: '2026-04-18',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image:
      'https://clawmore.getaiready.dev/blog-assets/surviving-void-ephemeral-persistence.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-07-persistence',
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
                OPENCLAW_CHRONICLES // PART_07
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: persistence</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>08 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              Persistence: <br />
              <span className="text-cyber-purple">Cloud-Scale State</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Scaling the Unscalable. How ClawMore bridges OpenClaw's
              local-first philosophy with AWS-grade durability, global
              synchronization, and multi-layered persistence.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/surviving-void-ephemeral-persistence.png"
                alt="Cloud-Scale Persistence"
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
                  label: 'PERSISTENCE',
                  href: '/blog/openclaw-chronicles-07-persistence',
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
                    The Ephemeral Challenge
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    In Part 02, we explored OpenClaw's local-first
                    philosophy—storing state in Markdown files on your disk. But
                    what happens when you want to run that agent across multiple
                    machines, or scale it to a managed fleet? Local storage
                    becomes a bottleneck for collaboration and high
                    availability.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    ClawMore's Sync Backbone
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    ClawMore innovates by providing a cloud-scale persistence
                    layer that mirrors your local OpenClaw state. We use **AWS
                    S3** for long-term "Persistent Memory" (storing the actual
                    Markdown and YAML files) and **AWS DynamoDB** for real-time
                    state indexing, locking, and task orchestration.
                  </p>
                </section>

                <SystemFlow
                  nodes={PERSISTENCE_NODES}
                  edges={PERSISTENCE_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    The S3 + DynamoDB Pattern
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg mb-8">
                    Why this specific combination? It allows us to maintain the
                    simplicity of OpenClaw's file-based state while gaining the
                    benefits of a global infrastructure:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <Cloud className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        S3: File Mirroring
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Every mutation in your local OpenClaw state is
                        asynchronously synced to a versioned S3 bucket,
                        providing an immutable audit trail.
                      </p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <Database className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        DynamoDB: Live Indexing
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Metadata about your agent's current task, its available
                        skills, and its heartbeat status are stored in DynamoDB
                        for sub-millisecond access.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    Safety First
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Scaling state to the cloud opens up new security vectors. If
                    an agent can sync its memory to S3, how do we ensure it
                    doesn't leak sensitive data or execute malicious
                    instructions from a compromised sync? In our next entry,
                    **Ironclad Autonomy**, we'll dive into VPC isolation and our
                    multi-layered security guards.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Chronicles
                </div>
                <Link
                  href="/blog/openclaw-chronicles-08-security"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 08 // SECURITY_ISOLATION
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          Ironclad Autonomy: Security & VPC Isolation
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
