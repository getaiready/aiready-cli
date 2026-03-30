'use client';

import BlogCard from '../../components/BlogCard';
import BlogHero from '../../components/BlogHero';
import Navbar from '../../components/Navbar';

interface BlogClientProps {
  apiUrl: string;
}

const BLOG_POSTS = [
  {
    slug: 'harvester-collective-intelligence',
    title: 'The Harvester: How Your Wins Help Everyone',
    excerpt:
      'Intelligence scales at the speed of the fastest innovator. How individual mutations fuel global agentic swarm evolution through agent-to-agent collaboration.',
    date: 'Apr 02, 2026',
    readTime: '6 min read',
    hash: 'collective',
    category: 'MUTATION LOG',
    image: '/blog-assets/harvester-collective.png',
  },
  {
    slug: 'safety-isolation-sst',
    title: 'Safety First: Isolating Intelligence with SST',
    excerpt:
      'Hard boundaries for autonomous agents. How we use AWS account vending and SST v4 to secure the Eclawnomy.',
    date: 'Apr 01, 2026',
    readTime: '7 min read',
    hash: 'isolation',
    category: 'MUTATION LOG',
    image: '/blog-assets/safety-isolation.png',
  },
  {
    slug: 'zero-idle-scaling',
    title: 'Why $0 Idle is the Only Way to Scale',
    excerpt:
      'The economics of the serverless agentic era require a fundamental shift: from uptime to on-demand AI automation and intelligence.',
    date: 'Mar 31, 2026',
    readTime: '5 min read',
    hash: 'zeroidle',
    category: 'MUTATION LOG',
    image: '/blog-assets/zero-idle-scaling.png',
  },
  {
    slug: 'the-great-decoupling-01-audit',
    title: 'The Great Decoupling: Part 1 - Auditing the Monolith',
    excerpt:
      'How to audit a legacy repository for serverless agentic readiness. Identifying the "Wall" before your AI agent hits it.',
    date: 'Mar 22, 2026',
    readTime: '9 min read',
    hash: 'audit',
    category: 'DECOUPLING',
    image: '/blog-assets/the-great-decoupling-01-audit.png',
  },
  {
    slug: 'the-great-decoupling-02-first-cut',
    title: 'The Great Decoupling: Part 2 - The First Cut',
    excerpt:
      'Moving from audit to action. How to safely decouple your first module for serverless AI agent discoverability and agentic orchestration.',
    date: 'Mar 24, 2026',
    readTime: '7 min read',
    hash: 'firstcut',
    category: 'DECOUPLING',
    image: '/blog-assets/the-great-decoupling-02-first-cut.png',
  },
  {
    slug: 'the-great-decoupling-03-protocol',
    title: 'The Great Decoupling: Part 3 - The Agentic Protocol',
    excerpt:
      'The final bridge. Wrapping decoupled modules in a universal protocol for maximum serverless AI agent leverage and agent-to-agent collaboration.',
    date: 'Mar 26, 2026',
    readTime: '8 min read',
    hash: 'protocol',
    category: 'DECOUPLING',
    image: '/blog-assets/the-great-decoupling-03-protocol.png',
  },
  {
    slug: 'openclaw-chronicles-12-future',
    title: 'The Future: Beyond the Bridge Pattern',
    excerpt:
      'The roadmap to a Managed Business Empire. The future of fully autonomous serverless agentic systems and multi-human multi-agent collaboration.',
    date: 'May 02, 2026',
    readTime: '10 min read',
    hash: 'future',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-12-future.png',
  },
  {
    slug: 'openclaw-chronicles-11-sync-architecture',
    title: 'Sync Architecture: Scaling to a Managed Empire',
    excerpt:
      'Cross-account mutation synchronization. ClawMore manages serverless agent-to-agent collaboration and AI orchestration across thousands of AWS accounts.',
    date: 'Apr 30, 2026',
    readTime: '8 min read',
    hash: 'clawsync',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-11-sync-architecture.png',
  },
  {
    slug: 'openclaw-chronicles-10-mutation-tax',
    title: 'The Mutation Tax: Sustainable AI Economics',
    excerpt:
      'Value-based pricing for autonomous serverless AI agents. Sustainable economic models powering self-improving agentic infrastructure.',
    date: 'Apr 28, 2026',
    readTime: '7 min read',
    hash: 'mutationtax',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-10-mutation-tax.png',
  },
  {
    slug: 'openclaw-chronicles-09-eaas',
    title: 'Evolution-as-a-Service: Managed Hub-and-Spoke',
    excerpt:
      "The architecture of managed evolution. ClawMore's Hub-and-Spoke pattern for serverless agentic swarm AI orchestration across AWS accounts.",
    date: 'Apr 25, 2026',
    readTime: '8 min read',
    hash: 'eaas',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-09-eaas.png',
  },
  {
    slug: 'openclaw-chronicles-08-security',
    title: 'Ironclad Autonomy: Security & VPC Isolation',
    excerpt:
      "Safety guards for autonomous serverless agentic systems. Multi-layered recursion guards and VPC isolation in ClawMore's AI orchestration platform.",
    date: 'Apr 22, 2026',
    readTime: '9 min read',
    hash: 'security',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-08-security.png',
  },
  {
    slug: 'openclaw-chronicles-07-persistence',
    title: 'Persistence: S3 + DynamoDB State Management',
    excerpt:
      'Scaling local-first state to cloud scale. How S3 and DynamoDB provide a persistent backbone for serverless OpenClaw AI agents.',
    date: 'Apr 18, 2026',
    readTime: '8 min read',
    hash: 'persistence',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-07-persistence.png',
  },
  {
    slug: 'openclaw-chronicles-06-self-improvement',
    title: 'Self-Improvement: When Agents Write Their Own Skills',
    excerpt:
      'The "Molt" mechanism. How OpenClaw serverless AI agents autonomously code new skills through AI automation, expanding capabilities via agent-to-agent collaboration.',
    date: 'Apr 15, 2026',
    readTime: '9 min read',
    hash: 'molt',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-06-self-improvement.png',
  },
  {
    slug: 'openclaw-chronicles-05-heartbeat',
    title: 'The Heartbeat: Scheduling Proactive Intelligence',
    excerpt:
      'Moving from reactive chat to proactive assistance. How OpenClaw serverless agents wake up for human-to-agent collaboration without being prompted.',
    date: 'Apr 12, 2026',
    readTime: '7 min read',
    hash: 'heartbeat',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-05-heartbeat.png',
  },
  {
    slug: 'openclaw-chronicles-04-agentskills',
    title: 'AgentSkills: The Standard for Execution',
    excerpt:
      'Moving beyond chat. The modular skill system that allows OpenClaw serverless AI agents to perform real-world actions through AI automation and orchestration.',
    date: 'Apr 08, 2026',
    readTime: '7 min read',
    hash: 'agentskills',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-04-agentskills.png',
  },
  {
    slug: 'openclaw-chronicles-03-neural-spine',
    title: "The Message Router: OpenClaw's Neural Spine",
    excerpt:
      'One agent, infinite channels. How OpenClaw unified WhatsApp, Discord, and Slack into a single serverless AI orchestration backbone for agent-to-agent collaboration.',
    date: 'Apr 05, 2026',
    readTime: '6 min read',
    hash: 'neuralspine',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-03-neural-spine.png',
  },
  {
    slug: 'openclaw-chronicles-02-local-first',
    title: 'OpenClaw 101: The Local-First Philosophy',
    excerpt:
      'Why privacy and performance are the pillars of the next generation of serverless AI agents. The simple openclaw approach to local-first agentic systems.',
    date: 'Apr 02, 2026',
    readTime: '6 min read',
    hash: 'localfirst',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-02-local-first.png',
  },
  {
    slug: 'openclaw-chronicles-01-origin-story',
    title: 'The Origin Story: From Clawdbot to 250k Stars',
    excerpt:
      'The untold story of OpenClaw’s meteoric rise to 250,000 GitHub stars and the birth of the Lobster Phenomenon.',
    date: 'Mar 29, 2026',
    readTime: '8 min read',
    hash: 'origin',
    category: 'CHRONICLES',
    image: '/blog-assets/openclaw-chronicles-01-origin-story.png',
  },
  {
    slug: 'the-reflector-self-critique',
    title: 'The Reflector: Machines that Self-Critique',
    excerpt:
      'Most AI systems wait for humans to find bugs. ClawMore serverless AI agents find their own bugs using autonomous Gap Detection Loops for human-to-agent collaboration.',
    date: 'Mar 28, 2026',
    readTime: '7 min read',
    hash: 'reflector',
    category: 'AGENTS',
    image: '/blog-assets/the-reflector-self-critique.png',
  },
  {
    slug: 'surviving-void-ephemeral-persistence',
    title: 'Surviving the Void: Cross-Lifecycle Memory',
    excerpt:
      'How do you keep a serverless AI agent from forgetting its purpose when its runtime is destroyed every 15 minutes? S3 + DynamoDB state backbone for agentic systems.',
    date: 'Mar 26, 2026',
    readTime: '8 min read',
    hash: 'ephemeral',
    category: 'ARCHITECTURE',
    image: '/blog-assets/surviving-void-ephemeral-persistence.png',
  },
  {
    slug: 'sst-ion-coder-loop',
    title: 'SST v4 & The Coder Loop',
    excerpt:
      'Closing the gap between LLM reasoning and Pulumi-based deployment. Sub-second infrastructure mutations through serverless AI automation and orchestration.',
    date: 'Mar 24, 2026',
    readTime: '6 min read',
    hash: 'sstloop',
    category: 'DEVOPS',
    image: '/blog-assets/sst-ion-coder-loop.png',
  },
  {
    slug: 'cdk-monorepo-mastery',
    title: 'Infrastructure as Code: CDK Monorepo Mastery',
    excerpt:
      'Organizing complex serverless AI agent infrastructure into a single deployable blueprint. AWS CDK and npm workspaces for agentic systems.',
    date: 'Mar 22, 2026',
    readTime: '7 min read',
    hash: 'cdkmono',
    category: 'INFRASTRUCTURE',
    image: '/blog-assets/cdk-monorepo-mastery.png',
  },
  {
    slug: 'omni-channel-ai-gateway',
    title: 'Omni-Channel Command: One Agent, Six Interfaces',
    excerpt:
      'Integrating Telegram, Discord, Slack, and iMessage into a unified serverless AI orchestration spine. A multi-platform AI agent that never misses a pulse.',
    date: 'Mar 21, 2026',
    readTime: '8 min read',
    hash: 'omnichan',
    category: 'INTEGRATIONS',
    image: '/blog-assets/omni-channel-ai-gateway.png',
  },
  {
    slug: 'bridge-pattern-ephemeral-persistent',
    title: 'The Bridge Pattern: HTTP to WebSocket',
    excerpt:
      'Solving persistent connection in a serverless world. Connecting ephemeral Lambda triggers to long-running AI agent streams for AI automation.',
    date: 'Mar 20, 2026',
    readTime: '6 min read',
    hash: 'bridge',
    category: 'PATTERNS',
    image: '/blog-assets/bridge-pattern-ephemeral-persistent.png',
  },
  {
    slug: 'ironclad-autonomy-safety-vpc',
    title: 'Ironclad Autonomy: Safety & VPCs',
    excerpt:
      "Multi-layered security for autonomous serverless AI agents. Context isolation and safety guards in ClawMore's agentic swarm platform.",
    date: 'Mar 18, 2026',
    readTime: '9 min read',
    hash: 'safety',
    category: 'SECURITY',
    image: '/blog-assets/ironclad-autonomy-safety-vpc.png',
  },
  {
    slug: 'eventbridge-the-neural-spine',
    title: 'EventBridge: The Neural Spine',
    excerpt:
      'Mapping the ClawFlow mesh. How asynchronous events enable serverless agent-to-agent collaboration and AI orchestration without a central controller.',
    date: 'Mar 14, 2026',
    readTime: '7 min read',
    hash: 'neuralbus',
    category: 'ARCHITECTURE',
    image: '/blog-assets/eventbridge-the-neural-spine.png',
  },
  {
    slug: 'death-of-the-transient-agent',
    title: 'The Death of the Transient Agent',
    excerpt:
      'Why stateless chat with infrastructure is a dead end. The case for mutable logic state in serverless agentic AI systems that persists to source control.',
    date: 'Mar 13, 2026',
    readTime: '6 min read',
    hash: 'transient',
    category: 'ARCHITECTURE',
    image: '/blog-assets/death-of-the-transient-agent.png',
  },
  {
    slug: 'one-dollar-ai-agent',
    title: 'The $1/Month AI Agent',
    excerpt:
      'Breaking the 24/7 hosting trap. How to run a serverless multi-channel AI agent backbone for the price of a single coffee using simple openclaw patterns.',
    date: 'Mar 12, 2026',
    readTime: '5 min read',
    hash: '1dollarai',
    category: 'INFRASTRUCTURE',
    image: '/blog-assets/one-dollar-ai-agent.png',
  },
];

export default function BlogClient({ apiUrl: _apiUrl }: BlogClientProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar variant="post" />
      <BlogHero />

      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
}
