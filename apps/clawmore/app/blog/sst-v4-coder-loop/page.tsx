import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'SST v4 & The Coder Loop',
  description:
    'Closing the gap between LLM reasoning and Pulumi-based deployment. Sub-second infrastructure mutations through serverless AI automation and orchestration.',
  slug: 'sst-v4-coder-loop',
});

export default function BlogPost() {
  return <PostClient />;
}
