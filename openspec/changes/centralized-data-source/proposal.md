## Why

Os dados do site estão dispersos entre `src/lib/site.ts`, `src/data/`, `src/i18n/ui.ts`, componentes e layouts — com duplicações e conflitos (dois emails diferentes, nome "Anderson Carvalho" hardcoded em 8+ lugares, projetos repetidos por idioma). Isso gera fonte de verdade ambígua e risco de inconsistência. Além disso, a navegação por âncora (`/#contato`) perde o fragmento ao trocar de idioma e dispara navegação desnecessária quando já se está na página.

## What Changes

- **Nova fonte única `src/data/site.ts`**: `siteUrl`, `name`, `email` canônico (`contato@andersonlimacrv.com`), `phone`, `heroEyebrowYear`, `sections` (números 01–04), `socialLinks` (github, linkedin, instagram, whatsapp derivado do phone, email).
- **Remoção de `src/lib/site.ts`**: conteúdo migrado para `src/data/site.ts`; todos os imports atualizados. **BREAKING** (imports internos).
- **`src/data/profile.ts`**: remove `hero.contact` (duplica `site`); `hero.name` referencia `site.name`.
- **`src/data/projects.ts`**: fonte única não-localizada `[{ title, url, tags }]`; `getProjects(locale)` compõe descrições de `src/i18n/ui.ts`.
- **`src/i18n/ui.ts`**: apenas tradução — remove `sections[].number`, `heroEyebrow` vira label (`Perfil`/`Profile`), `projects[]` mantém só `description`, novo `relatedPosts`; meta titles compostos com `site.name`.
- **Hardcodes removidos**: "Anderson Carvalho" em `Hero`, `Footer`, `About`, `PostLayout`, `HomePage` (JSON-LD), `rss.ts` → `site.name`. Alt da imagem hero → chave i18n.
- **Âncoras corrigidas**: `language-switcher.ts` preserva `location.hash` na troca de idioma (`/es/#contato` → `/pt/#contato`); `site-header.ts` faz scroll suave + `history.replaceState` quando a âncora é na página atual (respeita `prefers-reduced-motion`).

## Capabilities

### New Capabilities

- `data-source` — origem única e tipada dos dados factuais do site (`src/data/site.ts`, `profile.ts`, `projects.ts`), consumida por componentes, layouts, feeds e JSON-LD; sem duplicação de identidade/contato.

### Modified Capabilities

_(nenhuma)_ — dados factuais hoje não têm spec; comportamento de i18n/SEO permanece, apenas com fonte de dados única.

## Non-goals

- Não migrar conteúdo do blog (`src/content/blog/**`) — continua em content collections.
- Não alterar `global.css`, tema, scrollbar, morph/wireframes, `postMap.ts`.
- Não mudar as URLs públicas (`/#sobre`, `/es/#contato`) — apenas corrigir o comportamento de navegação/hash.
- Não adicionar novas dependências nem aumentar o bundle JS.
- Não tocar `astro.config.mjs` (site URL duplicado fica como está nesta change).

## Impact

- **Novos**: `src/data/site.ts`; `e2e/data-source.spec.ts`; specs/design/tasks/proposal.
- **Removido**: `src/lib/site.ts`.
- **Modificados**: `src/data/profile.ts`, `src/data/projects.ts`, `src/i18n/ui.ts`, `src/i18n/postMap.ts` (se necessário), seções `Hero`/`About`/`Projects`/`Blog`/`Contact`, layouts `Header`/`Footer`/`BaseLayout`/`PostLayout`, `HomePage`, `ui/` (`LanguageSwitcher`, `language-switcher.ts`, `site-header.ts`, `PostCard`), `lib/rss.ts`, `docs/`.
- **Verificação**: `astro build`, `astro check`, `openspec validate`, `npm run test:e2e`, `node scripts/audit.mjs`.