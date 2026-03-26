import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getRepository } from '@/lib/db';
import RepoDetailClient from './RepoDetailClient';

interface Props {
  params: { id: string };
}

export default async function RepoDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  const repo = await getRepository(id);
  if (!repo) {
    notFound();
  }

  return <RepoDetailClient repo={repo} />;
}
