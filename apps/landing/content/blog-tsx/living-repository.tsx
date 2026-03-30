import meta from './living-repository.meta';
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Cpu } from 'lucide-react';

const Post = () => (
  <>
    <blockquote>
      Part 12 of our series:{' '}
      <strong>
        &quot;The Agentic Readiness Shift: Building for Autonomous
        Engineers.&quot;
      </strong>
    </blockquote>

    <div className="my-12 max-w-5xl mx-auto text-center">
      <img
        src="/agentic-shift-series-12.png"
        alt="The Living Repository Cover"
        className="w-full h-auto rounded-3xl mb-12 shadow-2xl border border-white/5"
      />
    </div>

    <h2>The Complexity Problem</h2>
    <p>
      An autonomous engineering system isn&apos;t just code; it&apos;s a complex
      web of infrastructure, IAM roles, event buses, and compute nodes.
      Configuring these by hand is a recipe for catastrophic failure. We need a
      way to version our entire architecture alongside our logic. This is the
      concept of the <strong>Living Repository</strong>.
    </p>

    <h2>The Monorepo Blueprint</h2>
    <p>
      By using a monorepo structure (like <strong>AIReady</strong>), we organize
      our engine into discrete, reusable packages. The infrastructure package
      contains the blueprint (written in <strong>AWS CDK</strong> or{' '}
      <strong>SST v4</strong>) that defines exactly how these pieces fit
      together.
    </p>

    <div className="bg-slate-900 rounded-2xl p-8 my-12 border border-slate-800">
      <div className="text-cyber-purple font-mono text-[10px] uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
        CLAW_BLUEPRINT.ts (MASTER)
      </div>
      <pre className="text-xs font-mono text-zinc-300 overflow-x-auto">
        {`export class NeuralSpineStack extends Stack {
  constructor(scope: Construct, id: string) {
    const bus = new EventBus(this, 'NeuralBus');
    const table = new Table(this, 'StateStore', {
      partitionKey: { name: 'pk', type: AttributeType.STRING }
    });
    
    // Link the reasoning engine to the spine
    new Engine(this, 'AutonomousNode', { bus, table });
  }
}`}
      </pre>
    </div>

    <h2>The Series Finale: The Path Forward</h2>
    <p>
      This concludes our 12-part exploration of the{' '}
      <strong>Agentic Readiness Shift</strong>. We have moved from identifying
      context fragmentation to building a persistent, event-driven, and
      self-healing autonomous team.
    </p>
    <p>
      The code is open. The architecture is proven. The shift from &quot;AI as a
      tool&quot; to &quot;Agentic Systems as Infrastructure&quot; is well
      underway. The only question left is:{' '}
      <strong>Is your repository ready to live?</strong>
    </p>

    <p className="text-xl font-medium text-indigo-300">
      The future of software isn&apos;t just written; it is evolved. Welcome to
      the era of the Living Repository.
    </p>

    <hr className="my-12 border-slate-200 dark:border-zinc-800" />

    <p>
      <strong>Read &quot;The Agentic Readiness Shift&quot; series:</strong>
    </p>
    <ul className="list-disc pl-6 mb-4 space-y-2 text-sm">
      <li>
        <Link
          href="/blog/the-agentic-wall"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 1: The Agentic Wall (Context Fragmentation)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/beyond-the-sidekick"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 2: Beyond the Sidekick (Rise of the Agentic System)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/the-economic-moat"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 3: The Economic Moat (Quantifying AI ROI)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/the-neural-spine"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 4: The Neural Spine (Event-Driven Orchestration)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/closing-the-loop"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 5: Closing the Loop (Git as a Runtime)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/cognitive-tiering"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 6: Cognitive Tiering (Multi-Headed Brain)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/resilience-fortress"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 7: The Resilience Fortress (Death of the Transient Agent)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/observability-intelligence"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 8: Observability as Intelligence (Self-Critique)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/human-agent-co-management"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 9: Human-Agent Co-Management (New Engineering Culture)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/recursive-safety"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 10: Recursive Safety (VPCs and Guards)
        </Link>
      </li>
      <li>
        <Link
          href="/blog/roadmap-to-autonomy"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Part 11: Roadmap to Autonomy ($1/Month Agent)
        </Link>
      </li>
      <li>
        <strong>
          Part 12: The Living Repository (Infrastructure Blueprint) ← You are
          here
        </strong>
      </li>
    </ul>

    <div className="mt-12 p-8 bg-blue-50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 rounded-3xl group">
      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
        <Cpu className="w-4 h-4" />
        New Series
      </div>
      <h3 className="text-2xl font-black mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        MCP Superpowers: Leveraging the Model Context Protocol
      </h3>
      <p className="text-slate-600 dark:text-zinc-400 mb-6">
        Ready to give your agents deep repository awareness? Explore how the
        Modelt Context Protocol is changing the agentic landscape.
      </p>
      <Link
        href="/blog/mcp-superpowers-context-aware"
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
      >
        Start the MCP Series
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </>
);

export default Post;
