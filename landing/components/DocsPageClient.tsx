'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AgentPrompt from '@/components/AgentPrompt';
import { tools } from '@/components/docs/ToolData';
import DocsSidebar from '@/components/docs/DocsSidebar';
import GettingStarted from '@/components/docs/GettingStarted';
import DocsToolDetails from '@/components/docs/DocsToolDetails';
import DocsUnifiedCli from '@/components/docs/DocsUnifiedCli';
import { ScoringSection, MetricsSection } from '@/components/docs/DocsSections';

export default function DocsPageClient() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [selectedTool, setSelectedTool] = useState(tools[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />

      <div className="container mx-auto px-4 py-12 flex gap-8">
        <DocsSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-1 max-w-4xl">
          <GettingStarted />

          {/* Use with AI Agent Section */}
          <section id="ai-agent" className="mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Use with AI Agent
              </span>
            </h2>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-6">
              <p className="text-slate-700 mb-4">
                Prefer using AI agents like <strong>Cline</strong>,{' '}
                <strong>Cursor</strong>, or <strong>GitHub Copilot</strong>?
                Copy these ready-to-use prompts.
              </p>
            </div>

            <div className="space-y-6">
              <AgentPrompt
                title="AI Readiness Scan"
                description="Use this prompt to have your agent perform a full AI-Readiness scan of your codebase."
                prompt="Run 'npx @aiready/cli scan' and analyze the output. Identify the top 3 areas where my codebase is confusing for AI models (semantic duplicates, context window fragmentation, or naming inconsistencies) and suggest specific fixes."
              />
              <AgentPrompt
                title="Semantic Duplicate Check"
                description="Ask your agent to look for logic duplication across the codebase."
                prompt="Run 'npx @aiready/cli pattern-detect' and find semantic duplicates. Show me instances where we have similar logic implemented multiple times in different files, which might be wasting our context window."
              />
            </div>
          </section>

          {/* Combined Metrics Section */}
          <section id="scoring" className="mb-16">
            <ScoringSection />
          </section>

          <section id="metrics" className="mb-16">
            <MetricsSection />
          </section>

          {/* Unified CLI Section */}
          <section id="cli" className="mb-16">
            <DocsUnifiedCli />
          </section>

          {/* Tool Details Section */}
          <section id="tools" className="mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-8">
              Analysis{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tools
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedTool.id === tool.id
                      ? 'bg-blue-50 border-blue-400 shadow-md scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-2xl ${
                      selectedTool.id === tool.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-slate-900">{tool.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-1">
                    {tool.description}
                  </p>
                </button>
              ))}
            </div>

            <DocsToolDetails tool={selectedTool} />
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
