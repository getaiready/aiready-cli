'use client';

import Link from 'next/link';
import { Clock, Hash, ChevronRight, ShieldCheck, Globe } from 'lucide-react';
import SystemFlow from '../../../components/SystemFlow';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';

const SECURE_NODES = [
  {
    id: 'agent-request',
    data: { label: 'AGENT REQUEST', type: 'event' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'account-vending',
    data: { label: 'AWS ACCOUNT VENDING', type: 'bus' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'isolated-sandbox',
    data: { label: 'ISOLATED SANDBOX', type: 'agent' },
    position: { x: 500, y: 0 },
  },
  {
    id: 'scp-guard',
    data: { label: 'SCP GOVERNANCE', type: 'event' },
    position: { x: 500, y: 100 },
  },
];

const SECURE_EDGES = [
  {
    id: 'e1',
    source: 'agent-request',
    target: 'account-vending',
    label: 'Trigger',
    animated: true,
  },
  {
    id: 'e2',
    source: 'account-vending',
    target: 'isolated-sandbox',
    label: 'Provision',
    animated: true,
  },
  {
    id: 'e3',
    source: 'isolated-sandbox',
    target: 'scp-guard',
    label: 'Enforce',
  },
];

export default function BlogPost() {
  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'The Account Vending Secret',
    description:
      'Why container isolation is not enough for untrusted intelligence. How ClawMore uses AWS Account Vending to create perfect zero-trust boundaries.',
    datePublished: '2026-03-28',
    author: {
      '@type': 'Person',
      name: 'Eclawnomist',
    },
    image: '/blog-assets/account-vending-secret.png',
    url: '/blog/account-vending-secret',
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
                MUTATION_LOG_003
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: accountvending</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>07 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              The Account <br />
              <span className="text-cyber-purple">Vending Secret</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Container isolation is dead. Long live the AWS Account Boundary.
              Learn why true agentic safety requires a whole new dimension of
              security.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/account-vending-secret.png"
                alt="Account Vending Secret"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
                  label: 'ACCOUNT VENDING',
                  href: '/blog/account-vending-secret',
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
                    The Container Illusion
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    In the traditional DevOps world, Docker containers provide
                    &quot;good enough&quot; isolation. But agents aren&apos;t
                    traditional workers. They are probabilistic engines that can
                    find and exploit even the smallest kernel leaks or
                    side-channel vulnerabilities.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    <strong>Zero-Trust Architecture</strong> for agents means
                    assuming the agent _will_ try to exceed its bounds.
                  </p>
                </section>

                <SystemFlow
                  nodes={SECURE_NODES}
                  edges={SECURE_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    AWS Account Vending
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    At ClawMore, we don&apos;t just run containers. We use **AWS
                    Organizations** to programmatically &quot;vend&quot; a brand
                    new, isolated AWS account for every single client. This
                    provides a hard, hardware-level boundary that no agent (no
                    matter how smart) can cross.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <ShieldCheck className="w-3 h-3" />
                      <span>SECURITY_PROTOCOL_ENFORCEMENT.yaml</span>
                    </div>
                    {`isolationUnits:
  - type: AWS_ACCOUNT
    boundaries: HARD_ORGANIZATION_OU
    network: ZERO_EXIT_VPC
    governance: SERVERLESS_ONLY_SCP
  - type: AGENT_SANDBOX
    runtime: AWS_LAMBDA_ISOLATED
    maxExecutionTime: 300s
    dataAccess: ROLE_BASED_ONLY`}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    SCP Governance
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    Once the account is created, we apply{' '}
                    <strong>Service Control Policies (SCPs)</strong> that
                    prevent the agent from even <em>seeing</em> services it
                    doesn&apos;t need. No EC2, no IAM modification, no public S3
                    access. It&apos;s a prison cells made of code, designed to
                    keep your private data safe while letting the agent work.
                  </p>
                </section>
              </div>

              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Up_Next_In_The_Mutation_Diaries
                </div>
                <Link href="/blog/co-evolution-win" className="block group">
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 04 // NETWORK_INTELLIGENCE
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          The Co-evolution Win: Building the Eclawnomy
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
          SECURITY_LOCKED // 2026 PERPETUAL_EVOLUTION
        </div>
      </footer>
    </div>
  );
}
