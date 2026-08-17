## Fase 0 — Fundação de dados

- [ ] 0.1 Criar `src/data/profile.ts`: tipos + `profile` (hero, about filtrado, techStack, careerJourney ordenado recente→antigo, experienceDetails, education) extraído de `add-data.json`, sem campos `OUTDATED_*`
- [ ] 0.2 Adicionar rótulos/quote em `src/i18n/ui.ts` (pt/es/en): `aboutTimelineLabel`, `aboutStackTitle`, `aboutFactsTitle`, `aboutContactTitle`, mantendo `aboutQuote`/`aboutBio`
- [ ] 0.3 `npm run check` sem erros (sem mudança visual ainda)

## Fase 1 — Estrutura visual (duas colunas + selo)

- [ ] 1.1 `About.astro`: layout flex duas colunas (`lg:w-[40%]` esquerda + timeline direita), divisores `border-l`/`border-t`; `#sobre-content` fora de `[data-reveal]`; `BlueprintMorphEnd` com `finalX={0.06} finalY={0.10}`
- [ ] 1.2 Coluna esquerda: `lg:pl-44` (desktop, texto à direita do selo) + wrapper `pt-40` no mobile (texto abaixo do selo); quote (`aboutQuote` + `<cite>`) em cima e descrição (`aboutBio`) embaixo
- [ ] 1.3 `Hero.astro`: `finalX=0.06`/`finalY=0.10` no `ScrollMorphPortrait` e no `BlueprintMorphBoard` (legenda x·y)
- [ ] 1.4 Atualizar geometria dos e2e: `blueprint-morph.spec.ts` (0.15/0.5 → 0.06/0.10) e reescrever `about-section.spec.ts` (2 colunas, selo no topo, divisores, flex)
- [ ] 1.5 `npm run check` + e2e + revisão visual desktop/mobile com o usuário

## Fase 2 — Conteúdo completo

- [ ] 2.1 Timeline: itens de `careerJourney` com `border-t`, `<details>` expansível com highlights de `experienceDetails` (grupos frontend/backend/IoT)
- [ ] 2.2 Chips de stack por grupo (`techStack`) + bloco de detalhes (`about` items como `dl` com `border-t`)
- [ ] 2.3 Rodapé `border-t`: `hero.location` + links sociais (GitHub/LinkedIn/Email) com `cursor-target`/TargetHover
- [ ] 2.4 `HomePage.astro`: JSON-LD Person enriquecido (`description: hero.bio`, `jobTitle: hero.title`)
- [ ] 2.5 e2e de conteúdo (timeline, details, chips, rodapé) + `npm run check`

## Fase 3 — Limpeza de CSS

- [ ] 3.1 Inventariar regras custom de `global.css` e `<style>` de componentes; greppar uso em `src/`
- [ ] 3.2 Remover apenas regras mortas comprovadas (ex.: `.bp-legend-rule`, `.rail-left` se órfão)
- [ ] 3.3 Build limpo + e2e completo sem regressão + peso de CSS na auditoria não sobe

## Fase 4 — Specs e auditoria de performance

- [ ] 4.1 Atualizar texto do ponto de aterrissagem no delta `blueprint-morph-wireframe` (`redesign-engineering-blueprint`) para 0.06/0.10
- [ ] 4.2 `npx openspec validate about-section-reform --type change` sem erros
- [ ] 4.3 `node scripts/audit.mjs` + atualizar `docs/perf-seo-checklist.md` se o peso mudar
- [ ] 4.4 Suíte e2e completa (~70+) + `npm run check`
- [ ] 4.5 Remover `add-data.json` após migração confirmada; revisão visual final (light/dark, desktop/mobile) com o usuário