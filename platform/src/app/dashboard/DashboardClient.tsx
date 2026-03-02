'use client';

import { useState } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RocketIcon } from '@/components/Icons';
import { useEffect } from 'react';
import {
  scoreColor,
  scoreBg,
  scoreGlow,
  scoreLabel,
} from '@aiready/components';
import type { Repository, Analysis, ApiKey } from '@/lib/db';

type RepoWithAnalysis = Repository & { latestAnalysis: Analysis | null };

interface Props {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  repos: RepoWithAnalysis[];
  overallScore: number | null;
}

export default function DashboardClient({
  user,
  repos: initialRepos,
  overallScore,
}: Props) {
  const [repos, setRepos] = useState<RepoWithAnalysis[]>(initialRepos);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [addRepoForm, setAddRepoForm] = useState({
    name: '',
    url: '',
    description: '',
    defaultBranch: 'main',
  });
  const [addRepoError, setAddRepoError] = useState<string | null>(null);
  const [addRepoLoading, setAddRepoLoading] = useState(false);
  const [uploadingRepoId, setUploadingRepoId] = useState<string | null>(null);
  const [scanningRepoId, setScanningRepoId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [keysLoading, setKeysLoading] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    try {
      const res = await fetch('/api/keys');
      const data = await res.json();
      if (res.ok) setApiKeys(data.keys);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
    }
  }

  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault();
    if (!newKeyName) return;
    setKeysLoading(true);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewlyCreatedKey(data.key);
        setNewKeyName('');
        fetchApiKeys();
      }
    } catch (err) {
      console.error('Failed to create API key:', err);
    } finally {
      setKeysLoading(false);
    }
  }

  async function handleDeleteKey(id: string) {
    if (!confirm('Delete this API key?')) return;
    try {
      const res = await fetch(`/api/keys?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApiKeys((prev) => prev.filter((k) => k.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete API key:', err);
    }
  }

  async function handleAddRepo(e: React.FormEvent) {
    e.preventDefault();
    setAddRepoError(null);
    setAddRepoLoading(true);

    try {
      const res = await fetch('/api/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addRepoForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setAddRepoError(data.error || 'Failed to add repository');
        return;
      }

      const newRepo: RepoWithAnalysis = { ...data.repo, latestAnalysis: null };
      setRepos((prev) => [newRepo, ...prev]);
      setShowAddRepo(false);
      setAddRepoForm({
        name: '',
        url: '',
        description: '',
        defaultBranch: 'main',
      });
    } catch {
      setAddRepoError('Network error. Please try again.');
    } finally {
      setAddRepoLoading(false);
    }
  }

  async function handleDeleteRepo(repoId: string) {
    if (!confirm('Delete this repository and all its analyses?')) return;

    const res = await fetch(`/api/repos?id=${repoId}`, { method: 'DELETE' });
    if (res.ok) {
      setRepos((prev) => prev.filter((r) => r.id !== repoId));
    }
  }

  async function handleUploadAnalysis(repoId: string) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploadingRepoId(repoId);
      setUploadError(null);

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        const res = await fetch('/api/analysis/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoId, data }),
        });

        const result = await res.json();
        if (!res.ok) {
          setUploadError(result.error || 'Upload failed');
          return;
        }

        setRepos((prev) =>
          prev.map((r) =>
            r.id === repoId
              ? {
                  ...r,
                  latestAnalysis: result.analysis,
                  aiScore: result.analysis.aiScore,
                }
              : r
          )
        );
      } catch {
        setUploadError('Invalid JSON file or network error');
      } finally {
        setUploadingRepoId(null);
      }
    };

    input.click();
  }

  async function handleScanRepo(repoId: string) {
    setScanningRepoId(repoId);
    setUploadError(null);

    try {
      const res = await fetch('/api/analysis/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoId }),
      });

      const result = await res.json();
      if (!res.ok) {
        setUploadError(result.error || 'Failed to trigger scan');
        return;
      }

      // Show a success message or update UI to indicate scan is in progress
      alert('Scan triggered! Results will appear here in a few minutes.');
    } catch {
      setUploadError('Network error while triggering scan');
    } finally {
      setScanningRepoId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="orb orb-blue w-96 h-96 -top-48 -right-48"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="orb orb-purple w-80 h-80 bottom-0 -left-40"
          style={{ animationDelay: '3s' }}
        />
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Header */}
      <header className="glass sticky top-0 z-20 border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center"
              >
                <Image
                  src="/logo-text-transparent-dark-theme.png"
                  alt="AIReady"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </motion.div>
              <nav className="hidden md:flex items-center gap-6 ml-6">
                <a
                  href="/dashboard"
                  className="text-sm font-medium text-cyan-400 border-b-2 border-cyan-400 pb-0.5"
                >
                  Dashboard
                </a>
                <a
                  href="/docs"
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Docs
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {user.image && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-full border-2 border-cyan-500/50"
                />
              )}
              <span className="text-sm text-slate-300 hidden sm:block">
                {user.name || user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome + overall score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user.name?.split(' ')[0] || 'Developer'}!
            </h1>
            <p className="text-slate-400 mt-1">
              {repos.length === 0
                ? 'Add your first repository to start tracking AI readiness.'
                : `Tracking ${repos.length} repositor${repos.length === 1 ? 'y' : 'ies'}`}
            </p>
          </div>
          {overallScore != null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${scoreBg(overallScore)} shadow-lg ${scoreGlow(overallScore)}`}
            >
              <div className="text-right">
                <div
                  className={`text-4xl font-black ${scoreColor(overallScore)}`}
                >
                  {overallScore}
                </div>
                <div className="text-xs text-slate-500 -mt-1">/ 100</div>
              </div>
              <div className="pl-4 border-l border-slate-700">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Overall AI Score
                </div>
                <div
                  className={`text-sm font-semibold ${scoreColor(overallScore)}`}
                >
                  {scoreLabel(overallScore)}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Limits banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wide">
                Repos
              </span>
              <span className="text-lg font-bold text-white">
                {repos.length}
              </span>
              <span className="text-xs text-slate-500">/ 3</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wide">
                This Month
              </span>
              <span className="text-lg font-bold text-white">
                {10 - repos.filter((r) => r.latestAnalysis).length}
              </span>
              <span className="text-xs text-slate-500">runs left</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Free plan ·{' '}
            <a
              href="https://getaiready.dev/pricing"
              className="text-cyan-400 hover:underline"
            >
              Upgrade
            </a>
          </div>
        </motion.div>

        {/* Upload error banner */}
        <AnimatePresence>
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex justify-between items-center"
            >
              <span>{uploadError}</span>
              <button
                onClick={() => setUploadError(null)}
                className="ml-4 font-bold text-xl leading-none hover:text-red-100"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Repositories section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Repositories</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddRepo(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <span className="text-lg leading-none">+</span> Add Repository
            </motion.button>
          </div>

          {repos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-12 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <div className="inline-block text-6xl text-slate-50">
                  <RocketIcon className="w-14 h-14" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Get Started with AIReady
              </h3>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Add a repository, run the CLI, then upload the results to get
                your AI readiness score.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddRepo(true)}
                className="mt-8 btn-primary"
              >
                Add Your First Repository
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence>
                {repos.map((repo, index) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    index={index}
                    uploading={uploadingRepoId === repo.id}
                    scanning={scanningRepoId === repo.id}
                    onUpload={() => handleUploadAnalysis(repo.id)}
                    onScan={() => handleScanRepo(repo.id)}
                    onDelete={() => handleDeleteRepo(repo.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* CLI quickstart */}
        {repos.length > 0 && repos.every((r) => !r.latestAnalysis) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-semibold text-lg text-white mb-2">
              Run your first analysis
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Generate a report JSON and upload it to see your AI readiness
              scores.
            </p>
            <div className="font-mono text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">$</span>
                <span className="text-cyan-400">
                  npx @aiready/cli scan . --output json{' > '}report.json
                </span>
              </div>
              <div className="text-slate-500 text-xs">
                # then upload report.json via the button on your repo card
              </div>
            </div>
          </motion.section>
        )}

        {/* API Keys section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">API Keys</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 glass-card rounded-2xl p-6 h-fit">
              <h3 className="text-sm font-semibold text-white mb-4">
                Create New Key
              </h3>
              <form onSubmit={handleCreateKey} className="space-y-4">
                <input
                  type="text"
                  placeholder="e.g., GitHub Actions"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  required
                />
                <button
                  type="submit"
                  disabled={keysLoading}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
                >
                  {keysLoading ? 'Generating...' : 'Generate New Key'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border border-indigo-500/10">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Key</th>
                    <th className="px-6 py-3 font-medium">Created</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {apiKeys.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-slate-500 italic"
                      >
                        No API keys yet.
                      </td>
                    </tr>
                  ) : (
                    apiKeys.map((key) => (
                      <tr
                        key={key.id}
                        className="hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {key.name}
                        </td>
                        <td className="px-6 py-4 font-mono text-cyan-400">
                          {key.prefix}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(key.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteKey(key.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* New Key Modal */}
      <AnimatePresence>
        {newlyCreatedKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 max-w-md w-full border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                New API Key Created
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Please copy your API key now. For security reasons, it will only
                be shown once.
              </p>

              <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 flex items-center justify-between gap-3 mb-8">
                <code className="text-cyan-400 font-mono text-lg break-all">
                  {newlyCreatedKey}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(newlyCreatedKey);
                    alert('Copied to clipboard!');
                  }}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 p-2 rounded-lg text-cyan-400 border border-cyan-500/20"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => setNewlyCreatedKey(null)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all"
              >
                I've secured the key
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Repository Modal */}
      <AnimatePresence>
        {showAddRepo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddRepo(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">
                  Add Repository
                </h3>
                <button
                  onClick={() => setShowAddRepo(false)}
                  className="text-slate-400 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddRepo} className="px-6 py-5 space-y-4">
                {addRepoError && (
                  <div className="text-sm text-red-400 bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-2">
                    {addRepoError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="my-awesome-project"
                    value={addRepoForm.name}
                    onChange={(e) =>
                      setAddRepoForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Repository URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://github.com/user/repo"
                    value={addRepoForm.url}
                    onChange={(e) =>
                      setAddRepoForm((f) => ({ ...f, url: e.target.value }))
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Description{' '}
                    <span className="text-slate-500 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="What does this repo do?"
                    value={addRepoForm.description}
                    onChange={(e) =>
                      setAddRepoForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Default Branch
                  </label>
                  <input
                    type="text"
                    placeholder="main"
                    value={addRepoForm.defaultBranch}
                    onChange={(e) =>
                      setAddRepoForm((f) => ({
                        ...f,
                        defaultBranch: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddRepo(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-600 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={addRepoLoading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addRepoLoading ? 'Adding...' : 'Add Repository'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RepoCard({
  repo,
  index,
  uploading,
  scanning,
  onUpload,
  onScan,
  onDelete,
}: {
  repo: RepoWithAnalysis;
  index: number;
  uploading: boolean;
  scanning: boolean;
  onUpload: () => void;
  onScan: () => void;
  onDelete: () => void;
}) {
  const score = repo.aiScore;
  const analysis = repo.latestAnalysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-4 card-hover"
    >
      {/* Repo header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate text-lg">
            {repo.name}
          </h3>
          {repo.description && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {repo.description}
            </p>
          )}
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 truncate block transition-colors"
          >
            {repo.url}
          </a>
        </div>
        {score != null && (
          <div
            className={`flex-shrink-0 text-center px-4 py-2 rounded-xl border ${scoreBg(score)} shadow-lg`}
          >
            <div
              className={`text-2xl font-black leading-none ${scoreColor(score)}`}
            >
              {score}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">/ 100</div>
          </div>
        )}
      </div>

      {/* Breakdown grid */}
      {analysis?.breakdown && (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(analysis.breakdown).map(([key, val]) => (
            <BreakdownItem
              key={key}
              label={formatBreakdownKey(key)}
              value={val as number}
            />
          ))}
        </div>
      )}

      {/* Summary line */}
      {analysis?.summary && (
        <div className="flex gap-4 text-xs text-slate-400">
          <span>{analysis.summary.totalFiles} files</span>
          {analysis.summary.criticalIssues > 0 && (
            <span className="text-red-400 font-medium">
              {analysis.summary.criticalIssues} critical
            </span>
          )}
          {analysis.summary.warnings > 0 && (
            <span className="text-amber-400">
              {analysis.summary.warnings} warnings
            </span>
          )}
        </div>
      )}

      {!analysis && (
        <p className="text-xs text-slate-500 italic">
          No analysis yet — upload a report to get scored.
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-slate-700/50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onScan}
          disabled={scanning}
          className="flex-1 px-3 py-2.5 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-lg hover:bg-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500/30"
        >
          {scanning ? 'Scanning...' : 'Scan Now'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUpload}
          disabled={uploading}
          className="px-3 py-2.5 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-lg hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-cyan-500/30"
        >
          {uploading ? 'Uploading...' : 'Upload JSON'}
        </motion.button>
        <button
          onClick={onDelete}
          className="px-3 py-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium rounded-lg transition-colors border border-transparent hover:border-red-500/30"
          title="Delete repository"
        >
          Delete
        </button>
      </div>

      {repo.lastAnalysisAt && (
        <p className="text-xs text-slate-500 -mt-1">
          Last analyzed {new Date(repo.lastAnalysisAt).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
}

function BreakdownItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-800/50 rounded-lg px-2 py-1.5 border border-slate-700/50">
      <div className={`text-xs font-bold ${scoreColor(value)}`}>{value}</div>
      <div
        className="text-[10px] text-slate-400 leading-tight truncate"
        title={label}
      >
        {label}
      </div>
    </div>
  );
}

function formatBreakdownKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
