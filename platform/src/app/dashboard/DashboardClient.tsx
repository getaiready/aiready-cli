'use client';

import { useState } from 'react';
import PlatformShell from '@/components/PlatformShell';
import type { Repository, Analysis, Team, TeamMember } from '@/lib/db';
import { TeamManagement } from './components/TeamManagement';
import { AddRepoModal } from './components/AddRepoModal';
import { WelcomeHeader } from './components/WelcomeHeader';
import { LimitsBanner } from './components/LimitsBanner';
import { CliQuickstart } from './components/CliQuickstart';
import { BadgeModal } from './components/BadgeModal';
import { ErrorBanner } from './components/ErrorBanner';
import { TrendsModal } from './components/TrendsModal';
import { RepositorySection } from './components/RepositorySection';
import { useDashboardData } from './hooks/useDashboardData';
import { useBilling } from './hooks/useBilling';
import { useAddRepo } from './hooks/useAddRepo';
import ConfirmationModal from '@/components/ConfirmationModal';

type RepoWithAnalysis = Repository & { latestAnalysis: Analysis | null };

interface Props {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    githubId?: string | null;
    googleId?: string | null;
  };
  repos: RepoWithAnalysis[];
  teams: (TeamMember & { team: Team })[];
  overallScore: number | null;
}

export default function DashboardClient({
  user,
  repos: initialRepos,
  teams,
  overallScore,
}: Props) {
  const [currentTeamId, setCurrentTeamId] = useState<string | 'personal'>(
    'personal'
  );

  const {
    repos,
    setRepos,
    pendingScanRepoIds,
    uploadingRepoId,
    scanningRepoId,
    uploadError,
    setUploadError,
    handleScanRepo,
    handleUploadAnalysis,
    handleDeleteRepo,
    deletingRepoId,
  } = useDashboardData(initialRepos, currentTeamId);

  const { billingLoading, handleCheckout, handlePortal } = useBilling(
    currentTeamId,
    setUploadError
  );

  const {
    showAddRepo,
    setShowAddRepo,
    addRepoForm,
    setAddRepoForm,
    addRepoError,
    addRepoLoading,
    handleAddRepo,
  } = useAddRepo(currentTeamId, setRepos);

  const [repoForTrends, setRepoForTrends] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [repoForBadge, setRepoForBadge] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [repoToDelete, setRepoToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const confirmDeleteRepo = async () => {
    if (!repoToDelete) return;
    await handleDeleteRepo(repoToDelete.id);
    setRepoToDelete(null);
  };

  return (
    <PlatformShell
      user={user}
      teams={teams}
      overallScore={overallScore}
      activePage="dashboard"
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <WelcomeHeader
          userName={user.name || 'Developer'}
          repoCount={repos.length}
          overallScore={overallScore}
        />

        <LimitsBanner
          repoCount={repos.length}
          currentTeamId={currentTeamId}
          teams={teams}
          analyzedRepoCount={repos.filter((r) => r.latestAnalysis).length}
          billingLoading={billingLoading}
          onPortal={handlePortal}
          onCheckout={handleCheckout}
        />

        <ErrorBanner error={uploadError} onClear={() => setUploadError(null)} />

        <RepositorySection
          repos={repos}
          onAddRepo={() => setShowAddRepo(true)}
          uploadingRepoId={uploadingRepoId}
          scanningRepoId={scanningRepoId}
          pendingScanRepoIds={pendingScanRepoIds}
          onUpload={handleUploadAnalysis}
          onScan={handleScanRepo}
          onDelete={(id) => {
            const repo = repos.find((r) => r.id === id);
            if (repo) setRepoToDelete({ id: repo.id, name: repo.name });
          }}
          onBadge={setRepoForBadge}
        />

        <TrendsModal
          repo={repoForTrends}
          onClose={() => setRepoForTrends(null)}
        />
        <BadgeModal repo={repoForBadge} onClose={() => setRepoForBadge(null)} />

        <ConfirmationModal
          isOpen={!!repoToDelete}
          onClose={() => setRepoToDelete(null)}
          onConfirm={confirmDeleteRepo}
          title="Delete Repository"
          message={`Are you sure you want to delete "${repoToDelete?.name}"? This will permanently remove all associated analyses and data. This action cannot be undone.`}
          confirmText="Delete Repository"
          isLoading={!!deletingRepoId}
          variant="danger"
        />

        {repos.length > 0 && repos.every((r) => !r.latestAnalysis) && (
          <CliQuickstart
            isScanning={repos.some((r) => r.isScanning) || !!scanningRepoId}
            onScanAll={async () => {
              for (const repo of repos) {
                if (!repo.latestAnalysis && !repo.isScanning) {
                  await handleScanRepo(repo.id);
                }
              }
            }}
          />
        )}

        {currentTeamId !== 'personal' && (
          <TeamManagement
            teamId={currentTeamId}
            teamName={
              teams.find((t) => t.teamId === currentTeamId)?.team.name || 'Team'
            }
          />
        )}
      </div>

      <AddRepoModal
        show={showAddRepo}
        onClose={() => setShowAddRepo(false)}
        onSubmit={handleAddRepo}
        form={addRepoForm}
        setForm={setAddRepoForm}
        loading={addRepoLoading}
        error={addRepoError}
      />
    </PlatformShell>
  );
}
