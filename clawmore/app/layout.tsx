import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ClawMore | Autonomous Infrastructure Evolution',
    template: '%s | ClawMore',
  },
  description:
    "ClawMore: The world's first autonomous agentic system for AWS. Real-time infrastructure synthesis and self-healing.",
  keywords: [
    'AWS',
    'Autonomous Agents',
    'Infrastructure as Code',
    'SST',
    'Serverless',
    'AI Agents',
    'Self-Healing Infrastructure',
  ],
  authors: [{ name: 'ClawMore Team' }],
  creator: 'ClawMore',
  metadataBase: new URL('https://clawmore.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clawmore.ai',
    siteName: 'ClawMore',
    title: 'ClawMore | Autonomous Infrastructure Evolution',
    description:
      "The world's first autonomous agentic system for AWS. Real-time infrastructure synthesis and self-healing.",
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'ClawMore - Autonomous Infrastructure Evolution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClawMore | Autonomous Infrastructure Evolution',
    description:
      "The world's first autonomous agentic system for AWS. Real-time infrastructure synthesis and self-healing.",
    creator: '@clawmore',
    images: ['/og-home.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

import { headers } from 'next/headers';
import Providers from '../components/Providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const locale = headerList.get('X-NEXT-LOCALE') || 'en';

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-left`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
