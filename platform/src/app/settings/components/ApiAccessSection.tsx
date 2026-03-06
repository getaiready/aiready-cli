'use client';

import type { ApiKey } from '@/lib/db';

interface ApiAccessSectionProps {
  apiKeys: ApiKey[];
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  onCreateKey: (e: React.FormEvent) => void;
  onDeleteKey: (id: string) => void;
  loading: boolean;
}

export function ApiAccessSection({
  apiKeys,
  newKeyName,
  setNewKeyName,
  onCreateKey,
  onDeleteKey,
  loading,
}: ApiAccessSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
          <svg
            className="w-6 h-6 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">API Access</h2>
          <p className="text-slate-400 text-sm">
            Generate keys to use AIReady from your CI/CD pipelines.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-lg font-bold text-white mb-4">
            Generate New Key
          </h3>
          <form onSubmit={onCreateKey} className="flex gap-4">
            <input
              type="text"
              placeholder="Key Name (e.g. Production CI)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0f] font-black rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Key'}
            </button>
          </form>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.01]">
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Name
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Key Preview
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Created
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {apiKeys.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-8 py-12 text-center text-slate-500 italic"
                    >
                      No API keys generated yet.
                    </td>
                  </tr>
                ) : (
                  apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-white/[0.01]">
                      <td className="px-8 py-4">
                        <span className="text-white font-medium">
                          {key.name}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <code className="text-cyan-400/70 font-mono text-xs">
                          {key.prefix}••••••••
                        </code>
                      </td>
                      <td className="px-8 py-4 text-slate-400 text-sm">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button
                          onClick={() => onDeleteKey(key.id)}
                          className="px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
