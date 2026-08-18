## 1. Fonte única em `/data`

- [x] 1.1 Criar `src/data/site.ts` com `site` tipado (`as const`): `url`, `name`, `email`, `phone`, `heroEyebrowYear`, `sections`, `socialLinks` (github, linkedin, instagram, email) e `whatsapp` derivado de `phone`.
- [x] 1.2 Deletar `src/lib/site.ts` e atualizar todos os imports (`siteUrl`, `siteName`, `authorName`, `socialLinks`) para `src/data/site`.
- [x] 1.3 Remover `hero.contact` de `src/data/profile.ts` e fazer `hero.name` derivar de `site.name`.

## 2. Projetos não-localizados

- [x] 2.1 Refatorar `src/data/projects.ts` para estrutura única não-localizada `projectFacts` (`title`/`url`/`tags`), com `url` do site e redes vindas de `site`.
- [x] 2.2 `getProjects(locale)` compõe com `ui[locale].projects[].description`.
- [x] 2.3 Atualizar `src/i18n/ui.ts`: `projects[]` mantém só `description`; remover títulos factuais.

## 3. `ui.ts` apenas tradução

- [x] 3.1 Remover `sections[].number` de `ui.ts` (números passam para `site.sections`).
- [x] 3.2 Transformar `heroEyebrow` em rótulo puro (`Perfil`/`Perfil`/`Profile`); Hero compõe `` `${t.heroEyebrow} / ${site.heroEyebrowYear}` ``.
- [x] 3.3 Adicionar `relatedPosts` (pt/es/en) em `ui.ts`.
- [x] 3.4 Revisar meta titles: remover "Anderson Carvalho" hardcoded e compor com `site.name` mantendo o texto final idêntico.

## 4. Eliminar hardcodes do nome

- [x] 4.1 Substituir "Anderson Carvalho" por `site.name` em `Hero.astro` (h1 + alt da imagem via chave i18n), `Footer.astro`, `About.astro`, `PostLayout.astro`.
- [x] 4.2 Substituir em `HomePage.astro` (websiteJsonLd/Person) e `lib/rss.ts` (title, descriptions).
- [x] 4.3 Substituir "Leia também"/"También lee"/"Also read" em `BlogPostPage.astro` por `t.relatedPosts`.

## 5. Navegação por âncora

- [x] 5.1 `language-switcher.ts`: anexar `location.hash` ao href destino (`/es/#contato` → `/pt/#contato`).
- [x] 5.2 `site-header.ts`: interceptar clique em âncora da página atual → `scrollIntoView` (smooth ou instantâneo com `prefers-reduced-motion`) + `history.replaceState`, sem navegação do `ClientRouter`.

## 6. Testes e2e

- [x] 6.1 Criar `e2e/data-source.spec.ts`: troca de idioma preserva `#contato`.
- [x] 6.2 Teste: clique em âncora na home rola sem navegação (sem view transition) e URL reflete o hash.
- [x] 6.3 Teste: e-mail `contato@andersonlimacrv.com` único no DOM (sem gmail); nome do autor consistente.

## 7. Verificação e docs

- [x] 7.1 Rodar `npm run check`, `npm run build`, `npm run test:e2e` e `node scripts/audit.mjs`.
- [x] 7.2 Rodar `npx openspec validate centralized-data-source --type change`.
- [x] 7.3 Atualizar `docs/perf-seo-checklist.md` e métricas em `docs/audit*.md` conforme delta.
