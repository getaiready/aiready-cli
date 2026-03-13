'use client';

import Link from 'next/link';
import { Team, TeamMember } from '@/lib/db';
import UserMenu from './UserMenu';

interface Props {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  teams: (TeamMember & { team: Team })[];
  currentTeamId: string | 'personal';
  onSwitchTeam: (teamId: string | 'personal') => void;
  activePage?: 'dashboard' | 'settings' | 'repo' | 'metrics';
  showLogo?: boolean;
}

export default function Navbar({
  user,
  teams,
  currentTeamId,
  onSwitchTeam,
  activePage,
  showLogo = false,
}: Props) {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-indigo-500/10 backdrop-blur-md bg-slate-950/20 px-4 sm:px-6 lg:px-8">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showLogo && (
            <Link
              href="/dashboard"
              className="flex items-center drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            >
              <img
                src="/logo-text-transparent-dark-theme.png"
                alt="AIReady"
                className="h-6 w-auto"
              />
            </Link>
          )}
          <div className="h-4 w-px bg-slate-800 mx-2 hidden lg:block" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden sm:block glow-text">
            {activePage || 'Dashboard'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <UserMenu
            user={user}
            teams={teams}
            currentTeamId={currentTeamId}
            onSwitchTeam={onSwitchTeam}
          />
        </div>
      </div>
    </header>
  );
}
