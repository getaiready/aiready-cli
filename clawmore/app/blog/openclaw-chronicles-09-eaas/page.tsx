'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Hash,
  ChevronRight,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Cloud,
  Network,
  Cpu,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import SystemFlow from '../../../components/SystemFlow';

const EAAS_NODES = [
  {
    id: 'hub',
    data: { label: 'ClawMore Hub (Control Plane)', type: 'bus' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'spoke1',
    data: { label: 'Client A (Spoke)', type: 'agent' },
    position: { x: 250, y: -70 },
  },
  {
    id: 'spoke2',
    data: { label: 'Client B (Spoke)', type: 'agent' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'spoke3',
    data: { label: 'Client C (Spoke)', type: 'agent' },
    position: { x: 250, y: 70 },
  },
];

const EAAS_EDGES = [
  {
    id: 'e1',
    source: 'hub',
    target: 'spoke1',
    label: 'Evolve',
    animated: true,
  },
  {
    id: 'e2',
    source: 'hub',
    target: 'spoke2',
    label: 'Evolve',
    animated: true,
  },
  {
    id: 'e3',
    source: 'hub',
    target: 'spoke3',
    label: 'Evolve',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Evolution-as-a-Service: Managed Hub-and-Spoke',
    description:
      'The architecture of managed evolution. Explaining how ClawMore uses a Hub-and-Spoke pattern to manage agentic AWS operations across multiple client accounts.',
    datePublished: '2026-04-25',
    author: {
      '@type': 'Person',
      name: 'Architect of Evolution',
    },
    image:
      'https://clawmore.getaiready.dev/blog-assets/cdk-monorepo-mastery.png',
    url: 'https://clawmore.getaiready.dev/blog/openclaw-chronicles-09-eaas',
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
                OPENCLAW_CHRONICLES // PART_09
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: eaas</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>08 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              Evolution-as-a-Service: <br />
              <span className="text-cyber-purple">Managed Hub-and-Spoke</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Managed Autonomy. How ClawMore's Hub-and-Spoke architecture
              enables a central management plane to orchestrate evolution across
              an entire empire of client accounts.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/cdk-monorepo-mastery.png"
                alt="Managed Evolution Hub-and-Spoke"
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
                  label: 'EAAS',
                  href: '/blog/openclaw-chronicles-09-eaas',
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
                    The Orchestration Trap
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    When you run a single OpenClaw agent on your laptop, it's
                    easy to manage. But when you're responsible for the
                    infrastructure of hundreds of clients, you can't manually
                    update every agent, monitor every state, or deploy every
                    skill. You need a **Management Plane**.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    Introducing the Hub-and-Spoke
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    ClawMore's core architecture is built on the
                    **Hub-and-Spoke** pattern. A central "Hub" account acts as
                    the orchestrator, while each client project exists in an
                    isolated "Spoke" account. This pattern ensures strict
                    multi-tenancy while allowing for unified orchestration.
                  </p>
                </section>

                <SystemFlow
                  nodes={EAAS_NODES}
                  edges={EAAS_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Evolution-as-a-Service (EaaS)
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg mb-8">
                    By leveraging this architecture, ClawMore offers **EaaS**.
                    The Hub account constantly scans the Spokes for
                    inefficiencies, security gaps, or opportunities for cost
                    optimization. When a "Mutation" is identified, it's pushed
                    from the Hub to the Spokes safely.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <LayoutGrid className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Fleet Orchestration
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Pushing security patches, new skills, or infrastructure
                        updates to thousands of agents simultaneously.
                      </p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                      <Cpu className="w-6 h-6 text-cyber-purple mb-4" />
                      <h4 className="font-bold mb-2 uppercase tracking-tight">
                        Isolated Evolution
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Each client's infrastructure evolves independently based
                        on their unique usage patterns and needs.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    The Economics of Autonomy
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    EaaS is not just a technical breakthrough; it's an economic
                    one. How do you price a service that autonomously improves
                    itself? In our next entry, **The Mutation Tax**, we'll dive
                    into the sustainable AI economics that power the ClawMore
                    empire.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Chronicles
                </div>
                <Link
                  href="/blog/openclaw-chronicles-10-mutation-tax"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 10 // MUTATION_TAX
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          The Mutation Tax: Sustainable AI Economics
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
