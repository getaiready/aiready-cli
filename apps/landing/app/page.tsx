'use client';

import Script from 'next/script';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import AnimatedHero from '../components/AnimatedHero';
import FloatingElements from '../components/FloatingElements';
import { Header } from '../components/Header';
import Modal from '../components/Modal';
import RequestForm from '../components/RequestForm';
import {
  generateBreadcrumbSchema,
  generateWebsiteSchema,
  generateProductSchema,
  generateHowToSchema,
} from '../lib/seo';

// Dynamic imports for below-the-fold components
const Benefits = dynamic(() =>
  import('../components/Benefits').then((mod) => ({ default: mod.Benefits }))
);
const ChartsClient = dynamic(() => import('../components/ChartsClient'));
const LiveScanDemo = dynamic(() => import('../components/LiveScanDemo'));
const Features = dynamic(() =>
  import('../components/Features').then((mod) => ({ default: mod.Features }))
);
const AIReadinessScore = dynamic(() =>
  import('../components/AIReadinessScore').then((mod) => ({
    default: mod.AIReadinessScore,
  }))
);
const NotAnotherLinter = dynamic(() =>
  import('../components/NotAnotherLinter').then((mod) => ({
    default: mod.NotAnotherLinter,
  }))
);
const Testimonials = dynamic(() =>
  import('../components/Testimonials').then((mod) => ({
    default: mod.Testimonials,
  }))
);
const CTA = dynamic(() =>
  import('../components/CTA').then((mod) => ({ default: mod.CTA }))
);
const FAQ = dynamic(() =>
  import('../components/FAQ').then((mod) => ({ default: mod.FAQ }))
);
const Footer = dynamic(() =>
  import('../components/Footer').then((mod) => ({ default: mod.Footer }))
);
const ConsultantsSection = dynamic(() =>
  import('../components/ConsultantsSection').then((mod) => ({
    default: mod.ConsultantsSection,
  }))
);
const AIOptimizedContent = dynamic(() =>
  import('../components/AIOptimizedContent').then((mod) => ({
    default: mod.AIOptimizedContent,
  }))
);

export default function HomePage() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const openAuditModal = () => setIsAuditModalOpen(true);
  const closeAuditModal = () => setIsAuditModalOpen(false);

  // SEO Structured Data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
  ]);

  const websiteSchema = generateWebsiteSchema();

  const productSchema = generateProductSchema();

  const howToSchema = generateHowToSchema({
    name: 'How to Make Your Codebase AI-Ready',
    description:
      'Step-by-step guide to optimize your codebase for AI collaboration',
    totalTime: 'PT5M',
    steps: [
      {
        name: 'Install AIReady CLI',
        text: 'Run npx @aiready/cli scan in your project directory',
        url: '/#get-started',
      },
      {
        name: 'Review Analysis Results',
        text: 'Check the detailed report showing semantic duplicates, context analysis, and consistency issues',
      },
      {
        name: 'Fix Issues',
        text: 'Address the identified issues to improve AI collaboration',
      },
      {
        name: 'Track Progress',
        text: 'Run regular scans to maintain your AI Readiness Score',
      },
    ],
  });

  return (
    <>
      {/* SEO Structured Data */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-x-hidden">
        {/* AI-Optimized Hidden Content for Search Engines */}
        <AIOptimizedContent />

        <FloatingElements />

        <Header />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32 relative">
          <AnimatedHero onOpenAudit={openAuditModal} />
        </section>

        {/* Live Scan Demo Section */}
        <section id="live-demo">
          <LiveScanDemo />
        </section>

        {/* Benefits Section (white) to replace standalone stats */}
        <Benefits />

        {/* Charts Section - Split layout (client-only) */}
        <ChartsClient />

        <Features />

        <AIReadinessScore />

        <NotAnotherLinter />

        <ConsultantsSection />

        <Testimonials />

        <CTA onOpenAudit={openAuditModal} />

        <FAQ />

        <Footer />

        {/* Audit Modal */}
        <Modal
          isOpen={isAuditModalOpen}
          onClose={closeAuditModal}
          maxWidth="max-w-3xl"
        >
          <RequestForm
            title="Request a Personalized Codebase Audit"
            description="Our experts will analyze your repository and provide a comprehensive strategy session."
            showGlow={false}
            isModal={true}
          />
        </Modal>
      </div>
    </>
  );
}
