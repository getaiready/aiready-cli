'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  User,
  Settings,
  Terminal,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const navItems = [
    { name: 'Overview', tab: 'overview', icon: LayoutDashboard },
    { name: 'Nodes', tab: 'nodes', icon: Activity },
    { name: 'Account', tab: 'account', icon: User },
    { name: 'Settings', tab: 'settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col z-20">
        <div className="p-8 pb-4">
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ClawMore"
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.3em] leading-none mb-1">
                Serverless
              </span>
              <span className="text-sm font-black italic tracking-tighter uppercase group-hover:text-cyber-blue transition-colors">
                CLAW<span className="text-cyber-blue">MORE</span>
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <Link
                key={item.name}
                href={`/dashboard?tab=${item.tab}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon
                  className={`w-4 h-4 ${isActive ? '' : 'group-hover:text-cyber-blue transition-colors'}`}
                />
                <span className="text-xs font-black uppercase tracking-widest">
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeUserTab"
                    className="ml-auto w-1 h-1 rounded-full bg-cyber-blue shadow-[0_0_8px_rgba(0,224,255,0.8)]"
                  />
                )}
              </Link>
            );
          })}

          <div className="pt-8 mt-8 border-t border-white/5">
            <p className="px-4 text-[8px] font-mono text-zinc-600 uppercase tracking-[0.3em] mb-4">
              Integrations
            </p>
            <a
              href="https://github.com/serverlessclaw/serverlessclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 text-emerald-500 hover:bg-emerald-500/10 rounded-xl text-xs font-bold transition-all group border border-transparent hover:border-emerald-500/20"
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase">
                  ClawCenter
                </span>
              </div>
              <Zap className="w-3 h-3 animate-pulse" />
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-white transition-all text-[10px] font-mono uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
          </Link>
          <div className="px-4 py-2 flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-mono text-zinc-600 uppercase">
              Engine Synchronized
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-gradient-to-br from-black to-zinc-900/40">
        {children}
      </main>
    </div>
  );
}
