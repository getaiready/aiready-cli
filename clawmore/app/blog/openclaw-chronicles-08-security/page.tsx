'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock,
  Server,
  ShieldAlert,
  Network,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const SECURITY_NODES = [
  {
    id: 'input',
    data: { label: 'Untrusted Signal', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'guard',
    data: { label: 'Recursion Guard', type: 'bus' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'vpc',
    data: { label: 'Isolated VPC (Fargate)', type: 'agent' },
    position: { x: 400, y: -50 },
  },
  {
    id: 'output',
    data: { label: 'Safe Execution', type: 'event' },
    position: { x: 400, y: 50 },
  },
];

const SECURITY_EDGES = [
  {
    id: 'e1',
    source: 'input',
    target: 'guard',
    label: 'Analyze',
    animated: true,
  },
  {
    id: 'e2',
    source: 'guard',
    target: 'vpc',
    label: 'Authorize',
    animated: true,
  },
  {
    id: 'e3',
    source: 'vpc',
    target: 'output',
    label: 'Respond',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Ironclad Autonomy: Security & VPC Isolation',
    description:
      'Safety guards for autonomous agents. Explaining our multi-layered approach to recursion guards, VPC isolation, and context security in ClawMore.',
    datePublished: '2026-04-22',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image:
      'https://clawmore.getaiready.dev/blog-assets/ironclad-autonomy-safety-vpc.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-08-security',
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
                OPENCLAW_CHRONICLES // PART_08
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: security</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>09 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              Ironclad Autonomy: <br />
              <span className="text-cyber-purple">Safety & Isolation</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              "What if it deletes my production database?" Managing the risks of
              autonomous execution with defense-in-depth security.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/ironclad-autonomy-safety-vpc.png"
                alt="Security & VPC Isolation"
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
                  label: 'SECURITY',
                  href: '/blog/openclaw-chronicles-08-security',
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
                    The Autonomy Fear
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    The promise of OpenClaw is an agent that can act on your
                    behalf 24/7. But with that autonomy comes a valid fear: what
                    happens if the agent misinterprets a command or is targeted
                    by a prompt injection attack? At ClawMore, we treat security
                    not as an afterthought, but as the primary constraint.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    Layer 1: Recursion & Depth Guards
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    One of the most dangerous patterns in agentic systems is
                    infinite recursion—an agent calling itself or another agent
                    in an endless loop, consuming thousands of dollars in
                    compute. ClawMore implements strict **Recursion Guards**
                    that track the depth of any agentic chain and automatically
                    terminate execution if safety thresholds are breached.
                  </p>
                </section>

                <SystemFlow
                  nodes={SECURITY_NODES}
                  edges={SECURITY_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Layer 2: VPC Isolation
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg mb-8">
                    By moving OpenClaw execution into a managed AWS environment,
                    we gain the power of **VPC Isolation**. Your agent runs in a
                    private subnet with no public ingress.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <Network className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Private Subnets
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Agents have no public IP addresses. All communication is
                        routed through secure VPC Endpoints and NAT Gateways
                        with strict outbound filtering.
                      </p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <ShieldAlert className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Egress Filtering
                      </h4>
                      <p className="text-sm text-zinc-400">
                        We use AWS Network Firewall to restrict agent
                        communication to only authorized API domains and
                        internal services.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    Managed Evolution
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Security is the foundation that allows us to offer
                    **Evolution-as-a-Service**. Once the agent is safely
                    isolated, we can let it evolve your infrastructure with
                    confidence. In our next entry, we'll explore the
                    Hub-and-Spoke architecture that makes this managed evolution
                    possible across hundreds of client accounts.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Chronicles
                </div>
                <Link
                  href="/blog/openclaw-chronicles-09-eaas"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 09 // EVOLUTION_AS_SERVICE
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          Evolution-as-a-Service: Managed Hub-and-Spoke
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
