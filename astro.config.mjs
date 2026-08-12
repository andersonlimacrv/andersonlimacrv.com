// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://andersonlimacrv.com',
  integrations: [sitemap()],
  i18n: {
    locales: ['pt', 'es', 'en'],
    defaultLocale: 'pt',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // HTML minificado no build (default true no Astro 7 — declarado explicitamente
  // para documentar intenção e evitar surpresas em bumps futuros).
  compressHTML: true,
  build: {
    // Inline automático de CSS pequeno (≤4kB) — reduz uma round-trip no first paint.
    inlineStylesheets: 'auto',
  },
  // Prefetch experimental: pré-carrega links internos no hover.
  prefetch: {
    defaultStrategy: 'hover',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
