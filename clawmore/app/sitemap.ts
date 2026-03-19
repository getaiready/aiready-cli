import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://clawmore.getaiready.dev';

  const blogPosts = [
    'openclaw-chronicles-12-future',
    'openclaw-chronicles-11-sync-architecture',
    'openclaw-chronicles-10-mutation-tax',
    'openclaw-chronicles-09-eaas',
    'openclaw-chronicles-08-security',
    'openclaw-chronicles-07-persistence',
    'openclaw-chronicles-06-self-improvement',
    'openclaw-chronicles-05-heartbeat',
    'openclaw-chronicles-04-agentskills',
    'openclaw-chronicles-03-neural-spine',
    'openclaw-chronicles-02-local-first',
    'openclaw-chronicles-01-origin-story',
    'bridge-pattern-ephemeral-persistent',
    'cdk-monorepo-mastery',
    'death-of-the-transient-agent',
    'eventbridge-the-neural-spine',
    'ironclad-autonomy-safety-vpc',
    'omni-channel-ai-gateway',
    'one-dollar-ai-agent',
    'sst-ion-coder-loop',
    'surviving-void-ephemeral-persistence',
    'the-reflector-self-critique',
  ];

  const routes = ['', '/blog', '/pricing', '/evolution'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const blogRoutes = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes];
}
