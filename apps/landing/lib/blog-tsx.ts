import {
  posts as staticPosts,
  getPostBySlug as getPostBySlugFromRegistry,
} from '../../landing/content/blog-tsx/index';
import type { BlogPostMeta } from '../../landing/content/blog-tsx/posts-registry';
import React from 'react';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  readingTime: string;
  cover?: string;
  ogImage?: string;
  Content: React.ComponentType<object>;
};

export async function getAllPosts(): Promise<Omit<BlogPost, 'Content'>[]> {
  // Metadata already sorted, just ensure tags is always an array
  return staticPosts.map((meta) => ({
    slug: meta.slug,
    title: meta.title,
    date: meta.date,
    excerpt: meta.excerpt,
    author: meta.author,
    tags: meta.tags || [],
    readingTime: meta.readingTime,
    cover: meta.cover,
    ogImage: meta.ogImage,
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await getPostBySlugFromRegistry(slug);
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    author: post.author,
    tags: post.tags,
    readingTime: post.readingTime,
    cover: post.cover,
    ogImage: post.ogImage,
    Content: post.Content,
  };
}
