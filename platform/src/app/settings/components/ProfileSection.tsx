'use client';

interface ProfileSectionProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <svg
            className="w-6 h-6 text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-slate-400 text-sm">
            Manage your account and developer access.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                className="w-20 h-20 rounded-2xl border-2 border-indigo-500/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl text-slate-500 font-bold">
                {user.name?.[0] || user.email?.[0]}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-1.5 rounded-lg border-2 border-[#0a0a0f]">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">
              {user.name || 'User'}
            </h3>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Standard Member
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
