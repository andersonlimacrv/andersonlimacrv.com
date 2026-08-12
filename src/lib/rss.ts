import rss from '@astrojs/rss';
import type { APIContext, APIRoute } from 'astro';
import { getPublishedPosts, getPostSlug } from './posts';
import { siteUrl } from './site';
import { defaultLocale, localeNames, ui, type Locale } from '../i18n/ui';

export function makeRssHandler(locale: Locale): APIRoute {
  return async function handler(context: APIContext) {
    const t = ui[locale];
    const posts = await getPublishedPosts(locale);
    const baseUrl = locale === defaultLocale ? '' : `/${locale}`;
    return rss({
      title: `Anderson Carvalho — ${t.navBlog}`,
      description:
        locale === "en"
          ? "Mini-blog about development, technology and editorial design for the web."
          : locale === "es"
            ? "Mini-blog sobre desarrollo, tecnología y diseño editorial para la web."
            : "Mini-blog sobre desenvolvimento, tecnologia e design editorial para a web.",
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