'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Hash,
  ChevronRight,
  Box,
  ShieldCheck,
} from 'lucide-react';
import Modal from '../../../components/Modal';
import LeadForm from '../../../components/LeadForm';
import SystemFlow from '../../../components/SystemFlow';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';

const CDK_NODES = [
  {
    id: 'monorepo',
    data: { label: 'NPM_WORKSPACES_ROOT', type: 'bus' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'gateway',
    data: { label: 'GATEWAY_PACKAGE', type: 'agent' },
    position: { x: 250, y: -50 },
  },
  {
    id: 'core',
    data: { label: 'CORE_ENGINE_PACKAGE', type: 'agent' },
    position: { x: 250, y: 50 },
  },
  {
    id: 'cdk',
    data: { label: 'AWS_CDK_BLUEPRINT', type: 'bus' },
    position: { x: 500, y: 0 },
  },
  {
    id: 'cloud',
    data: { label: '[AWS_REGION_TARGET]', type: 'agent' },
    position: { x: 750, y: 0 },
  },
];

const CDK_EDGES = [
  {
    id: 'e1',
    source: 'monorepo',
    target: 'gateway',
    label: 'Export',
    animated: true,
  },
  {
    id: 'e2',
    source: 'monorepo',
    target: 'core',
    label: 'Export',
    animated: true,
  },
  {
    id: 'e3',
    source: 'gateway',
    target: 'cdk',
    label: 'Define',
    animated: true,
  },
  { id: 'e4', source: 'core', target: 'cdk', label: 'Define', animated: true },
  {
    id: 'e5',
    source: 'cdk',
    target: 'cloud',
    label: 'Deploy',
    animated: true,
    style: { stroke: '#00e0ff' },
  },
];

export default function BlogPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const _openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const apiUrl = process.env.NEXT_PUBLIC_LEAD_API_URL || '';

  const POST_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Infrastructure as Code: CDK Monorepo Mastery',
    description:
      'Organizing a complex AI backbone into a single, deployable blueprint. How we use AWS CDK and npm workspaces to manage the serverlessclaw monorepo.',
    datePublished: '2026-03-22',
    author: {
      '@type': 'Organization',
      name: 'ClawMore',
    },
    image: '/blog-assets/cdk-monorepo-mastery.png',
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
                INFRA_AS_CODE
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: cdk-master</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>06 MIN READ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic leading-[1.1]">
              Infrastructure as Code: <br />
              <span className="text-cyber-purple">CDK Monorepo Mastery</span>
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
              Organizing a complex AI backbone into a single, deployable
              blueprint. How we use AWS CDK and npm workspaces to manage the
              serverlessclaw monorepo.
            </p>

            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden border border-white/10 rounded-sm group">
              <img
                src="/blog-assets/cdk-monorepo-mastery.png"
                alt="Infrastructure as Code: CDK Monorepo Mastery"
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
                  label: 'CDK MONOREPO MASTERY',
                  href: '/blog/cdk-monorepo-mastery',
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
                    The Complexity Problem
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    A system like `serverlessclaw` isn't just a single script.
                    It's a collection of Lambda functions, Fargate tasks,
                    DynamoDB tables, S3 buckets, and IAM roles. Manually
                    configuring these in the AWS Console is a recipe for
                    disaster.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    We needed a way to version our infrastructure alongside our
                    code. We chose the **AWS CDK** (Cloud Development Kit) to
                    treat our cloud architecture as a software library.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      02
                    </span>
                    The Monorepo Blueprint
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    By using **npm workspaces**, we organize the engine into
                    discrete, reusable packages. The `gateway` handles inbound
                    signals, the `core` manages reasoning, and the `infra`
                    package contains the CDK stacks that tie it all together.
                  </p>
                </section>

                <SystemFlow
                  nodes={CDK_NODES}
                  edges={CDK_EDGES}
                  height="350px"
                />

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      03
                    </span>
                    TypeScript End-to-End
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    One of the biggest advantages of our setup is **Type
                    Safety**. Because both our application code and our
                    infrastructure are written in TypeScript, we can share types
                    between the two. When we update a DynamoDB table schema in
                    our CDK stack, the application code immediately knows about
                    it.
                  </p>
                  <div className="mt-8 p-6 bg-zinc-900/50 border border-white/10 rounded-sm font-mono text-[11px] text-zinc-200">
                    <div className="flex items-center gap-2 text-cyber-purple mb-2">
                      <Box className="w-3 h-3" />
                      <span>CLAW_BLUEPRINT.ts</span>
                    </div>
                    {`// Defining the Neural Spine in CDK
export class ClawSpineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bus = new events.EventBus(this, 'NeuralBus');
    const table = new dynamodb.Table(this, 'TaskState', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Link everything to the Fargate reasoning engine
    new ClawFargateEngine(this, 'Engine', { bus, table });
  }
}`}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
                    <span className="text-cyber-purple font-mono text-sm">
                      04
                    </span>
                    The Series Finale
                  </h2>
                  <p className="text-zinc-200 leading-relaxed text-lg">
                    This concludes our 10-part deep dive into the **Reflective
                    Neural Journal**. From the philosophy of mutable logic to
                    the mastery of CDK deployment, we hope this series has
                    provided a clear blueprint for the future of autonomous
                    infrastructure.
                  </p>
                  <p className="text-zinc-200 leading-relaxed text-lg mt-6">
                    The code is open. The architecture is proven. The only thing
                    missing is your first mutation.
                  </p>
                </section>
              </div>

              {/* Series Navigation */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-8">
                  Restart_Evolutionary_Cycle
                </div>
                <Link
                  href="/blog/death-of-the-transient-agent"
                  className="block group"
                >
                  <div className="glass-card p-8 flex items-center justify-between hover:border-cyber-purple/30 transition-all bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple border border-cyber-purple/20">
                        <ArrowLeft className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-cyber-purple uppercase tracking-widest mb-1">
                          PART 01 // CORE_CONCEPTS
                        </div>
                        <div className="text-2xl font-black italic group-hover:text-white transition-colors">
                          The Death of the Transient Agent
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
                  <span>ALL_MODULES_SYNCHRONIZED // 10/10</span>
                </div>
                <h3 className="text-3xl font-black italic mb-8 text-white">
                  The Journey Begins Here
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href="https://github.com/serverlessclaw/serverlessclaw"
                    className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-cyber-blue transition-all"
                  >
                    Fork the Repository
                  </Link>
                  <Link
                    href="/blog"
                    className="px-10 py-4 border border-white/20 font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all backdrop-blur-md"
                  >
                    Back to Journal Index
                  </Link>
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
        <LeadForm type="waitlist" onSuccess={closeModal} apiUrl={apiUrl} />
      </Modal>
    </div>
  );
}
