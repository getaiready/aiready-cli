'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { RocketIcon, ChartIcon, TrendingUpIcon, RobotIcon } from './Icons';
import { Mail } from 'lucide-react';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
}

function NavItem({ href, label, icon: Icon, isActive }: NavItemProps) {
  return (
    <Link href={href} className="block group">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
        }`}
      >
        <Icon
          className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}
        />
        <span className="text-sm font-semibold tracking-tight">{label}</span>
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          />
        )}
      </div>
    </Link>
  );
}

interface Props {
  overallScore?: number | null;
}

export default function Sidebar({ overallScore }: Props) {
  const pathname = usePathname();

  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: RocketIcon },
    { href: '/trends', label: 'Trends Explorer', icon: TrendingUpIcon },
    { href: '/map', label: 'Codebase Map', icon: RobotIcon },
    { href: '/metrics', label: 'Methodology', icon: ChartIcon },
    { href: '/contact', label: 'Contact Us', icon: Mail },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950/50 border-r border-slate-800 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 flex flex-col h-full">
        <Link
          href="/dashboard"
          className="flex items-center justify-center mb-10"
        >
          <img
            src="/logo-text-transparent-dark-theme.png"
            alt="AIReady"
            className="h-9 w-auto"
          />
        </Link>

        <nav className="space-y-1.5 flex-1">
          <p className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Workspace
          </p>
          {items.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              }
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <p className="text-xs font-bold text-white mb-1">AI Insights</p>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
              {overallScore != null
                ? `Your codebase is ${overallScore}% ready for AI agents.`
                : 'Run a scan to see your AI-readiness score.'}
            </p>
            <Link
              href="/metrics"
              className="text-[10px] font-black text-indigo-400 uppercase tracking-wider hover:text-indigo-300 transition-colors"
            >
              Improve Score →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
