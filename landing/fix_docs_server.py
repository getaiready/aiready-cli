import os

page_content = """import { Metadata } from 'next';
import DocsPageClient from '@/components/DocsPageClient';

export const metadata: Metadata = {
  title: 'Documentation - AIReady',
  description: 'Learn how to use AIReady tools to assess and improve your codebases AI-readiness.',
  openGraph: {
    title: 'Documentation - AIReady',
    description: 'Learn how to use AIReady tools to assess and improve your codebases AI-readiness.',
    images: ['https://getaiready.dev/logo-text.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation - AIReady',
    description: 'Learn how to use AIReady tools to assess and improve your codebases AI-readiness.',
    images: ['https://getaiready.dev/logo-text.png'],
  },
};

export default function DocsPage() {
  return <DocsPageClient />;
}
"""

with open('landing/app/docs/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_content)
