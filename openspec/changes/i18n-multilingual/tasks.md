## 1. Fundação i18n

- [x] 1.1 Configurar `i18n` no `astro.config.mjs`: `locales: ['pt','es','en']`, `defaultLocale: 'pt'`, `prefixDefaultLocale: false`; ajustar sitemap para em tônico `i18n` (alternates by locale)
- [x] 1.2 Criar `src/i18n/ui.ts` (dicionários tipados pt/es/en + `getLangFromUrl` + helper de locale/language para og:locale e html lang)

## 2. Blog por idioma

- [x] 2.1 Adicionar `lang: z.enum(['pt','es','en'])` ao schema em `src/content.config.ts`
- [x] 2.2 Atualizar `src/lib/posts.ts`: `getPublishedPosts(locale)` filtrado por `data.lang` e `getRelatedPosts` priorizando mesmo idioma
- [x] 2.3 Criar versões es e en dos 3 posts (mesmo conteúdo traduzido; GEO "resposta direta primeiro") como `src/content/blog/es/*.md` e `en/*.md`

## 3. Rotas localizadas

- [x] 3.1 Mover `index.astro` para `src/pages/[locale]/index.astro` com `getStaticPaths` (pt = `''`, es/en = prefixo)
- [x] 3.2 Mover `blog/index.astro` e `blog/[slug].astro` para `src/pages/[locale]/blog/` com filtro por idioma
- [x] 3.3 Converter `rss.xml.ts` em `src/pages/[locale]/rss.xml.ts` (feed por idioma, `/`, `/es/`, `/en/` baseado no locale)
- [x] 3.4 Remover páginas antigas de `src/pages/blog/` e `src/pages/index.astro` duplicadas

## 4. UI multilíngue

- [x] 4.1 Traduzir via `ui[locale]`: `Header.astro`, `Footer.astro`, `index.astro` (hero/seções/contato), `blog/index.astro`, `PostLayout.astro`, `PostCard.astro`, `BaseLayout.astro` (title/description/aria) 
- [x] 4.2 Criar `src/components/LanguageSwitcher.astro` (links PT/ES/EN espelhando a rota atual, destaca locale ativo) e inserir no `Header.astro`

## 5. SEO i18n + validação

- [x] 5.1 `BaseLayout.astro`: emitir `hreflang` alternates (3 idiomas), canonical do locale, `og:locale`; `html lang` do locale
- [x] 5.2 Conferir `robots.txt`, `llms.txt` (principal em pt) e meta final por rota
- [x] 5.3 Executar `npm run build` e `npx astro check` sem erros; conferir rotas `/`, `/es/`, `/en/`, posts e RSS por idioma