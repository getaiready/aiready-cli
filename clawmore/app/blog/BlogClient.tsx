'use client';

import BlogCard from '../../components/BlogCard';
import BlogHero from '../../components/BlogHero';
import Navbar from '../../components/Navbar';

interface BlogClientProps {
  apiUrl: string;
}

const BLOG_POSTS = [
  {
    slug: 'openclaw-chronicles-12-future',
    title: 'The Future: Beyond the Bridge Pattern',
    excerpt:
      'The roadmap to a Managed Business Empire. Exploring the future of fully autonomous business entities and the perpetual evolution of agentic systems.',
    date: 'May 02, 2026',
    readTime: '10 min read',
    hash: 'future',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/bridge-pattern-ephemeral-persistent.png',
  },
  {
    slug: 'openclaw-chronicles-11-sync-architecture',
    title: 'Sync Architecture: Scaling to a Managed Empire',
    excerpt:
      'Cross-account mutation synchronization. How ClawMore manages global infrastructure evolution across thousands of AWS accounts.',
    date: 'Apr 30, 2026',
    readTime: '8 min read',
    hash: 'clawsync',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/eventbridge-the-neural-spine.png',
  },
  {
    slug: 'openclaw-chronicles-10-mutation-tax',
    title: 'The Mutation Tax: Sustainable AI Economics',
    excerpt:
      'Value-based pricing for autonomous agents. Exploring the sustainable economic models that power self-improving AI infrastructure.',
    date: 'Apr 28, 2026',
    readTime: '7 min read',
    hash: 'mutationtax',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/one-dollar-ai-agent.png',
  },
  {
    slug: 'openclaw-chronicles-09-eaas',
    title: 'Evolution-as-a-Service: Managed Hub-and-Spoke',
    excerpt:
      'The architecture of managed evolution. How ClawMore uses a Hub-and-Spoke pattern to manage agentic AWS operations across accounts.',
    date: 'Apr 25, 2026',
    readTime: '8 min read',
    hash: 'eaas',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/cdk-monorepo-mastery.png',
  },
  {
    slug: 'openclaw-chronicles-08-security',
    title: 'Ironclad Autonomy: Security & VPC Isolation',
    excerpt:
      'Safety guards for autonomous agents. Explaining our multi-layered approach to recursion guards and VPC isolation in ClawMore.',
    date: 'Apr 22, 2026',
    readTime: '9 min read',
    hash: 'security',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/ironclad-autonomy-safety-vpc.png',
  },
  {
    slug: 'openclaw-chronicles-07-persistence',
    title: 'Persistence: S3 + DynamoDB State Management',
    excerpt:
      'Scaling local-first state to cloud scale. How we use S3 and DynamoDB to provide a persistent backbone for OpenClaw agents.',
    date: 'Apr 18, 2026',
    readTime: '8 min read',
    hash: 'persistence',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/surviving-void-ephemeral-persistence.png',
  },
  {
    slug: 'openclaw-chronicles-06-self-improvement',
    title: 'Self-Improvement: When Agents Write Their Own Skills',
    excerpt:
      'The "Molt" mechanism. How OpenClaw agents autonomously code new skills to solve complex tasks and expand their capabilities recursively.',
    date: 'Apr 15, 2026',
    readTime: '9 min read',
    hash: 'molt',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/the-reflector-self-critique.png',
  },
  {
    slug: 'openclaw-chronicles-05-heartbeat',
    title: 'The Heartbeat: Scheduling Proactive Intelligence',
    excerpt:
      'Moving from reactive chat to proactive assistance. How OpenClaw wakes itself up to perform tasks without being prompted.',
    date: 'Apr 12, 2026',
    readTime: '7 min read',
    hash: 'heartbeat',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/eventbridge-the-neural-spine.png',
  },
  {
    slug: 'openclaw-chronicles-04-agentskills',
    title: 'AgentSkills: The Standard for Execution',
    excerpt:
      'Moving beyond chat. Exploring the modular skill system that allows OpenClaw to perform real-world actions safely and autonomously.',
    date: 'Apr 08, 2026',
    readTime: '7 min read',
    hash: 'agentskills',
    category: 'CHRONICLES',
    image: 'https://clawmore.getaiready.dev/blog-assets/sst-ion-coder-loop.png',
  },
  {
    slug: 'openclaw-chronicles-03-neural-spine',
    title: "The Message Router: OpenClaw's Neural Spine",
    excerpt:
      'One agent, infinite channels. How OpenClaw unified WhatsApp, Discord, and Slack into a single, proactive nervous system.',
    date: 'Apr 05, 2026',
    readTime: '6 min read',
    hash: 'neuralspine',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/omni-channel-ai-gateway.png',
  },
  {
    slug: 'openclaw-chronicles-02-local-first',
    title: 'OpenClaw 101: The Local-First Philosophy',
    excerpt:
      'Why privacy and performance are the pillars of the next generation of AI agents.',
    date: 'Apr 02, 2026',
    readTime: '6 min read',
    hash: 'localfirst',
    category: 'CHRONICLES',
    image:
      'https://clawmore.getaiready.dev/blog-assets/surviving-void-ephemeral-persistence.png',
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
    image:
      'https://clawmore.getaiready.dev/blog-assets/openclaw-101-agentic-revolution.png',
  },
  {
    slug: 'the-reflector-self-critique',
    title: 'The Reflector: Machines that Self-Critique',
    excerpt:
      'Most AI systems wait for humans to find bugs. Claw finds them itself using autonomous Gap Detection Loops.',
    date: 'Mar 28, 2026',
    readTime: '7 min read',
    hash: 'reflector',
    category: 'AGENTS',
    image:
      'https://clawmore.getaiready.dev/blog-assets/the-reflector-self-critique.png',
  },
  {
    slug: 'surviving-void-ephemeral-persistence',
    title: 'Surviving the Void: Cross-Lifecycle Memory',
    excerpt:
      'How do you keep an AI agent from forgetting its purpose when its runtime is destroyed every 15 minutes? Exploring the S3 + DynamoDB state backbone.',
    date: 'Mar 26, 2026',
    readTime: '8 min read',
    hash: 'ephemeral',
    category: 'ARCHITECTURE',
    image:
      'https://clawmore.getaiready.dev/blog-assets/surviving-void-ephemeral-persistence.png',
  },
  {
    slug: 'sst-ion-coder-loop',
    title: 'SST Ion & The Coder Loop',
    excerpt:
      'Closing the gap between LLM reasoning and Pulumi-based deployment. How we achieve sub-second infrastructure mutations.',
    date: 'Mar 24, 2026',
    readTime: '6 min read',
    hash: 'sstloop',
    category: 'DEVOPS',
    image: 'https://clawmore.getaiready.dev/blog-assets/sst-ion-coder-loop.png',
  },
  {
    slug: 'cdk-monorepo-mastery',
    title: 'Infrastructure as Code: CDK Monorepo Mastery',
    excerpt:
      'Organizing a complex AI backbone into a single, deployable blueprint. How we use AWS CDK and npm workspaces to manage the serverlessclaw monorepo.',
    date: 'Mar 22, 2026',
    readTime: '7 min read',
    hash: 'cdkmono',
    category: 'INFRASTRUCTURE',
    image:
      'https://clawmore.getaiready.dev/blog-assets/cdk-monorepo-mastery.png',
  },
  {
    slug: 'omni-channel-ai-gateway',
    title: 'Omni-Channel Command: One Agent, Six Interfaces',
    excerpt:
      'Integrating Telegram, Discord, Slack, and even iMessage into a unified AI spine. How we built a multi-platform agent that never misses a pulse.',
    date: 'Mar 21, 2026',
    readTime: '8 min read',
    hash: 'omnichan',
    category: 'INTEGRATIONS',
    image:
      'https://clawmore.getaiready.dev/blog-assets/omni-channel-ai-gateway.png',
  },
  {
    slug: 'bridge-pattern-ephemeral-persistent',
    title: 'The Bridge Pattern: HTTP to WebSocket',
    excerpt:
      'Solving the "Persistent connection" problem in a serverless world. How we connect ephemeral Lambda triggers to long-running AI streams.',
    date: 'Mar 20, 2026',
    readTime: '6 min read',
    hash: 'bridge',
    category: 'PATTERNS',
    image:
      'https://clawmore.getaiready.dev/blog-assets/bridge-pattern-ephemeral-persistent.png',
  },
  {
    slug: 'ironclad-autonomy-safety-vpc',
    title: 'Ironclad Autonomy: Safety & VPCs',
    excerpt:
      '"What if it deletes my production database?" Explaining our multi-layered approach to recursion guards and context isolation.',
    date: 'Mar 18, 2026',
    readTime: '9 min read',
    hash: 'safety',
    category: 'SECURITY',
    image:
      'https://clawmore.getaiready.dev/blog-assets/ironclad-autonomy-safety-vpc.png',
  },
  {
    slug: 'eventbridge-the-neural-spine',
    title: 'EventBridge: The Neural Spine',
    excerpt:
      'Mapping the ClawFlow mesh. How asynchronous events allow decoupled agents to coordinate without a central controller.',
    date: 'Mar 14, 2026',
    readTime: '7 min read',
    hash: 'neuralbus',
    category: 'ARCHITECTURE',
    image:
      'https://clawmore.getaiready.dev/blog-assets/eventbridge-the-neural-spine.png',
  },
  {
    slug: 'death-of-the-transient-agent',
    title: 'The Death of the Transient Agent',
    excerpt:
      'Why stateless chat with infrastructure is a dead end. Introducing the case for mutable logic state that persists to source control.',
    date: 'Mar 13, 2026',
    readTime: '6 min read',
    hash: 'transient',
    category: 'ARCHITECTURE',
    image:
      'https://clawmore.getaiready.dev/blog-assets/death-of-the-transient-agent.png',
  },
  {
    slug: 'one-dollar-ai-agent',
    title: 'The $1/Month AI Agent',
    excerpt:
      'Breaking the 24/7 hosting trap. How to run a multi-channel AI backbone for the price of a single coffee.',
    date: 'Mar 12, 2026',
    readTime: '5 min read',
    hash: '1dollarai',
    category: 'INFRASTRUCTURE',
    image:
      'https://clawmore.getaiready.dev/blog-assets/one-dollar-ai-agent.png',
  },
];

export default function BlogClient({ apiUrl }: BlogClientProps) {
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
