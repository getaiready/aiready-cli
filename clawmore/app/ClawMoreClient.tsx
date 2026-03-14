'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Zap,
  RefreshCcw,
  ShieldCheck,
  Cpu,
  GitBranch,
  Globe,
  MessageSquare,
  ArrowRight,
  Code,
  Terminal,
  Layers,
  Activity,
} from 'lucide-react';
import Modal from '../components/Modal';
import LeadForm from '../components/LeadForm';
import Navbar from '../components/Navbar';
import FAQ from '../components/FAQ';
import JsonLd from '../components/JsonLd';

interface ClawMoreClientProps {
  apiUrl: string;
  dict?: any;
}

const CLAW_MORE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ClawMore',
  description: 'Autonomous Infrastructure Evolution for AWS',
  applicationCategory: 'DevOpsApplication',
  operatingSystem: 'AWS',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Perpetual Evolution',
  },
};
export default function ClawMoreClient({ apiUrl, dict }: ClawMoreClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'beta' | 'waitlist'>('beta');

  const openModal = (type: 'beta' | 'waitlist') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Fallback to static strings if dict is not yet updated for everything
  const FAQ_ITEMS = [
    {
      question: dict.faq?.q1 || 'What exactly is ClawMore?',
      answer:
        dict.faq?.a1 ||
        'ClawMore is an autonomous agentic system built for AWS. Unlike standard AI assistants that just provide code snippets, ClawMore interprets your intent, designs infrastructure mutations, and persists them directly to your source control using SST Ion.',
    },
    {
      question: dict.faq?.q2 || 'How does the Autonomous Evolution loop work?',
      answer:
        dict.faq?.a2 ||
        'It uses a "Reflector" agent that monitors system logs and performance. When it detects a gap or opportunity for optimization, it triggers a Self-Correction Request (SCR). An "Architect" then designs a patch, and a "Coder" executes the mutation via Git.',
    },
    {
      question:
        dict.faq?.q3 || 'Is it safe to give ClawMore access to my AWS account?',
      answer:
        dict.faq?.a3 ||
        'Yes. ClawMore uses "Bring Your Own Cloud" (BYOC) architecture. It runs within your own VPC with strict IAM boundaries and Recursion Guards that prevent runaway mutations. You maintain full control over approval gates for high-risk changes.',
    },
    {
      question: dict.faq?.q4 || 'What is the "Evolution Tax"?',
      answer:
        dict.faq?.a4 ||
        'We align our success with yours. For the managed version, you pay a flat monthly fee plus $1 per successful mutation—an autonomous commit that passes all your CI/CD gates. If your system is stagnant, you pay zero for mutations.',
    },
    {
      question: dict.faq?.q5 || 'How do I get started for free?',
      answer:
        dict.faq?.a5 ||
        'The Community Node is 100% open source and free forever. You can fork the repository, deploy it to your own AWS account, and start using the core autonomous engine today.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-blue/30 selection:text-cyber-blue font-sans text-left">
      <JsonLd data={CLAW_MORE_JSON_LD} />
      <Navbar dict={dict} />

      <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5 isolate py-20">
        {/* Cinematic Background Image - STACKING FIX & MAXIMUM IMPACT */}
        <div className="absolute inset-0 -z-10 bg-[#0a0a0a]">
          <Image
            src="/hero.png"
            alt="Hero Background"
            fill
            className="object-cover blur-[1px] brightness-[0.65] saturate-[0.8]"
            priority
          />
          {/* Subtle Vignette to protect text while keeping edges vibrant */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(10,10,10,0.6)_40%,_#0a0a0a_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-80" />
        </div>

        <div className="container mx-auto px-4 relative flex flex-col items-center text-center -mt-20">
          {/* Intensified Lighting Halo to lift content from background */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(0,224,255,0.15)_0%,_transparent_70%)] blur-3xl opacity-50" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border border-cyber-blue/40 bg-cyber-blue/10 text-cyber-blue text-[10px] font-mono uppercase tracking-[0.3em] mb-12 shadow-[0_0_30px_rgba(0,224,255,0.15)] backdrop-blur-sm">
            <Activity className="w-3 h-3" />
            <span>{dict.hero.badge}</span>
          </div>

          {/* Cache-buster: v2-gradient */}
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 bg-gradient-to-r from-[#00e0ff] to-[#bc00ff] bg-clip-text text-transparent leading-[1.2] pb-4 drop-shadow-[0_10px_60px_rgba(0,0,0,1)]">
            {dict.hero.title1}
            <br />
            <span className="italic">{dict.hero.title2}</span>{' '}
            {dict.hero.title3}
          </h1>

          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-14 leading-relaxed font-light drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
            {dict.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link
              href="https://github.com/caopengau/serverlessclaw"
              className="px-12 py-5 rounded-sm bg-white text-black hover:bg-cyber-blue transition-all font-black uppercase tracking-widest flex items-center gap-3 group shadow-[0_0_50px_rgba(255,255,255,0.2)] text-center"
            >
              {dict.common.startFree}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => openModal('beta')}
              className="px-12 py-5 rounded-sm border border-white/20 bg-white/5 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[14px] backdrop-blur-md"
            >
              {dict.common.managedBetaAccess}
            </button>
          </div>
        </div>
      </section>

      {/* Lead Generation Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LeadForm
          type={modalType}
          onSuccess={closeModal}
          apiUrl={apiUrl}
          dict={dict}
        />
      </Modal>

      {/* Core Pillars */}
      <section className="py-24 relative" id="features">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent,_rgba(0,255,163,0.02),_transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 hover:border-cyber-blue/30 transition-all group">
              <div className="w-14 h-14 rounded-sm bg-cyber-blue/10 flex items-center justify-center text-cyber-blue mb-8 border border-cyber-blue/20 group-hover:scale-110 transition-transform">
                <RefreshCcw className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                {dict.pillars.autonomous.title}
              </h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                {dict.pillars.autonomous.desc}
              </p>
            </div>

            <div className="glass-card p-10 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 rounded-sm bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                {dict.pillars.neural.title}
              </h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                {dict.pillars.neural.desc}
              </p>
            </div>

            <div className="glass-card p-10 hover:border-cyber-purple/30 transition-all group">
              <div className="w-14 h-14 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple mb-8 border border-cyber-purple/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                {dict.pillars.byoc.title}
              </h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                {dict.pillars.byoc.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evolution Loop Visual */}
      <section
        className="py-24 bg-black/40 border-y border-white/5 relative overflow-hidden"
        id="evolution"
      >
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <div className="text-cyber-blue font-mono text-[10px] uppercase tracking-[0.4em] mb-4">
                {dict.evolution.visualizer}
              </div>
              <h2 className="text-5xl font-black mb-8 tracking-tighter italic">
                {dict.evolution.title}
              </h2>
              <p className="text-zinc-400 mb-10 leading-relaxed text-lg font-light">
                {dict.evolution.desc}
              </p>

              <div className="space-y-4">
                {dict.evolution.steps.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-6 p-5 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="text-zinc-600 font-mono text-sm group-hover:text-cyber-blue transition-colors">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="font-black text-xs uppercase tracking-widest mb-1">
                        {item.label}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono tracking-tight">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative w-full aspect-square max-w-[550px] group">
              <div className="absolute inset-0 bg-cyber-blue/10 rounded-full blur-[100px] animate-pulse group-hover:bg-cyber-blue/20 transition-all" />
              <div className="relative h-full w-full rounded-sm border border-white/10 bg-[#060606] p-8 font-mono text-[11px] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyber-blue" />
                    <span className="text-white font-bold tracking-tighter uppercase">
                      {dict.evolution.logTitle}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-cyber-blue/50" />
                  </div>
                </div>
                <div className="space-y-3 leading-relaxed">
                  <div className="text-zinc-600 font-bold">
                    [01:14:16]{' '}
                    <span className="text-cyber-blue uppercase">
                      Node_Status:
                    </span>{' '}
                    {dict.evolution.logStatus}
                  </div>
                  <div className="text-zinc-600 font-bold">
                    [01:14:17]{' '}
                    <span className="text-purple-400 uppercase">Process:</span>{' '}
                    Scoped Gap Analysis initiated...
                  </div>
                  <div className="pl-4 text-zinc-500 italic">
                    {'>>'} {dict.evolution.logIdentify}
                  </div>
                  <div className="text-zinc-600 font-bold">
                    [01:14:22]{' '}
                    <span className="text-yellow-400 uppercase">Action:</span>{' '}
                    Synthesizing patch v4.2.9
                  </div>
                  <div className="text-zinc-600 font-bold">
                    [01:14:35]{' '}
                    <span className="text-white uppercase">Ops:</span> Mutation
                    in progress (infra/limits.ts)
                  </div>
                  <div className="text-zinc-600 font-bold">
                    [01:15:02]{' '}
                    <span className="text-cyber-blue uppercase">Sync:</span>{' '}
                    Committing success to origin/main
                  </div>

                  <div className="mt-8 p-4 bg-cyber-blue/5 rounded-sm border border-cyber-blue/20 text-cyber-blue text-[10px] relative overflow-hidden group-hover:border-cyber-blue/40 transition-all">
                    <div className="absolute top-0 right-0 p-1 opacity-20">
                      <Zap size={40} />
                    </div>
                    <div className="font-black mb-1 text-white underline decoration-cyber-blue decoration-2 underline-offset-4">
                      {dict.evolution.mutVerified}
                    </div>
                    <div>{dict.evolution.mutAdded}</div>
                    <div className="text-[8px] opacity-60 mt-2">
                      HASH: 5086da9f3c6d8e2d494195...
                    </div>
                  </div>
                </div>
                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="text-purple-400 font-mono text-xs uppercase tracking-[0.5em] mb-4">
              {dict.pricing.model}
            </div>
            <h2 className="text-5xl font-black mb-6 tracking-tighter italic">
              {dict.pricing.title}
            </h2>
            <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest font-bold">
              {dict.pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Free Tier - STYLISH & EQUAL */}
            <div className="glass-card p-10 flex flex-col border-purple-500/30 bg-purple-500/[0.03] hover:border-purple-500/50 transition-all shadow-[0_0_80px_rgba(188,0,255,0.08)] relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 rounded-sm bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(188,0,255,0.3)] z-10">
                {dict.pricing.community.badge}
              </div>
              <div className="mb-10">
                <h4 className="text-purple-400 font-mono text-xs uppercase tracking-widest font-black mb-2">
                  {dict.pricing.community.name}
                </h4>
                <div className="flex items-baseline gap-2">
                  <div className="text-6xl font-black tracking-tight text-white">
                    {dict.pricing.community.price}
                  </div>
                </div>
                <p className="text-xs font-mono text-purple-300 uppercase mt-4 tracking-tighter font-bold">
                  {dict.pricing.community.subtext}
                </p>
              </div>
              <ul className="space-y-5 mb-12 flex-grow">
                {dict.pricing.community.features.map(
                  (feature: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm text-zinc-100 font-mono uppercase tracking-tight"
                    >
                      <ShieldCheck className="w-5 h-5 text-purple-400" />{' '}
                      {feature}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="https://github.com/caopengau/serverlessclaw"
                className="w-full py-5 rounded-sm bg-purple-600 hover:bg-purple-500 transition-all text-white text-xs font-black uppercase text-center tracking-widest shadow-[0_0_25px_rgba(188,0,255,0.2)]"
              >
                {dict.common.startFree} (OSS)
              </Link>
            </div>

            {/* Pro Tier - EQUAL SCALE */}
            <div className="glass-card p-10 border-cyber-blue/30 bg-cyber-blue/[0.03] relative flex flex-col hover:border-cyber-blue/50 transition-all shadow-[0_0_80px_rgba(0,224,255,0.08)]">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 rounded-sm bg-cyber-blue text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,224,255,0.3)] z-10">
                {dict.pricing.managed.badge}
              </div>
              <div className="mb-10">
                <h4 className="text-cyber-blue font-mono text-xs uppercase tracking-widest font-black mb-2">
                  {dict.pricing.managed.name}
                </h4>
                <div className="text-6xl font-black tracking-tight text-white">
                  {dict.pricing.managed.price}
                  <span className="text-2xl font-normal text-zinc-500">
                    {dict.pricing.managed.period}
                  </span>
                </div>
                <p className="text-xs font-mono text-cyber-blue uppercase mt-4 tracking-tighter font-bold">
                  {dict.pricing.managed.subtext}
                </p>
              </div>
              <ul className="space-y-5 mb-12 flex-grow">
                {dict.pricing.managed.features.map(
                  (feature: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm text-zinc-100 font-mono uppercase tracking-tight"
                    >
                      <Zap className="w-5 h-5 text-cyber-blue" /> {feature}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="#waitlist"
                className="w-full py-5 rounded-sm bg-cyber-blue hover:bg-cyber-blue/90 transition-all text-black text-xs font-black uppercase text-center tracking-widest shadow-[0_0_25px_rgba(0,224,255,0.2)]"
              >
                {dict.common.managedWaitlist}
              </Link>
            </div>
          </div>

          <div className="mt-20 glass-card p-10 max-w-2xl mx-auto border-purple-500/20 bg-purple-500/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              <h5 className="font-mono text-xs font-black uppercase tracking-[0.4em] text-purple-400">
                {dict.pricing.tax.title}
              </h5>
            </div>
            <p className="text-sm text-zinc-400 font-mono leading-relaxed tracking-tight">
              {dict.pricing.tax.desc}
            </p>
          </div>
        </div>
      </section>

      <FAQ items={FAQ_ITEMS} title={dict.faq.title} />

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black/40">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <Image
              src="/logo.png"
              alt="ClawMore Logo"
              width={32}
              height={32}
              className="rounded-sm opacity-80"
            />
            <span className="font-black text-xl tracking-tighter italic glow-text">
              ClawMore
            </span>
          </div>
          <div className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
            {dict.footer.ecosystem}{' '}
            <Link
              href="https://getaiready.dev"
              className="text-zinc-400 hover:text-cyber-blue transition-colors underline decoration-white/10 underline-offset-4"
            >
              AIReady_Ecosystem
            </Link>{' '}
            neural network.
            <div className="mt-6 opacity-40">{dict.footer.copyright}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
