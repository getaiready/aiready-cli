/**
 * Blog post types - shared types for blog posts.
 * This file contains only type definitions to avoid circular dependencies.
 */

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags?: string[];
  readingTime: string;
  cover: string;
  ogImage?: string;
};

export type BlogPostEntry<T = any> = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  readingTime: string;
  cover: string;
  ogImage: string;
  Content: T;
};
