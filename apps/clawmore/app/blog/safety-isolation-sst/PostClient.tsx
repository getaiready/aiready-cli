'use client';

import { useState } from 'react';
import {
  Clock,
  Hash,
  ChevronRight,
  Lock,
  Network,
  Globe,
  AlertCircle,
} from 'lucide-react';
import Modal from '../../../components/Modal';
import LeadForm from '../../../components/LeadForm';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import Link from 'next/link';

export default function BlogPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const _openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const apiUrl = process.env.NEXT_PUBLIC_LEAD_API_URL || '';

  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Safety First: Isolating Intelligence with SST',
    description:
      'Autonomous agents need freedom to act, but within an ironclad sandbox. How we use SST and AWS Account Vending to secure the Eclawnomy.',
    datePublished: '2026-04-01',
    author: {
      '@type': 'Person',
      name: 'Minimalist Architect',
    },
    image: '/blog-assets/safety-isolation.png',
    url: '/blog/safety-isolation-sst',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-purple/30 selection:text-cyber-purple font-sans uppercase">
      <JsonLd data={BLOG_JSON_LD} />
      <Navbar variant="post" />

      <header className="py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.05)_0%,_transparent_70%)] opacity-30" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-cyber-purple font-mono text-[9px] uppercase tracking-[0.4em] font-black border border-cyber-purple/20 px-2 py-1 bg-cyber-purple/5">
                SEC_ARCH
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: iron-sandbox</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>07 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              Safety <span className="text-cyber-purple">First</span> <br />
              <span className="opacity-50 text-4xl italic lowercase font-light tracking-normal">
                Isolating Intelligence
              </span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic normal-case max-w-2xl">
              Autonomous agents need freedom to act, but within an ironclad
              sandbox. We don&apos;t just manage code; we manage the risk
              boundary of continuous evolution.
            </p>

            <div className="mt-12 bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative group">
              <img
                src="/blog-assets/safety-isolation.png"
                alt="Safety Isolation Cover"
                className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </header>

      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs
              items={[
                { label: 'BLOG', href: '/blog' },
                {
                  label: 'SAFETY ISOLATION SST',
                  href: '/blog/safety-isolation-sst',
                },
              ]}
            />

            <article className="prose prose-invert prose-zinc max-w-none normal-case">
              <section className="mt-12">
                <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4 italic uppercase">
                  <span className="text-cyber-purple font-mono text-sm not-italic">
                    {'/// 01'}
                  </span>
                  The Problem of Agentic Overreach
                </h2>
                <p className="text-zinc-200 leading-relaxed text-lg">
                  In a world of GPT-5.4 reasoning, an agent given a simple task
                  could technically expand its scope to re-architect your entire
                  VPC. Without isolation, the &quot;Eclawnomy&quot; is just a
                  high-speed accident waiting to happen.
                </p>
                <div className="my-10 p-6 bg-red-950/20 border border-red-900/40 rounded-sm">
                  <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] mb-2 uppercase">
                    <AlertCircle className="w-3 h-3" />
                    CRITICAL_RISK_DETECTED
                  </div>
                  <p className="text-sm italic">
                    Shared infrastructure = Shared blast radius. We don&apos;t
                    do that.
                  </p>
                </div>
              </section>

              <section className="mt-16">
                <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4 italic uppercase">
                  <span className="text-cyber-purple font-mono text-sm not-italic">
                    {'/// 02'}
                  </span>
                  Account Vending: The Ultimate Sandbox
                </h2>
                <p className="text-zinc-200 leading-relaxed text-lg">
                  ClawMore uses an <strong>AWS Account Vending Machine</strong>.
                  When you register a repository, we don&apos;t just create a
                  folder; we provision a entirely separate, pristine AWS
                  account.
                </p>
                <ul className="list-none space-y-4 my-8">
                  <li className="flex gap-4 items-start">
                    <Lock className="w-5 h-5 text-cyber-purple shrink-0 mt-1" />
                    <span>
                      <strong>Hard Boundaries</strong>: No cross-account
                      traffic. Ever.
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <Network className="w-5 h-5 text-cyber-purple shrink-0 mt-1" />
                    <span>
                      <strong>Ephemeral Access</strong>: Agents use short-lived
                      STS tokens that expire the moment the mutation is
                      verified.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mt-16">
                <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4 italic uppercase">
                  <span className="text-cyber-purple font-mono text-sm not-italic">
                    {'/// 03'}
                  </span>
                  SST v4: Code-Aware Security
                </h2>
                <p className="text-zinc-200 leading-relaxed text-lg">
                  By using <strong>SST v4</strong> (our preferred framework for{' '}
                  <em>serverlessclaw</em>), our security policies are literally
                  woven into the infrastructure code. We define the
                  &quot;Minimum viable permission&quot; for every agent role
                  programmatically.
                </p>
              </section>

              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Mutation_Log
                </div>
                <Link
                  href="/blog/harvester-collective-intelligence"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 03 // COLLECTIVE_REASON
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors uppercase">
                          The Harvester: Collective Intelligence
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
          TERMINAL_LOCKED // 2026 MUTATION_LOG
        </div>
      </footer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LeadForm type="waitlist" onSuccess={closeModal} apiUrl={apiUrl} />
      </Modal>
    </div>
  );
}
