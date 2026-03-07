'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PlatformShell from '@/components/PlatformShell';
import type { ApiKey, Team, TeamMember } from '@/lib/db';
import { ProfileSection } from './components/ProfileSection';
import { IntegrationsSection } from './components/IntegrationsSection';
import { ApiAccessSection } from './components/ApiAccessSection';
import { NewKeyModal } from './components/NewKeyModal';
import ConfirmationModal from '@/components/ConfirmationModal';

import type { AIReadyConfig } from '@aiready/core';
import { ScanConfigForm } from '../dashboard/repo/[id]/settings/ScanConfigForm';

interface Props {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    githubId?: string | null;
    googleId?: string | null;
    scanConfig?: AIReadyConfig;
  };
  teams: (TeamMember & { team: Team })[];
  overallScore: number | null;
}

export default function SettingsClient({ user, teams, overallScore }: Props) {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  // ... rest of state
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [keysLoading, setKeysLoading] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

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
        toast.success('API key generated');
      }
    } catch (err) {
      console.error('Failed to create API key:', err);
      toast.error('Failed to generate API key');
    } finally {
      setKeysLoading(false);
    }
  }

  async function confirmDeleteKey() {
    if (!keyToDelete) return;
    setDeletingKeyId(keyToDelete.id);
    try {
      const res = await fetch(`/api/keys?id=${keyToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setApiKeys((prev) => prev.filter((k) => k.id !== keyToDelete.id));
        toast.success('API key deleted');
      }
    } catch (err) {
      console.error('Failed to delete API key:', err);
      toast.error('Failed to delete API key');
    } finally {
      setDeletingKeyId(null);
      setKeyToDelete(null);
    }
  }

  async function handleUpdateScanStrategy(settings: AIReadyConfig | null) {
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanConfig: settings }),
      });
      if (res.ok) {
        toast.success('Default scan strategy updated');
        router.refresh();
      } else {
        throw new Error('Failed to update strategy');
      }
    } catch (err) {
      console.error('Failed to update scan strategy:', err);
      toast.error('Failed to save strategy');
      throw err;
    }
  }

  return (
    <PlatformShell
      user={user}
      teams={teams}
      overallScore={overallScore}
      activePage="settings"
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-12 max-w-5xl mx-auto">
        <section className="space-y-6">
          <ProfileSection user={user} />
          <IntegrationsSection user={user} />
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Default Scan Strategy
            </h2>
            <p className="text-slate-400 text-sm">
              These settings will auto-apply to every repository you scan,
              unless specifically overridden at the repository level.
            </p>
          </div>
          <ScanConfigForm
            repoId="global"
            initialSettings={user.scanConfig || null}
            onSave={handleUpdateScanStrategy}
          />
        </section>

        <ApiAccessSection
          apiKeys={apiKeys}
          newKeyName={newKeyName}
          setNewKeyName={setNewKeyName}
          onCreateKey={handleCreateKey}
          onDeleteKey={(id) => {
            const key = apiKeys.find((k) => k.id === id);
            if (key) setKeyToDelete({ id: key.id, name: key.name });
          }}
          loading={keysLoading}
        />
      </div>

      <NewKeyModal
        apiKey={newlyCreatedKey}
        onClose={() => setNewlyCreatedKey(null)}
      />

      <ConfirmationModal
        isOpen={!!keyToDelete}
        onClose={() => setKeyToDelete(null)}
        onConfirm={confirmDeleteKey}
        title="Delete API Key"
        message={`Are you sure you want to delete the API key "${keyToDelete?.name}"? Any applications using this key will immediately lose access.`}
        confirmText="Delete Key"
        isLoading={!!deletingKeyId}
        variant="danger"
      />
    </PlatformShell>
  );
}
