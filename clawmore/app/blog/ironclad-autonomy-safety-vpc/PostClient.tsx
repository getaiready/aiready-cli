'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ShieldCheck,
  Zap,
  ChevronRight,
  Lock,
} from 'lucide-react';
import Modal from '../../../components/Modal';
import LeadForm from '../../../components/LeadForm';
import SystemFlow from '../../../components/SystemFlow';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';

const SAFETY_NODES = [
  {
    id: 'mutation',
    data: { label: '[MUTATION_INTENT]', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'guard',
    data: { label: 'RECURSION_GUARD', type: 'bus' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'approval',
    data: { label: 'HUMAN_GATE (IF_HIGH_RISK)', type: 'agent' },
    position: { x: 450, y: -50 },
  },
  {
    id: 'vpc',
    data: { label: 'VPC_ISOLATION_ZONE', type: 'bus' },
    position: { x: 450, y: 50 },
  },
  {
    id: 'aws',
    data: { label: '[SECURE_AWS_TARGET]', type: 'agent' },
    position: { x: 700, y: 0 },
  },
];

const SAFETY_EDGES = [
  {
    id: 'e1',
    source: 'mutation',
    target: 'guard',
    label: 'Check Limit',
    animated: true,
  },
  {
    id: 'e2',
    source: 'guard',
    target: 'approval',
    label: 'Escalate',
    animated: true,
  },
  {
    id: 'e3',
    source: 'guard',
    target: 'vpc',
    label: 'Execute',
    animated: true,
  },
  {
    id: 'e4',
    source: 'approval',
    target: 'vpc',
    label: 'Approve',
    animated: true,
  },
  { id: 'e5', source: 'vpc', target: 'aws', label: 'Deploy', animated: true },
];

export default function BlogPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const apiUrl = process.env.NEXT_PUBLIC_LEAD_API_URL || '';

  const POST_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Ironclad Autonomy: Safety & VPCs',
    description:
      '"What if it deletes my production database?" Explaining our multi-layered approach to recursion guards and context isolation.',
    datePublished: '2026-03-18',
    author: {
      '@type': 'Organization',
      name: 'ClawMore',
    },
    image: '/blog-assets/ironclad-autonomy-safety-vpc.png',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-purple/30 selection:text-cyber-purple font-sans">
      <JsonLd data={POST_JSON_LD} />
      <Navbar variant="post" />

      {/* Article Header */}
      <header className="py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(188,0,255,0.05)_0%,_transparent_70%)] opacity-30" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-cyber-purple font-mono text-[9px] uppercase tracking-[0.4em] font-black border border-cyber-purple/20 px-2 py-1 bg-cyber-purple/5">
                SAFETY_GUARDS
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: bd95a79</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>06 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              Ironclad Autonomy: <br />
              <span className="text-cyber-purple">Safety & VPCs</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              "What if it deletes my production database?" Explaining our
              multi-layered approach to recursion guards and context isolation.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/ironclad-autonomy-safety-vpc.png"
                alt="Ironclad Autonomy: Safety & VPCs"
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
                  label: 'IRONCLAD AUTONOMY',
                  href: '/blog/ironclad-autonomy-safety-vpc',
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
                    The Fear of the Runaway Loop
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    The biggest challenge in autonomous infrastructure isn't
                    intelligence—it's **Control**. If an agent identifies a gap
                    and attempts a mutation that introduces a new gap, you risk
                    a "Recursion Storm" where the machine burns your AWS budget
                    in a circular attempt to fix itself.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    ClawMore solves this through three non-negotiable safety
                    layers: Recursion Guards, Approval Gates, and VPC Isolation.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The Recursion Guard
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Every mutation event is tracked by a global limiter. The
                    **Recursion Guard** monitors the depth and frequency of
                    mutations per resource. If the engine attempts to mutate the
                    same Lambda function more than 3 times in a 60-minute
                    window, the guard pulses a `HALT_AND_REFLECT` event, locking
                    the resource until a human intervenes.
                  </p>
                </section>

                <SystemFlow
                  nodes={SAFETY_NODES}
                  edges={SAFETY_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Context Isolation (BYOC)
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    With **Bring Your Own Cloud (BYOC)**, the engine's execution
                    weights are kept within your own VPC. We use strict IAM
                    boundaries and VPC endpoints to ensure that the agent can
                    only "see" and "mutate" the resources you have explicitly
                    whitelisted.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <Lock className="w-3 h-3" />
                      <span>BOUNDARY_POLICY.json</span>
                    </div>
                    {`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": ["rds:DeleteDBInstance", "s3:DeleteBucket"],
      "Resource": "*",
      "Condition": {"Bool": {"aws:MultiFactorAuthPresent": "false"}}
    }
  ]
}`}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    The Future of Autonomous Ops
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Autonomous infrastructure is no longer a science fiction
                    concept. By combining mutable logic state, an event-driven
                    neural spine, and empirical reflection loops,
                    `serverlessclaw` provides a blueprint for systems that don't
                    just run—they evolve.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    The Mutation Cycle is complete. We invite you to fork the
                    repository, deploy your own Community Node, and watch your
                    infrastructure learn to walk.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Begin_Next_Series_Cycle
                </div>
                <Link href="/blog/one-dollar-ai-agent" className="block group">
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 06 // AGENT_ORCHESTRATION
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          The $1/Month AI Agent
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-zinc-700 group-hover:text-cyber-purple group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>

              {/* Series Completion */}
              <div className="mt-24 pt-12 border-t border-white/5 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple text-[10px] font-mono uppercase tracking-[0.3em] mb-8">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Series_Complete // Logic_Synchronized</span>
                </div>
                <h3 className="text-3xl font-black italic mb-8 text-white">
                  Ready to Evolve?
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href="https://github.com/serverlessclaw/serverlessclaw"
                    className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-cyber-blue transition-all"
                  >
                    Deploy OSS Node
                  </Link>
                  <button
                    onClick={openModal}
                    className="px-10 py-4 border border-white/20 font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all backdrop-blur-md"
                  >
                    Request Managed Beta
                  </button>
                </div>
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LeadForm type="beta" onSuccess={closeModal} apiUrl={apiUrl} />
      </Modal>
    </div>
  );
}
