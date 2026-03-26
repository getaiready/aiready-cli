'use client';

import Link from 'next/link';
import {
  Clock,
  Hash,
  Users,
  DollarSign,
  Zap,
  Cpu,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'The Department Claws: Your Autonomous Workspace',
    description:
      'The vision of a self-managed firm. How specialized Claws enable you to command your own HR, CRM, Accounting, and Law departments autonomously.',
    datePublished: '2026-03-30',
    author: {
      '@type': 'Person',
      name: 'Eclawnomist',
    },
    image: '/blog-assets/department-claws.png',
    url: '/blog/department-claws',
  };

  const departments = [
    {
      icon: <Users />,
      label: 'HR_CLAW',
      desc: 'Automatic resume screening and interview scheduling.',
    },
    {
      icon: <DollarSign />,
      label: 'FINANCE_CLAW',
      desc: 'Real-time bookkeeping and payroll optimization.',
    },
    {
      icon: <Hash />,
      label: 'CRM_CLAW',
      desc: 'Lead tracking and automatic follow-ups.',
    },
    {
      icon: <Zap />,
      label: 'ERP_CLAW',
      desc: 'Inventory management and supply chain sync.',
    },
    {
      icon: <Cpu />,
      label: 'DEVOPS_CLAW',
      desc: 'Self-healing infrastructure and security audits.',
    },
    {
      icon: <ShieldCheck />,
      label: 'LAW_CLAW',
      desc: 'Contract review and compliance monitoring.',
    },
  ];

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
                MUTATION_LOG_005
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: deptclaws</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>10 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              The Department <br />
              <span className="text-cyber-purple">Claw Vision</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Don&apos;t just build a tool. Command an empire. Welcome to the
              autonomous workspace of 2026.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/department-claws.png"
                alt="Department Claws"
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
                  label: 'DEPARTMENT CLAWS',
                  href: '/blog/department-claws',
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
                    The Multi-Claw Workspace
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    If you&apos;ve followed our Mutation Diaries, you&apos;ve
                    seen individual Claws refactor code, audit costs, and secure
                    networks. But the true power of the Eclawnomy is the{' '}
                    <strong>Swarm</strong>—multiple Claws working in parallel
                    across your entire business.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                  {departments.map((dept, idx) => (
                    <div
                      key={idx}
                      className="p-8 border border-white/5 bg-white/[0.01] hover:border-cyber-purple/20 transition-all group"
                    >
                      <div className="text-cyber-purple mb-4 group-hover:scale-110 transition-transform origin-left">
                        {dept.icon}
                      </div>
                      <div className="text-[10px] font-mono font-black tracking-[0.3em] mb-2">
                        {dept.label}
                      </div>
                      <p className="text-sm text-zinc-400 italic">
                        {dept.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    Command & Control
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    In this autonomous workspace, you aren&apos;t a
                    &quot;Manager;&quot; you are an{' '}
                    <strong>Orchestrator</strong>. Your job is to define the
                    Goals, provide the Context (via AIReady), and approve the
                    final Mutations.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    The &quot;IT Department&quot; is no longer a cost center.
                    It&apos;s <strong>a dashboard of results.</strong>
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    Final Thoughts: The Perpetual Evolution
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    The Eclawnomy isn&apos;t about replacing humans. It&apos;s
                    about removing the drudgery that makes us unhappy and
                    inefficient. By delegating the &quot;unthinking&quot; parts
                    of our work to a swarm of intelligent, $1.00 Claws, we
                    reclaim our time for high-value strategy and creative
                    breakthroughs.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6 font-black italic text-cyber-purple">
                    Welcome to the final stage of your evolution.
                  </p>
                </section>
              </div>

              <div className="mt-24 pt-12 border-t border-white/5 text-center">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  SERIES_COMPLETE // HUB_READY
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-cyber-purple text-black font-black italic uppercase text-xs tracking-widest hover:bg-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Return to Hub
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <footer className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center text-zinc-700 text-[10px] font-mono uppercase tracking-[0.5em]">
          PERPETUAL_EVOLUTION // 2026
        </div>
      </footer>
    </div>
  );
}
