## Why

O repositório está vazio (sem código de aplicação) e o site andersonlimacrv.com precisa nascer como um projeto Astro + Tailwind escalável. Este change cria a fundação técnica sobre a qual todas as demais capabilities (home, blog, SEO, motion, responsivo) serão construídas.

## What Changes

- Cria o scaffold do projeto Astro 5 (SSG, zero JS por padrão) com TypeScript.
- Integra Tailwind CSS v4 via plugin Vite (config por CSS, sem `tailwind.config.js`).
- Configura `astro.config.mjs` com site URL, integrações `@astrojs/sitemap` e `@astrojs/rss`.
- Habilita View Transitions (`astro:transitions`) no config.
- Cria `src/styles/global.css` base com import do Tailwind e camadas base.
- Cria `BaseLayout.astro` com `<head>` completo, skip-link, header/footer vazios (conteúdo vem em changes posteriores).
- Instala fontes variáveis self-hosted via `@fontsource`: Manrope, JetBrains Mono, Fraunces.
- Cria a estrutura de pastas esperada (`src/components`, `src/content`, `src/layouts`, `src/pages`, `public`).
- Adiciona `src/content/config.ts` (vazio por ora) para habilitar Content Collections.
- Scripts npm: `dev`, `build`, `preview`, `astro check`.
- `.gitignore` adequado ao projeto Astro.
- **BREAKING**: n/a — projeto novo.

## Capabilities

### New Capabilities
- `site-foundation`: Scaffold do projeto Astro + Tailwind, build SSG funcional, layouts base e fontes self-hosted que todas as outras capabilities consomem.

### Modified Capabilities
<!-- nenhuma — repositório sem specs existentes -->

## Impact

- Dependências novas: astro, tailwindcss, @astrojs/sitemap, @astrojs/rss, @fontsource/*, typescript.
- Estrutura de diretórios nova em `src/` e `public/`.
- Nenhum código de aplicação existente é afetado (projeto nasce deste change).
