'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Repository, Analysis } from '@/lib/db';

type RepoWithAnalysis = Repository & { latestAnalysis: Analysis | null };

export function useDashboardData(
  initialRepos: RepoWithAnalysis[],
  currentTeamId: string
) {
  const [repos, setRepos] = useState<RepoWithAnalysis[]>(initialRepos);
  const [pendingScanRepoIds, setPendingScanRepoIds] = useState<string[]>([]);
  const [uploadingRepoId, setUploadingRepoId] = useState<string | null>(null);
  const [scanningRepoId, setScanningRepoId] = useState<string | null>(null);
  const [deletingRepoId, setDeletingRepoId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (currentTeamId === 'personal') {
      setRepos(initialRepos);
    } else {
      fetchTeamRepos(currentTeamId);
    }
  }, [currentTeamId, initialRepos]);

  async function fetchTeamRepos(teamId: string) {
    try {
      const res = await fetch(`/api/repos?teamId=${teamId}`);
      if (res.ok) {
        const data = await res.json();
        setRepos(
          data.repos.map((r: any) => ({
            ...r,
            latestAnalysis: r.latestAnalysis || null,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch team repos:', err);
    }
  }

  // Initialize pending scans from repo data
  useEffect(() => {
    const scanningIds = repos.filter((r) => r.isScanning).map((r) => r.id);
    if (scanningIds.length > 0) {
      setPendingScanRepoIds((prev) => {
        const next = [...new Set([...prev, ...scanningIds])];
        return next.length === prev.length ? prev : next;
      });
    }
  }, [repos]);

  // Automatic Refresh Polling
  useEffect(() => {
    if (pendingScanRepoIds.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const url =
          currentTeamId === 'personal'
            ? '/api/repos'
            : `/api/repos?teamId=${currentTeamId}`;
        const res = await fetch(url);
        if (!res.ok) return;

        const data = await res.json();
        const updatedRepos: RepoWithAnalysis[] = data.repos.map((r: any) => ({
          ...r,
          latestAnalysis: r.latestAnalysis || null,
        }));

        // Determine who finished or failed
        const finishedIds: string[] = [];
        const failedIds: string[] = [];

        pendingScanRepoIds.forEach((id) => {
          const oldRepo = repos.find((r) => r.id === id);
          const newRepo = updatedRepos.find((r) => r.id === id);

          if (
            newRepo?.latestAnalysis &&
            (!oldRepo?.latestAnalysis ||
              newRepo.latestAnalysis.timestamp !==
                oldRepo.latestAnalysis.timestamp)
          ) {
            finishedIds.push(id);
            toast.success(`Scan complete for ${newRepo.name}!`, {
              description: `New AI Score: ${newRepo.aiScore ?? 'N/A'}`,
            });
          } else if (newRepo?.lastError && !oldRepo?.lastError) {
            failedIds.push(id);
            toast.error(`Scan failed for ${newRepo.name}`, {
              description: newRepo.lastError,
            });
          }
        });

        setRepos(updatedRepos);

        if (finishedIds.length > 0 || failedIds.length > 0) {
          setPendingScanRepoIds((prev) =>
            prev.filter(
              (id) => !finishedIds.includes(id) && !failedIds.includes(id)
            )
          );
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pendingScanRepoIds, currentTeamId, repos]);

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
        toast.error(result.error || 'Failed to trigger scan');
        return;
      }

      toast.success('Scan triggered! Results will appear here automatically.');
      setPendingScanRepoIds((prev) => [...prev, repoId]);
    } catch {
      setUploadError('Network error while triggering scan');
      toast.error('Network error while triggering scan');
    } finally {
      setScanningRepoId(null);
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

  async function handleDeleteRepo(repoId: string) {
    setDeletingRepoId(repoId);
    try {
      const res = await fetch(`/api/repos?id=${repoId}`, { method: 'DELETE' });
      if (res.ok) {
        setRepos((prev) => prev.filter((r) => r.id !== repoId));
        toast.success('Repository deleted');
      } else {
        toast.error('Failed to delete repository');
      }
    } finally {
      setDeletingRepoId(null);
    }
  }

  return {
    repos,
    setRepos,
    pendingScanRepoIds,
    uploadingRepoId,
    scanningRepoId,
    deletingRepoId,
    uploadError,
    setUploadError,
    handleScanRepo,
    handleUploadAnalysis,
    handleDeleteRepo,
  };
}
