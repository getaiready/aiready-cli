'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Hash, Zap, ChevronRight, AlertTriangle } from 'lucide-react';
import Modal from '../../../components/Modal';
import LeadForm from '../../../components/LeadForm';
import SystemFlow from '../../../components/SystemFlow';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';

const REFLECTOR_NODES = [
  {
    id: 'logs',
    data: { label: '[CLOUDWATCH_LOGS]', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'reflector',
    data: { label: '[REFLECTOR]', type: 'agent' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'gap',
    data: { label: 'GAP_IDENTIFIED', type: 'event' },
    position: { x: 400, y: -50 },
  },
  {
    id: 'scr',
    data: { label: 'SCR_TRIGGERED', type: 'bus' },
    position: { x: 400, y: 50 },
  },
  {
    id: 'architect',
    data: { label: '[ARCHITECT]', type: 'agent' },
    position: { x: 600, y: 0 },
  },
];

const REFLECTOR_EDGES = [
  {
    id: 'e1',
    source: 'logs',
    target: 'reflector',
    label: 'Monitor',
    animated: true,
  },
  {
    id: 'e2',
    source: 'reflector',
    target: 'gap',
    label: 'Analyze',
    animated: true,
  },
  {
    id: 'e3',
    source: 'gap',
    target: 'scr',
    label: 'Synthesize',
    animated: true,
  },
  {
    id: 'e4',
    source: 'scr',
    target: 'architect',
    label: 'Signal',
    animated: true,
  },
];

export default function BlogPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const apiUrl = process.env.NEXT_PUBLIC_LEAD_API_URL || '';

  const POST_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'The Reflector: Machines that Self-Critique',
    description:
      'Most AI systems wait for humans to find bugs. Claw finds them itself using autonomous Gap Detection Loops.',
    datePublished: '2026-03-28',
    author: {
      '@type': 'Organization',
      name: 'ClawMore',
    },
    image: '/blog-assets/the-reflector-self-critique.png',
    url: '/blog-assets/the-reflector-self-critique',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-purple/30 selection:text-cyber-purple font-sans">
      <JsonLd data={POST_JSON_LD} />
      <Navbar variant="post" />
      {/* Navigation */}

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
                <span>05 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              The Reflector: Machines <br />
              <span className="text-cyber-purple">that Self-Critique</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Most AI systems wait for humans to find bugs. Claw finds them
              itself using autonomous Gap Detection Loops.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/the-reflector-self-critique.png"
                alt="The Reflector: Machines that Self-Critique"
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
                  label: 'THE REFLECTOR',
                  href: '/blog/the-reflector-self-critique',
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
                    The Feedback Vacuum
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    In standard DevOps, "feedback" is a human-led process. You
                    deploy code, wait for a user to complain or a dashboard to
                    turn red, and then *you* decide what to fix. In an
                    autonomous system, this delay is a catastrophic failure.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    ClawMore eliminates this delay through **The Reflector**—a
                    dedicated agent whose only job is to watch the system fail
                    and understand why.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    Autonomous Gap Detection
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    The Reflector operates by continuously streaming CloudWatch
                    logs, performance metrics, and VPC flow logs. It doesn't
                    just look for "Errors"; it looks for **Inconsistencies**
                    between intended state and actual performance.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    When it identifies a functional gap—like a lambda reaching
                    its concurrency limit or a security group being too
                    permissive—it triggers a **Self-Correction Request (SCR)**.
                  </p>
                </section>

                <SystemFlow
                  nodes={REFLECTOR_NODES}
                  edges={REFLECTOR_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    The SCR: A Call to Mutation
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    An SCR is more than a ticket; it's a signed, technical
                    directive pulsed across the **Neural Spine**. It contains
                    the failure context, the suspected root cause, and a mandate
                    for the Architect agent to design a mutation.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <AlertTriangle className="w-3 h-3" />
                      <span>SCR_PAYLOAD_V1</span>
                    </div>
                    {`{
  "gap_id": "ERR_CONCURRENCY_403",
  "evidence": "Lambda 'process-analysis' throttled 12 times in 60s",
  "hypothesis": "Provisioned concurrency insufficient for burst load",
  "mandate": "ARCHITECT_PLAN_MUTATION"
}`}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    Engineering a Conscience
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    By giving the machine the ability to critique its own
                    execution, we transform it from a tool into a teammate. The
                    Reflector is the engine's conscience, ensuring every
                    mutation is grounded in empirical reality.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    But once a mutation is planned, how do we deploy it safely?
                    In the next post, we'll explore **SST v4 & The Coder
                    Loop**—the mechanism that closes the gap between reasoning
                    and deployment.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Cycle
                </div>
                <Link href="/blog/sst-ion-coder-loop" className="block group">
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 04 // JIT_INFRASTRUCTURE
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          SST v4 & The Coder Loop
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

      {/* Subscription Section */}
      <section className="py-24 bg-cyber-purple/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-black italic mb-6">Stay Synchronized</h3>
          <p className="text-zinc-300 mb-10 max-w-lg mx-auto text-sm">
            Join 1,200+ architects receiving autonomous mutation logs and
            technical deep dives weekly.
          </p>
          <button
            onClick={openModal}
            className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-cyber-purple transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            Join Mutation_List
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center text-zinc-700 text-[10px] font-mono uppercase tracking-[0.5em]">
          TERMINAL_LOCKED // 2026 PERPETUAL_EVOLUTION
        </div>
      </footer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LeadForm type="waitlist" onSuccess={closeModal} apiUrl={apiUrl} />
      </Modal>
    </div>
  );
}
