## Context

A seção Sobre foi reformulada em **coluna única** (Perfil acima, Trajetória abaixo, sempre empilhadas). O alvo do morph continua `#sobre-portrait` (`finalX=0`/`finalY=0`, `--morph-final-size` responsivo). `TrajectoryClean` junta `careerJourney` filtrado (work 4) + `education` (3) em 7 rows `Role / Company` com `Subtitle` headings. `max-w-6xl` e `Subtitle` reutilizável padronizam tipografia. Fatos em `src/data/timeline.ts` e `src/data/profile.ts` (fonte única, pt); rótulos localizados em `src/i18n/ui.ts`.

## Goals / Non-Goals

**Goals:**
- Bloco 01 (Perfil): retrato (`#sobre-portrait` `basis-[20%] md:basis-[30%] h-40 ml-14`) + `dl` ao lado, nunca abaixo; depois frase, "Sobre mim" e "Redes sociais" com `Subtitle` e `py-6 sm:py-8` padronizado.
- Bloco 02 (Trajetória clean): duas listas `Trabalho` (4) e `Formação` (3) `Role / Company` com `period` curto `trajectory-period`, `Subtitle` headings, sem `summary`/`yearRange`/linha vertical.
- Morph do retrato com diâmetro final responsivo, alvo `#sobre-portrait`.
- Hover de links padronizado no site todo via `TargetHover` global e classe `.cursor-target`.
- Seções e subsessões etiquetadas semanticamente (`aria-labelledby` nos headings).
- Layout minimalista em coluna única, com flex e `max-w-6xl`, e `HomePage` com grid elástico vertical segmentado entre horizontais.
- Responsividade sem overflow em 390/768/1024/1280.

**Non-Goals:**
- Empilhar a foto acima das informações no mobile (foto+informações sempre lado a lado).
- Alterar `TargetHover.astro` (componente), o design system de cores/fontes, ou os wireframes blueprint.
- Migrar para grid (decisão: layout usa flex/flexbox).

## Decisions

### 1. Layout em coluna única (sempre empilhado)
`#sobre-content > div` = `relative flex flex-col divide-y divide-border border-t border-border` (sem `lg:flex-row`). Cada `<section>` tem `min-w-0 basis-full` (sem `lg:basis`). Ordem fixa Perfil acima, Trajetória abaixo, em qualquer viewport. `max-w-6xl` em `SectionHeading`/`Hero`/`About`/`Footer` etc. com `Subtitle` reutilizável.

### 2. Bloco 01 — Perfil
Header `relative flex items-center justify-between border-b border-border py-4`: `Subtitle` "Perfil" `variant strong size sm` + `01` à direita. Depois foto + informações:
- `flex items-start gap-3 py-6 sm:py-8` (foto à esquerda, dl à direita) — `py` padronizado.
- FOTO: `#sobre-portrait` (`relative aspect-square min-w-0 shrink-0 basis-[20%] md:basis-[30%] h-40 ml-14 md:ml-6 mt-6`) com `BlueprintMorphEnd src finalSize=160 finalX=0 finalY=0` — menor para legibilidade, h-40 fixo.
- INFORMAÇÕES (`dl` `flex-1`, **3 itens** `space-y-3 sm:space-y-4`): Role/Stack/Localização via `Subtitle` `as="dt"` (`aboutRoleTitle` etc.) + `dd` normal. `Subtitle` `text-[9px] sm:text-[11px]` (aumentado de 7/9).

Depois, separados por `border-t py-6 sm:py-8` (padronizado):
- **Frase**: `blockquote` serif itálico em caixa `border border-dashed` com cantoneiras blueprint, sem `<cite>`.
- **"Sobre mim"**: `Subtitle` `aboutBioTitle` + `aboutBio` parágrafos `text-[10px] sm:text-xs`.
- **"Redes sociais"**: `Subtitle` `aboutContactTitle` + `<nav flex flex-col>` 5 links `cursor-target border py-2.5 hover:text-foreground`.

### 3. Bloco 02 — Trajetória clean
Header "Trajetória" + `02` com `Subtitle` `variant strong size sm`. Sem `yearRange`. `TrajectoryClean.astro` com 2 listas `Trabalho` (4) e `Formação` (3) `Role / Company` (`Role` `lg:text-[16px] text-sm font-semibold` primeiro) + `period` curto `trajectory-period` `text-[10px] sm:text-xs` `whitespace-nowrap` e `Subtitle` headings `Trabalho`/`Formação` (`text-[9px] sm:text-[11px]`). `HomePage.astro` envolve cada seção (`Hero`/`About`/etc) em `relative` com 2 `ElasticLine isVertical` `!w-10 h-[calc(100%+32/64px)]` nas laterais `max-w-6xl` para formar grid quadriculado sem quebrar ao balançar (pontas em `top-[-32px]` encontram horizontais `h-16` em `midY 32px`).

### 4. Morph alinhado ao retrato + tamanho responsivo
- `--morph-final-size` no `:root` (global.css): **128px** base/`sm`/`md`, **160px** ≥1024 (no mobile não reduz mais — há espaço de sobra).
- `scroll-morph.ts` lê a var (`readFinalSize`), recomputa no resize.
- `BlueprintMorphEnd.astro`: `resolvedSize = var(--morph-final-size, ...)`; clamp via `calc`.
- `BlueprintMorphBoard/Start`: `--bp-final-size: var(--morph-final-size, ...)`; rótulos de cota escalam com `--bp-scale` (`finalSize/160`, definido por `morph-measure.ts`).

### 5. Hover de links padronizado (TargetHover global)
- `<TargetHover>` é instanciado **uma única vez** em `BaseLayout.astro` (global), seletor default `.cursor-target`.
- Quais links usam `.cursor-target`: links de ação (social, email do Contact, ver-todos do Blog, voltar-ao-blog e shares do PostLayout), nav + logo do Header, cards (ProjectLink/PostCard), footer back-to-top.
- Removidos `group-link` e os 6 SVGs `group-arrow` do site todo; a regra CSS `.group-link:hover .group-arrow` foi apagada.
- Mobile/touch: corners desativados (CSS do `TargetHover.astro` em `max-width: 768px`); `prefers-reduced-motion` respeitado.

### 6. Etiquetagem semântica das seções
- `SectionHeading.astro` gera `id="*-title"` no `<h2>` e `aria-labelledby` na `<section>`.
- `Hero.astro`: `aria-labelledby="hero-title"` na `<section>` + `id="hero-title"` no `<h1>`.
- As colunas Perfil/Trajetória do About são `<section data-col="perfil"|"trajetoria">` (não anônimas) — evita landmarks ambíguos.

### 7. Redução de CSS externo
- `.container-site` migrado para utilitários Tailwind (`mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8`) em todos os usos (SectionHeading, Hero, Footer, PostLayout, BlogIndexPage); a regra CSS foi apagada.
- `.group-link:hover .group-arrow` apagada (−6 linhas).
- `global.css`: 706 → ~687 linhas. Permanece em CSS: `@font-face`, tokens `:root`/`.dark`, `@theme inline`, base global, `.site-header`/`.site-nav`/`.site-menu` (dependem de classes de estado JS), `.site-locale-*` (regra `:has()` complexa), `.skip-link`, `.post-content` (scoped markdown), `reveal-present`, `transition-micro` (utility), `prefers-reduced-motion` global.

### 8. Telefone (somente no wa.me)
`socialLinks.whatsapp = 'https://wa.me/5553981004874'` (número derivado do `hero.contact.phone` `'53981004874'` → `+55` + DDD + número). O telefone formatado `+55 53 98100-4874` **não aparece mais** na UI.

### 9. Intervalo real da trajetória
`yearRange = min(início) — max(fim)` dos períodos; "presente" = ano corrente. Atual: **2007—2027** (IFSUL 2007 → Pós-graduação termina maio/2027).

### 10. Responsividade do Hero
Hero ganhou `pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16` (antes não tinha py próprio). `md:flex-row` mantém a virada em 768px; `md:gap-16`.

## Risks / Trade-offs

- [Cantoneiras/cruzes em lugares errados] → os marcadores `+` nos divisores de coluna foram removidos (saída da coluna Trajetória); restam apenas os `T` no topo/fim da linha vertical da timeline.
- [Links grandes (cards) com corners de 12px podem parecer grandes] → se revisão visual reclamar, parametrizar `cornerSize`/`offset` por contexto.
- [`--morph-final-size` 128px no mobile preenche melhor o espaço] → auditoria revalida peso/data.
- [Timeline agrupada por ano muda a contagem de `<li>`] → e2e atualizado para 6 grupos; item de mesmo ano (2022: CESS + CST) compartilha um ponto fixo.
- [Conteúdo factual em pt para en/es] → fatos em pt (decisão do usuário); rótulos localizados.
