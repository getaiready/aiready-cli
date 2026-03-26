'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [deletedRepoIds, setDeletedRepoIds] = useState<Set<string>>(new Set());
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchTeamRepos = useCallback(
    async (teamId: string) => {
      try {
        const res = await fetch(`/api/repos?teamId=${teamId}`);
        if (res.ok) {
          const data = await res.json();
          const fetchedRepos = data.repos.map((r: any) => ({
            ...r,
            latestAnalysis: r.latestAnalysis || null,
          }));
          setRepos(fetchedRepos.filter((r: any) => !deletedRepoIds.has(r.id)));
        }
      } catch (_err) {
        console.error('Failed to fetch team repos:', _err);
      }
    },
    [deletedRepoIds]
  );

  useEffect(() => {
    if (currentTeamId === 'personal') {
      setRepos((prev) => {
        // Filter initialRepos by deletedRepoIds
        const filteredInitial = initialRepos.filter(
          (r) => !deletedRepoIds.has(r.id)
        );

        // Merge: keep anything currently in state that isn't in initialRepos
        // (to handle the gap between client update and server update)
        const initialIds = new Set(filteredInitial.map((r) => r.id));
        const newlyAdded = prev.filter(
          (r) => !initialIds.has(r.id) && !deletedRepoIds.has(r.id)
        );

        return [...newlyAdded, ...filteredInitial];
      });
    } else {
      fetchTeamRepos(currentTeamId);
    }
  }, [currentTeamId, initialRepos, deletedRepoIds, fetchTeamRepos]);

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
        const updatedRepos: RepoWithAnalysis[] = data.repos
          .map((r: any) => ({
            ...r,
            latestAnalysis: r.latestAnalysis || null,
          }))
          .filter((r: any) => !deletedRepoIds.has(r.id));

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
      } catch (_err) {
        console.error('Polling error:', _err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pendingScanRepoIds, currentTeamId, repos, deletedRepoIds]);

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
    input.multiple = true;

    input.onchange = async () => {
      const files = Array.from(input.files || []);
      if (files.length === 0) return;

      setUploadingRepoId(repoId);
      setUploadError(null);

      let successCount = 0;
      let failCount = 0;
      let lastAnalysis: Analysis | null = null;
      const errors: string[] = [];

      // Import schema dynamically to avoid heavy client bundle if not needed immediately
      const { UnifiedReportSchema } = await import('@aiready/core/client');

      for (const file of files) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);

          // Client-side validation
          const validation = UnifiedReportSchema.safeParse(data);
          if (!validation.success) {
            failCount++;
            errors.push(
              `${file.name}: Invalid format - ${validation.error.issues[0].message}`
            );
            continue;
          }

          const res = await fetch('/api/analysis/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoId, data }),
          });

          const result = await res.json();
          if (!res.ok) {
            failCount++;
            errors.push(`${file.name}: ${result.error || 'Upload failed'}`);
            continue;
          }

          successCount++;
          // Keep track of the "latest" one to update UI (simplistic check)
          if (
            !lastAnalysis ||
            new Date(result.analysis.timestamp) >
              new Date(lastAnalysis.timestamp)
          ) {
            lastAnalysis = result.analysis;
          }
        } catch (_err) {
          failCount++;
          errors.push(`${file.name}: System error or invalid JSON`);
        }
      }

      if (successCount > 0 && lastAnalysis) {
        const finalAnalysis = lastAnalysis;
        setRepos((prev) =>
          prev.map((r) =>
            r.id === repoId
              ? {
                  ...r,
                  latestAnalysis: finalAnalysis,
                  aiScore: finalAnalysis.aiScore,
                }
              : r
          )
        );
        toast.success(`Successfully uploaded ${successCount} report(s).`);
      }

      if (failCount > 0) {
        setUploadError(`${failCount} file(s) failed to upload.`);
        errors.forEach((err) => toast.error(err));
      }

      setUploadingRepoId(null);
    };

    input.click();
  }

  async function handleDeleteRepo(repoId: string) {
    setDeletingRepoId(repoId);
    try {
      const res = await fetch(`/api/repos?id=${repoId}`, { method: 'DELETE' });
      if (res.ok) {
        setDeletedRepoIds((prev) => new Set([...prev, repoId]));
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
