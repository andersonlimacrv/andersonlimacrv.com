## Why

O site está disponível apenas em português, limitando o alcance do mini-blog para leitores de espanhol e inglês. Um seletor de idiomas (PT/ES/EN) com URLs limpas melhora a acessibilidade internacional e o SEO (hreflang, canonical por idioma).

## What Changes

- Adicionar configuração `i18n` no Astro: `locales: ['pt', 'es', 'en']`, `defaultLocale: 'pt'`, `prefixDefaultLocale: false` (PT sem prefixo em `/` e `/blog`; ES/EN sob `/es/` e `/en/`).
- Reestruturar páginas para `src/pages/[locale]/...` com `getStaticPaths` (locale vazio para pt).
- Criar dicionários de UI (`src/i18n/ui.ts`) para navegação, hero, seções, contato e footer nas 3 línguas.
- Traduzir os 3 posts para es e en (9 posts no total) com campo `lang` no schema e filtro por locale.
- Adicionar `LanguageSwitcher` no header (links PT/ES/EN).
- SEO i18n: `hreflang` alternates, canonical por locale, `og:locale`, alternates no sitemap, RSS por locale.
- `llms.txt` principal em pt.

## Capabilities

### New Capabilities
- `i18n`: Suporte a múltiplos idiomas (pt/es/en) com URLs prefixadas, seletor no header, conteúdo do blog por idioma e metadados de SEO internacionais.

### Modified Capabilities
- `blog`: Posts passam a ser filtrados por idioma (`lang` no frontmatter); URLs do blog ficam prefixadas por locale para ES/EN.
- `seo`: Canonical, hreflang, og:locale e sitemap ganham variantes por idioma.
- `site-foundation`: Configuração `i18n` no `astro.config.mjs` e estrutura de páginas com `[locale]`.

## Impact

- `astro.config.mjs`: bloco `i18n` + sitemap i18n (i18nRouting, alternates).
- `src/pages/*`: reorganização em `[locale]/` (index, blog, blog/[slug], rss).
- `src/components/Header.astro` (+ `LanguageSwitcher`), `src/layouts/*`, `src/lib/site.ts`/`posts.ts`.
- `src/content.config.ts`: campo `lang`; conteúdo: 9 posts (3×3), `public/llms.txt` e `robots.txt` revisados.

## Non-goals

- Não criar CMS/UI de gerenciamento de traduções.
- Não traduzir `og:image` nem mudar a estética/estrutura das páginas.
- Não adicionar auto-detecção de idioma por IP/negociação de conteúdo (apenas links explícitos no header).