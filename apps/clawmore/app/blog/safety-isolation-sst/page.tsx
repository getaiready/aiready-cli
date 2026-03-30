import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Safety First: Isolating Intelligence with SST',
  description:
    'Hard boundaries for autonomous AI agents. AWS account vending and SST v4 to secure the serverless agentic swarm ecosystem.',
  slug: 'safety-isolation-sst',
});

export default function BlogPost() {
  return <PostClient />;
}
