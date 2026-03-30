/**
 * Blog posts index - exports metadata only (small footprint).
 * Content is loaded dynamically when needed via getPostBySlug().
 * This keeps context budget low while maintaining full functionality.
 */
import { allPostMeta } from './all-meta';

// Re-export types and functions
export type { BlogPostMeta, BlogPostEntry } from './types';
export { getPostBySlug } from './posts-registry';

// Export sorted metadata (small footprint - no React components)
export const posts = [...allPostMeta].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
