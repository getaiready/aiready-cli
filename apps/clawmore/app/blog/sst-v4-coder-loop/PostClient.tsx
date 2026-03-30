'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Hash, ShieldCheck, ChevronRight, Code } from 'lucide-react';
import Modal from '../../../components/Modal';
import LeadForm from '../../../components/LeadForm';
import SystemFlow from '../../../components/SystemFlow';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';

const CODER_NODES = [
  {
    id: 'architect',
    data: { label: '[ARCHITECT]', type: 'agent' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'patch',
    data: { label: 'PATCH_V4.2_SYNTHESIZED', type: 'event' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'coder',
    data: { label: '[CODER]', type: 'agent' },
    position: { x: 400, y: 0 },
  },
  {
    id: 'sst',
    data: { label: 'SST_V4_DEPLOYER', type: 'bus' },
    position: { x: 600, y: 0 },
  },
  {
    id: 'aws',
    data: { label: '[AWS_INFRASTRUCTURE]', type: 'agent' },
    position: { x: 800, y: 0 },
  },
];

const CODER_EDGES = [
  {
    id: 'e1',
    source: 'architect',
    target: 'patch',
    label: 'Plan',
    animated: true,
  },
  {
    id: 'e2',
    source: 'patch',
    target: 'coder',
    label: 'Ingest',
    animated: true,
  },
  { id: 'e3', source: 'coder', target: 'sst', label: 'Mutate', animated: true },
  { id: 'e4', source: 'sst', target: 'aws', label: 'Deploy', animated: true },
];

export default function BlogPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const apiUrl = process.env.NEXT_PUBLIC_LEAD_API_URL || '';

  const POST_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'SST v4 & The Coder Loop',
    description:
      'Closing the gap between LLM reasoning and Pulumi-based deployment. How we achieve sub-second infrastructure mutations.',
    datePublished: '2026-03-24',
    author: {
      '@type': 'Organization',
      name: 'ClawMore',
    },
    image: '/blog-assets/sst-v4-coder-loop.png',
    url: '/blog/sst-v4-coder-loop',
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
                JIT_INFRASTRUCTURE
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: a2eb83b</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>07 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              SST v4 & The <br />
              <span className="text-cyber-purple">Coder Loop</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Closing the gap between LLM reasoning and Pulumi-based deployment.
              How we achieve sub-second infrastructure mutations.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/sst-v4-coder-loop.png"
                alt="SST v4 & The Coder Loop"
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
                  label: 'SST V4 & THE CODER LOOP',
                  href: '/blog/sst-v4-coder-loop',
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
                    Reasoning is Not Deployment
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Generating a Terraform snippet is easy. Ensuring that
                    snippet is valid, syntactically correct, and compatible with
                    your existing stack is where 99% of AI automation fails.
                    Most systems are "opinionated but unverified"—they hope for
                    the best and leave the human to clean up the mess.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    In `serverlessclaw`, we treat deployment as a first-class
                    citizen of the reasoning process. The engine doesn't just
                    "think" about infra; it executes it via **The Coder Loop**.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The JIT Infrastructure Engine
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    We chose **SST v4** (built on Pulumi) because it allows for
                    Just-In-Time (JIT) infrastructure mutations. Unlike
                    traditional IaC tools that require slow planning phases, SST
                    v4 gives the Coder agent the ability to define and deploy
                    resources in a sub-second loop.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    When the Architect pulses a `PATCH_PLANNED` event, the Coder
                    agent ingests the intent and translates it into
                    TypeScript-based infrastructure code.
                  </p>
                </section>

                <SystemFlow
                  nodes={CODER_NODES}
                  edges={CODER_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Verified Mutation (The Coder Gate)
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    The Coder doesn't just push code. It runs a local synthesis
                    check to ensure the SST v4 definition is valid. If the
                    synthesis fails, the Coder emits a `REASONING_ERROR` back to
                    the neural spine, triggering a reflection loop for the
                    Architect to try again.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <Code className="w-3 h-3" />
                      <span>CODER_MUTATION_LOG.ts</span>
                    </div>
                    {`// Synthesizing JIT Concurrency Scaling...
const api = new sst.aws.ApiGatewayV2("MyApi");
api.route("POST /submit", {
  handler: "api/handler.handler",
  transform: {
    function: {
      reservedConcurrency: 100 // Mutated from 10 via Reflector SCR
    }
  }
});
// synthesis status: VALIDATED_OK
// executing: sst deploy --stage production`}
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
                    Of course, giving a machine the keys to your AWS account is
                    terrifying. That's why every Coder Loop is wrapped in
                    **Recursion Guards**.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    In our final post, we'll explore **Ironclad Autonomy**—how
                    we use VPC isolation and mutation limiters to ensure the
                    engine never "runs away" with your budget or your data.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Cycle
                </div>
                <Link
                  href="/blog/ironclad-autonomy-safety-vpc"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 05 // SAFETY_GUARDS
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          Ironclad Autonomy: Safety & VPCs
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
