import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'sonner';
import {
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
  generateWebSiteSchema,
  aiMetaTags,
  PLATFORM_BASE_URL,
} from '@/lib/seo-schema';
import FeedbackWidget from '@/components/FeedbackWidget';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(PLATFORM_BASE_URL),
  title: {
    default: 'AIReady Platform - Make Your Codebase AI-Ready',
    template: '%s | AIReady Platform',
  },
  description:
    'Free tools to optimize your codebase for AI collaboration. Detect semantic duplicates, analyze context windows, and maintain consistency that AI models understand.',
  keywords: [
    'AI codebase optimization',
    'semantic duplicate detection',
    'context window analysis',
    'code consistency checker',
    'AI readiness score',
    'developer metrics',
  ],
  authors: [{ name: 'AIReady Team', url: 'https://getaiready.dev' }],
  openGraph: {
    title: 'AIReady Platform - Make Your Codebase AI-Ready',
    description:
      'Monitor, analyze, and improve your codebase AI readiness with our automated tools.',
    url: PLATFORM_BASE_URL,
    siteName: 'AIReady Platform',
    images: [
      {
        url: 'https://getaiready.dev/logo-text.png',
        width: 1200,
        height: 630,
        alt: 'AIReady Platform - AI-Ready Codebase Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIReady Platform - Make Your Codebase AI-Ready',
    description:
      'Free tools to optimize your codebase for AI collaboration. Detect semantic duplicates, analyze context windows, and maintain consistency.',
    images: ['https://getaiready.dev/logo-text.png'],
    creator: '@aireadytools',
  },
  other: {
    'chatgpt:description': aiMetaTags.chatgpt['chatgpt:description'],
    'chatgpt:category': aiMetaTags.chatgpt['chatgpt:category'],
    'perplexity:summary': aiMetaTags.perplexity['perplexity:summary'],
    'perplexity:intent': aiMetaTags.perplexity['perplexity:intent'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const softwareSchema = generateSoftwareApplicationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en">
      <head>
        <Script
          id="organization-schema-platform"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="software-schema-platform"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <Script
          id="website-schema-platform"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" theme="dark" richColors />
        <FeedbackWidget />
      </body>
    </html>
  );
}
