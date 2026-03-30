/**
 * Posts registry - manages blog post registrations.
 * Metadata is stored statically (small footprint), content is loaded dynamically.
 */

import { allPostMeta } from './all-meta';
import { type BlogPostMeta, type BlogPostEntry } from './types';

// Re-export types for convenience
export type { BlogPostMeta, BlogPostEntry } from './types';

/**
 * Get all blog post metadata (static, no content loaded)
 */
export function getAllPostMeta(): BlogPostMeta[] {
  return [...allPostMeta].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get a blog post by slug (loads content dynamically)
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPostEntry | null> {
  // Import content loaders dynamically to avoid circular dependencies
  const { contentLoaders } = await import('./content-loaders');

  const meta = allPostMeta.find((m) => m.slug === slug);
  if (!meta) return null;

  const loader = contentLoaders[slug];
  if (!loader) return null;

  try {
    const { default: Content } = await loader();

    return {
      slug: meta.slug,
      title: meta.title,
      date: meta.date,
      excerpt: meta.excerpt,
      author: meta.author,
      tags: meta.tags || [],
      readingTime: meta.readingTime,
      cover: meta.cover,
      ogImage: meta.ogImage || meta.cover,
      Content,
    };
  } catch (error) {
    console.error(`Failed to load post content: ${slug}`, error);
    return null;
  }
}

/**
 * Helper function to create a post entry from meta and Content.
 */
export function createPostEntry<T>(
  meta: BlogPostMeta,
  Content: T
): BlogPostEntry<T> {
  return {
    slug: meta.slug,
    title: meta.title,
    date: meta.date,
    excerpt: meta.excerpt,
    author: meta.author,
    tags: meta.tags || [],
    readingTime: meta.readingTime,
    cover: meta.cover,
    ogImage: meta.ogImage || meta.cover,
    Content,
  };
}
