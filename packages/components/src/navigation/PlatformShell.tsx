'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import {
  RocketIcon,
  ChartIcon,
  TrendingUpIcon,
  RobotIcon,
  SettingsIcon,
} from '../components/icons';

// --- Types ---

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Team {
  id: string;
  name: string;
}

export interface TeamMember {
  teamId: string;
  team: Team;
}

export interface PlatformShellProps {
  children: React.ReactNode;
  user: User | null;
  teams?: TeamMember[];
  overallScore?: number | null;
  activePage?: string;
  pathname?: string;
  onNavigate?: (href: string) => void;
  onSignOut?: () => void;
  onSwitchTeam?: (teamId: string | 'personal') => void;
  logoUrl?: string;
  navItems?: NavItem[];
  LinkComponent?: React.ElementType;
}

// --- Internal Components ---

function NavItemComponent({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
  LinkComponent = 'a',
}: NavItem & {
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
  LinkComponent?: any;
}) {
  const Component = LinkComponent;
  return (
    <Component href={href} onClick={onClick} className="block group">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
          isActive
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 glow-blue'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent hover:glow-blue'
        )}
      >
        <Icon
          className={cn(
            'w-5 h-5',
            isActive
              ? 'text-cyan-400'
              : 'text-slate-500 group-hover:text-slate-300'
          )}
        />
        <span className="text-sm font-semibold tracking-tight">{label}</span>
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          />
        )}
      </div>
    </Component>
  );
}

function UserMenu({
  user,
  teams = [],
  currentTeamId,
  onSwitchTeam,
  onSignOut,
}: {
  user: User;
  teams: TeamMember[];
  currentTeamId: string | 'personal';
  onSwitchTeam?: (teamId: string | 'personal') => void;
  onSignOut?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentWorkspaceName =
    currentTeamId === 'personal'
      ? 'Personal Workspace'
      : teams.find((t) => t.teamId === currentTeamId)?.team.name ||
        'Team Workspace';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-lg border border-cyan-500/30"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {user.name?.[0] || user.email?.[0]}
          </div>
        )}
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-white leading-none mb-0.5">
            {user.name || user.email?.split('@')[0]}
          </p>
          <p className="text-[10px] text-slate-400 leading-none truncate max-w-[100px]">
            {currentWorkspaceName}
          </p>
        </div>
        <svg
          className={cn(
            'w-4 h-4 text-slate-500 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-800">
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>

            <div className="p-2 border-b border-slate-800">
              <p className="px-3 py-1 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Workspaces
              </p>
              <button
                onClick={() => {
                  onSwitchTeam?.('personal');
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  currentTeamId === 'personal'
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                  P
                </div>
                Personal
              </button>
              {teams.map((t) => (
                <button
                  key={t.teamId}
                  onClick={() => {
                    onSwitchTeam?.(t.teamId);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    currentTeamId === t.teamId
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center text-[10px] font-bold">
                    {t.team.name[0]}
                  </div>
                  {t.team.name}
                </button>
              ))}
            </div>

            <div className="p-2">
              <button
                onClick={onSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Shell ---

export function PlatformShell({
  children,
  user,
  teams = [],
  overallScore,
  activePage,
  pathname = '',
  onNavigate,
  onSignOut,
  onSwitchTeam,
  logoUrl = '/logo-text-transparent-dark-theme.png',
  navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: RocketIcon },
    { href: '/strategy', label: 'Scan Strategy', icon: SettingsIcon },
    { href: '/trends', label: 'Trends Explorer', icon: TrendingUpIcon },
    { href: '/map', label: 'Codebase Map', icon: RobotIcon },
    { href: '/metrics', label: 'Methodology', icon: ChartIcon },
  ],
  LinkComponent = 'a',
}: PlatformShellProps) {
  const [currentTeamId, setCurrentTeamId] = useState<string | 'personal'>(
    'personal'
  );

  const handleSwitchTeam = (teamId: string | 'personal') => {
    setCurrentTeamId(teamId);
    onSwitchTeam?.(teamId);
  };

  const Sidebar = () => (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950/50 border-r border-slate-800 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-center mb-10">
          <img src={logoUrl} alt="AIReady" className="h-9 w-auto" />
        </div>

        <nav className="space-y-1.5 flex-1">
          <p className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Workspace
          </p>
          {navItems.map((item) => (
            <NavItemComponent
              key={item.href}
              {...item}
              LinkComponent={LinkComponent}
              isActive={
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              }
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(item.href);
                }
              }}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <p className="text-xs font-bold text-white mb-1">AI Insights</p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {overallScore != null
                ? `Your codebase is ${overallScore}% ready for AI agents.`
                : 'Run a scan to see your AI-readiness score.'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  const Navbar = () => (
    <header className="sticky top-0 z-20 h-16 border-b border-indigo-500/10 backdrop-blur-md bg-slate-950/20 px-4 sm:px-6 lg:px-8">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden sm:block glow-text">
            {activePage || 'Dashboard'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <UserMenu
              user={user}
              teams={teams}
              currentTeamId={currentTeamId}
              onSwitchTeam={handleSwitchTeam}
              onSignOut={onSignOut}
            />
          )}
        </div>
      </div>
    </header>
  );

  return (
    <div
      className={cn(
        'min-h-screen bg-[#0a0a0f]',
        user && 'flex overflow-hidden'
      )}
    >
      {user && <Sidebar />}

      <div className={cn('flex-1 flex flex-col min-w-0', user && 'h-screen')}>
        {user && <Navbar />}

        <main
          className={cn('relative flex-1', user && 'overflow-y-auto', 'z-10')}
        >
          {user && (
            <>
              <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div
                  className="absolute rounded-full blur-[60px] opacity-20 bg-radial-gradient from-blue-600/60 to-transparent w-96 h-96 -top-48 -right-48"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent)',
                  }}
                />
                <div
                  className="absolute rounded-full blur-[60px] opacity-20 bg-radial-gradient from-purple-600/60 to-transparent w-80 h-80 bottom-0 -left-40"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(139, 92, 246, 0.6), transparent)',
                  }}
                />
              </div>
              <div
                className="absolute inset-0 opacity-10 -z-10"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                }}
              />
            </>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
