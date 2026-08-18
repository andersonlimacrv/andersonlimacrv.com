import rss from '@astrojs/rss';
import type { APIContext, APIRoute } from 'astro';
import { getPublishedPosts, getPostSlug } from './posts';
import { siteUrl, site } from '../data/site';
import { defaultLocale, localeNames, ui, type Locale } from '../i18n/ui';

export function makeRssHandler(locale: Locale): APIRoute {
  return async function handler(context: APIContext) {
    const t = ui[locale];
    const posts = await getPublishedPosts(locale);
    const baseUrl = locale === defaultLocale ? '' : `/${locale}`;
    return rss({
      title: `${site.name} — ${t.navBlog}`,
      description: t.meta.blogDescription,
      site: context.site ?? siteUrl,
      items: posts.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `${baseUrl}/blog/${getPostSlug(post)}`,
        categories: post.data.tags,
      })),
      customData: `<language>${localeNames[locale]}</language>`,
    });
  };
}