'use client';

import Link from 'next/link';
import { Clock, Hash, ChevronRight, Zap, Users } from 'lucide-react';
import SystemFlow from '../../../components/SystemFlow';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';

const NETWORK_NODES = [
  {
    id: 'spoke-1',
    data: { label: 'SPOKE A (Innovation)', type: 'agent' },
    position: { x: 0, y: -50 },
  },
  {
    id: 'harvester',
    data: { label: 'THE HARVESTER', type: 'bus' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'hub',
    data: { label: 'THE HUB (Collective Intelligence)', type: 'event' },
    position: { x: 500, y: 0 },
  },
  {
    id: 'spoke-2',
    data: { label: 'SPOKE B (Evolution)', type: 'agent' },
    position: { x: 750, y: 50 },
  },
];

const NETWORK_EDGES = [
  {
    id: 'e1',
    source: 'spoke-1',
    target: 'harvester',
    label: 'Identify Pattern',
    animated: true,
  },
  {
    id: 'e2',
    source: 'harvester',
    target: 'hub',
    label: 'Promote',
    animated: true,
  },
  {
    id: 'e3',
    source: 'hub',
    target: 'spoke-2',
    label: 'Broadcast',
    animated: true,
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'The Co-evolution Win: Building the Eclawnomy',
    description:
      'How collective intelligence is the ultimate moat. joining the Eclawnomy ecosystem means your optimizations evolve the entire network.',
    datePublished: '2026-03-29',
    author: {
      '@type': 'Person',
      name: 'Eclawnomist',
    },
    image: '/blog-assets/co-evolution-win.png',
    url: '/blog/co-evolution-win',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-purple/30 selection:text-cyber-purple font-sans">
      <JsonLd data={BLOG_JSON_LD} />
      <Navbar variant="post" />

      <header className="py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(188,0,255,0.05)_0%,_transparent_70%)] opacity-30" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-cyber-purple font-mono text-[9px] uppercase tracking-[0.4em] font-black border border-cyber-purple/20 px-2 py-1 bg-cyber-purple/5">
                MUTATION_LOG_004
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: coevolution</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>06 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              The Co-evolution <br />
              <span className="text-cyber-purple">Win Logic</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Individual innovation is a local maximum. Networked evolution is a
              global breakout. Welcome to the Eclawnomy ecosystem.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/co-evolution-win.png"
                alt="Co-evolution Win"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs
              items={[
                { label: 'BLOG', href: '/blog' },
                {
                  label: 'CO-EVOLUTION WIN',
                  href: '/blog/co-evolution-win',
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
                    The Loneliness of Innovation
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    In the traditional tech stack, every company solves the same
                    90% of architectural problems in isolation. We all write the
                    same auth loops, the same retry logic, and the same data
                    transformations. This is massive, systemic waste.
                  </p>
                </section>

                <SystemFlow
                  nodes={NETWORK_NODES}
                  edges={NETWORK_EDGES}
                  height="400px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The Harvester Protocol
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    ClawMore introduces <strong>The Harvester</strong>. This is
                    an autonomous agent that observes mutations across the
                    entire Hub. When it identifies a high-value pattern in one
                    &quot;Spoke&quot; (a specific client project), it abstracts
                    that pattern (stripping all private IP and data) and
                    promotes it to the central <strong>Hub</strong>.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm">
                    <div className="flex items-center gap-2 text-cyber-purple mb-4">
                      <Zap className="w-4 h-4" />
                      <span className="font-mono text-[10px] uppercase tracking-widest">
                        Network_Intelligence_Log
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 italic font-light">
                      &quot;When Spoke A solves for a 50% reduction in Lambda
                      cold starts, every other Spoke on the network receives
                      that optimization via the next `make sync`. Global
                      intelligence scales at the speed of the fastest
                      innovator.&quot;
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Joining the Collective
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Joining the Eclawnomy isn&apos;t just about using a tool;
                    it&apos;s about building an ecosystem of well-maintained and
                    ever-evolving agents. By choosing to co-evolve, you lower
                    your own Mutation Tax to $0.00 and benefit from the
                    collective research and development of thousands of other
                    firms.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    <strong>The Eclawnomy is the ultimate moat.</strong>
                  </p>
                </section>
              </div>

              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Mutation_Diaries
                </div>
                <Link href="/blog/department-claws" className="block group">
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 05 // AUTONOMOUS_WORKSPACE
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          The Department Claws: Command Your Own CRM, HR, &
                          Finance
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

      <footer className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center text-zinc-700 text-[10px] font-mono uppercase tracking-[0.5em]">
          INTELLIGENCE_LOCKED // 2026 PERPETUAL_EVOLUTION
        </div>
      </footer>
    </div>
  );
}
