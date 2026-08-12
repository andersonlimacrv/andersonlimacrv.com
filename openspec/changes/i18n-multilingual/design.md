## Context

O site é Astro SSG (zero JS) com pages em `src/pages` (index, blog/[slug], blog/index, rss.xml) e helpers em `src/lib` (`site.ts` para constantes, `posts.ts` para a collection `blog`). O `BaseLayout` centrara `lang` via prop (default `pt-BR`), já com `og:locale` e canonical dinâmicos. A collection `blog` (content layer em `src/content.config.ts`) tem schema sem `lang`.

O usuário decidiu: PT sem prefixo (`/`, `/blog`), ES/EN prefixados (`/es/`, `/en/`); traduzir interface E os 3 posts; registrar via OpenSpec.

## Goals / Non-Goals

**Goals:**
- Config `i18n` no Astro: `locales: ['pt','es','en']`, `defaultLocale: 'pt'`, `prefixDefaultLocale: false`.
- UI (header, hero, seções, contato, footer, mensagens acessíveis) traduzida via dicionários tipados (`src/i18n/ui.ts`).
- Blog por idioma: 3 posts pt (atuais) + traduções es/en; `lang` no schema; filtro por locale.
- `LanguageSwitcher` no header mantendo a página atual ao trocar de idioma.
- SEO i18n: hreflang, canonical por locale, og:locale, sitemap com alternates, RSS por locale.

**Non-Goals:**
- Auto-detecção de idioma (cookie/IP/accept-language) — apenas links explícitos.
- CMS/UI de traduções; traduzir imagem/og:image; mudar layout.

## Decisions

**1. Roteamento com `[locale]` dinâmico + getStaticPaths.**
- Mover `src/pages/index.astro`, `blog/index.astro`, `blog/[slug].astro`, `rss.xml.ts` para `src/pages/[locale]/`. PT = locale `''` (sai sem prefixo; Astro i18n com `prefixDefaultLocale: false`), ES/EN = `es`/`en`.
- Alternativa: pasta por locale (`src/pages/es/...`, `en/...`) com duplicação de páginas. Rejeitada — `[locale]` com `getStaticPaths` centraliza e evita triplicar componentes; o helper `translatePath` garante hrefs consistentes.
- Links internos (header, footer, cards, "ver todos") usam `translations` do locale atual (espelhado em todas as rotas).

**2. Dicionários tipados em `src/i18n/ui.ts`.**
- `export const ui = { pt: {...}, es: {...}, en: {...} }` com um `const defaultLocale = 'pt'` e `type Locale = 'pt'|'es'|'en'`; helper `getLangFromUrl(url)`. Cada página usa `t = ui[locale]`.
- Palavras-chave/estrutura idêntica ao conteúdo atual (Perfil, Sobre, Projetos, Escritos, Fale comigo, contato), para não alterar estética.
- Alternativa: `astro-i18next`. Rejeitada — projeto preza zero dependências extras desnecessárias; dicionário é pequeno e tipado.

**3. Blog: `lang` no schema + estrutura de conteúdo.**
- Adicionar `lang: z.enum(['pt','es','en'])` em `src/content.config.ts`.
- Manter os 3 .md atuais (pt) e criar `es/*.md` e `en/*.md` (mesmos 3 artigos traduzidos). Filtrar por `data.lang === locale` em `getPublishedPosts(locale)`. URLs: `/blog/<slug>` em pt, `/es/blog/<slug>`/`/en/blog/<slug>` — `[slug].astro` combina `locale` do params.
- `formatDate` já aceita locale; usar `pt-BR`/`es-ES`/`en-US` conforme idioma. `lang` define `html lang` e `og:locale` (`pt_BR`/`es_ES`/`en_US`).

**4. `LanguageSwitcher` no header.**
- Novo `src/components/LanguageSwitcher.astro`: usa `getLangFromUrl(Astro.url)` para saber o locale atual e renderiza links PT/ES/EN (com `hreflang`), espelhando o caminho atual via `translatePath`. Inserido no `Header.astro` ao lado do `ThemeToggle`.
- Manter `data-astro-transition-persist` nos links? Não: links de idioma são navegações completas (View Transitions aplicáveis) — o mixin atual do header já persiste.

**5. SEO i18n.**
- `astro.config.mjs`: `i18n` com os locales; sitemap com `i18n` (`i18nRouting`/`defaultLocale` para gerar `alternates` hreflang). `BaseLayout` passa a receber `locale` e emitir `hreflang` alternates (3 idiomas) + canonical do locale + `og:locale`.
- `rss.xml.ts` por locale (`/rss.xml`, `/es/rss.xml`, `/en/rss.xml`) com title/description traduzidos e só posts do idioma.
- `llms.txt` mantido em pt (principal). `robots.txt` sem mudança de estrutura.

## Risks / Trade-offs

- [Multiplicar posts sem sistema de sync: tradução pode "desfalcar" (1 idioma atualizado, outro não)] → Processo manual curado; dependência de disciplina do autor. Não há ferramenta de detecção de desalinhamento.
- [Canonical/hreflang incorretos degradam SEO] → Todos os pontos usam helpers centralizados (`siteUrl` + `getHrefLang`/`translatePath`), validados no build.
- [`prefixDefaultLocale: false` e `getStaticPaths` de `[locale]` — risco de duplicar rotas pt; Astro deduplica, mas exige cuidado no `getStaticPaths`] → Gerar `locale: ''` uma única vez para pt e validar no build que `/` e `/blog` existem (não `/pt/`).
- Migration/Rollback: config `i18n` para remover e rotas voltam a `src/pages`; conteúdo es/en é aditivo (inofensivo reverter).

## Open Questions

Nenhuma.