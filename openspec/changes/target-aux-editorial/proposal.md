# Change: target-aux-editorial

## Why
Em mobile o `TargetHover` (corners) não é anexado — links mono uppercase ("Voltar ao topo", share do post, "voltar ao blog", linhas relacionadas) ficam sem feedback visual de toque. O `TargetSimbol` (mira com spin) já existe e é o candidato natural de feedback auxiliar. Além disso, "Leia também" usa grid de cards (herdado de PostCard) que destoa do idioma editorial do site, e a ordem dos links do nav (`Sobre, Blog, Projetos, Contato`) não corresponde à ordem real das seções numeradas (`01 Sobre, 02 Projetos, 03 Blog, 04 Contato`).

## What Changes
- **TargetSimbol auxiliar (mobile)**: links mono uppercase ganham `TargetSimbol` `size=16` com `md:hidden` — visível só onde o `TargetHover` não atua (touch/mobile), gira no tap (`pointerdown` já implementado em `target-simbol.ts`). Aplicado em: Footer "Voltar ao topo", PostLayout "Voltar ao blog" + share X/Email, linhas de "Leia também". Email de contato mantém o simbol permanente (desktop+mobile) já existente.
- **"Leia também" editorial**: substitui o grid de cards por lista editorial numerada — `ol` com divisórias `divide-y`, índice mono `01/02/03`, título semibold com hover `text-primary`, data à direita e seta `→` com `group-hover:translate-x-1`, `cursor-target` preservado.
- **Nav na ordem das seções**: `navLinks` do Header reordenado para `Sobre, Projetos, Blog, Contato` (iguais aos números 01–04 e à ordem vertical da home).
- **Separador unificado `·` (ponto médio)**: mantém o glifo `·` adotado pelo usuário (trocou `/`→`·` em Hero eyebrow e Trajetória) e padroniza a renderização via `Sep.astro` — `·` a ~0.8em, `text-muted-foreground/60`, `select-none`, em: chip eyebrow do Hero (via prop `label2` no `Eyebrow`), Trajetória, meta do post (2 spots), mainStack do About, `shareX` (`"X · Twitter"`) e `contactGridHint`.

## Capabilities

### New Capabilities
- `target-feedback`: papel do `TargetSimbol` como feedback auxiliar de toque onde o `TargetHover` não existe (mobile), com regras de visibilidade (`md:hidden`) e reduced-motion.
- `navigation`: nav do header espelha a ordem das seções numeradas da home.
- `visual-language`: separador unificado em ponto médio (`·`) via `Sep.astro` nos contextos de meta/trajetória/eyebrow/mainStack.

### Modified Capabilities
- `blog`: adiciona requisito "Leia também editorial" à página de post (o índice e a vitrine da home permanecem inalterados).

## Impact
- Código: `src/components/layout/Footer.astro`, `src/components/layout/Header.astro`, `src/layouts/PostLayout.astro`, `src/components/pages/BlogPostPage.astro`, `src/components/sections/Hero.astro`, `src/components/sections/TrajectoryClean.astro`, `src/components/ui/Eyebrow.astro`, `src/components/ui/Sep.astro` (novo), `src/i18n/ui.ts` (`shareX`, `contactGridHint`), `e2e/editorial-feedback.spec.ts` (novo).
- Sistema: nenhum JS runtime novo (`target-simbol.ts` já cobre spin por tap/entrada); zero dependências npm; sem mudança de rotas; i18n limitado a `shareX` e `contactGridHint` (mesmos textos com separador trocado).
- Docs/métricas: `docs/audit.md`, `docs/audit-history.md`, `docs/perf-seo-checklist.md` (delta ~0 — utilitários existentes; e2e 123 → +~5).

## Non-goals
- Não alterar o comportamento do `TargetHover` (desktop) nem a física do `target-simbol.ts`.
- Não tocar no índice `/blog` nem na vitrine `#blog` da home.
- Não mudar tokens, tipografia ou cores; sem CSS custom novo (apenas utilitários).
