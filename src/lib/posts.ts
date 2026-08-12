import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

export type BlogPost = CollectionEntry<'blog'>;

export function getPostSlug(post: BlogPost): string {
  return post.id.split('/').pop() ?? post.id;
}

const WORDS_PER_MINUTE = 200;

export async function getPublishedPosts(locale: Locale = 'pt'): Promise<BlogPost[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) => !data.draft && data.lang === locale,
  );
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export function getReadingTime(post: BlogPost): number {
  const raw = post.body ?? '';
  const words = raw.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function getRelatedPosts(
  post: BlogPost,
  all: BlogPost[],
  limit = 3,
): BlogPost[] {
  const postTags = new Set(post.data.tags);
  const sameLang = all.filter((p) => p.data.lang === post.data.lang);
  const byTag = sameLang.filter(
    (p) =>
      p.id !== post.id && p.data.tags.some((tag) => postTags.has(tag)),
  );
  const fallback = sameLang
    .filter((p) => p.id !== post.id)
    .sort(
      (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );
  return byTag.length > 0 ? byTag.slice(0, limit) : fallback.slice(0, limit);
}

export function formatDate(date: Date, locale: Locale = 'pt'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}