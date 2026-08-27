## Context

A seção Sobre foi reformulada em **duas colunas** (Perfil à esquerda, Trajetória à direita). Em telas pequenas (mobile/tablet) as colunas **empilham**: Perfil acima, Trajetória abaixo. Em `lg` (≥1024px) ficam lado a lado via flex. O alvo do morph é o box do retrato `#sobre-portrait`, com `finalX=0`/`finalY=0` e diâmetro final responsivo (`--morph-final-size`). Os fatos vivem em `src/data/profile.ts` (fonte única, pt); rótulos localizados em `src/i18n/ui.ts`.

## Goals / Non-Goals

**Goals:**
- Coluna 01 (Perfil): retrato (`#sobre-portrait`) + informações (Role/Stack principal/Localização) ao lado da foto, nunca abaixo; depois frase, "Sobre mim" e "Redes sociais".
- Coluna 02 (Trajetória): timeline vertical contínua, **agrupada por ano** (mesmo ano → um ponto fixo na linha), com a **data primeiro ao lado do ano** e o marcador preenchido (concluído) ou vazio (em andamento).
- Morph do retrato com diâmetro final responsivo, alvo `#sobre-portrait`.
- Hover de links padronizado no site todo via `TargetHover` global e classe `.cursor-target`.
- Seções e subsessões etiquetadas semanticamente (`aria-labelledby` nos headings).
- Linhas retas com marcadores de cruz (`T` no topo/fim da linha vertical da timeline).
- Layout minimalista, simétrico, com flex (não grid) e responsividade consistente.

**Non-Goals:**
- Empilhar a foto acima das informações no mobile (foto+informações sempre lado a lado).
- Alterar `TargetHover.astro` (componente), o design system de cores/fontes, ou os wireframes blueprint.
- Migrar para grid (decisão: layout usa flex/flexbox).

## Decisions

### 1. Layout das duas colunas (flex, não grid)
`#sobre-content > div` = `relative flex flex-col divide-y divide-border border-t border-border lg:flex-row lg:divide-x lg:divide-y-0`. Cada `<section>` das colunas tem `basis-full lg:basis-[46%]`/`lg:basis-[54%]` e `min-w-0`. Inversão de colunas não ocorre; no mobile Perfil acima de Trajetória (ordem do DOM).

### 2. Coluna 01 — Perfil
Header `relative flex items-center justify-between border-b border-border py-4`: label "Perfil" (`aboutProfileColumn`) à esquerda + `01` à direita. Depois bloco **foto + informações**:
- `flex items-start gap-3 sm:gap-5` (foto à esquerda, dl à direita).
- FOTO: `#sobre-portrait` (`relative aspect-square min-w-0 shrink-0 basis-[47.5%] mt-5`) com `BlueprintMorphEnd src finalSize=160 finalX=0 finalY=0`.
- INFORMAÇÕES (`dl` `flex-1`, **3 itens** `space-y-3 sm:space-y-4`): Role (`hero.title` quebrado em 3 `span class="block"` — "Engenheiro de Software", "Enterpreneur", "Arquiteto de Soluções"), Stack principal (`hero.mainStack`), Localização (`hero.location`). `dt` mono minúsculo `text-[7px] sm:text-[9px]`; `dd` normal.

Depois, separados por `border-t`:
- **Frase**: `blockquote` serif itálico em caixa `border border-dashed` com cantoneiras blueprint (spans `border-l border-t` / `border-b border-r` `border-foreground`), sem `<cite>`.
- **"Sobre mim"**: rótulo no mesmo padrão dos `dt` + `aboutBio` (parágrafos `text-[10px] sm:text-xs`).
- **"Redes sociais"** (rótulo `aboutContactTitle` localizado "Redes sociais"/"Redes sociales"/"Social media"): `<nav flex flex-col>` com 5 links — GitHub, LinkedIn, Instagram, WhatsApp, Email — cada `<a class="cursor-target ... border-b border-border py-2.5 ... hover:border-foreground hover:text-foreground">`. Sem telefone e sem localização nesse bloco (são redundantes com a dl).

### 3. Coluna 02 — Trajetória
Header (mesmo padrão da coluna 01): "Trajetória" + `02`; o intervalo real `yearRange` (ex.: `2007—2027`) aparece como rótulo mono `absolute right-0 top-2` **dentro do wrapper da timeline**, não no header (para o header ficar simétrico com o da coluna 01).

Timeline: `div.relative py-6 sm:py-8` com:
- Linha vertical contínua `span absolute bottom-0 left-[2.9rem] sm:left-[3.75rem] top-0 w-px bg-border`.
- **Marcadores T** no topo e no fim da linha (`CrossMark variant="t-top"` e `variant="t-bottom"` em `size=10`, posicionados em `left-[2.9rem] sm:left-[3.75rem]` com translate para centralizar).
- `ol[aria-label]` percorrendo **grupos por ano** (`careerGroups` em `About.astro`, derivado de `profile.careerJourney` agrupado pelo ano de início). Cada grupo é um `li relative flex gap-3 sm:gap-5`:
  - Coluna do ano: `w-[3.2rem] sm:w-[4.1rem] shrink-0`, `<p>` mono `text-right pr-4 sm:pr-6` + **marcador** na linha (`h-2.5 w-2.5 border border-foreground`), preenchido (`bg-foreground`) se todos os itens do grupo estiverem concluídos; **vazio** (`bg-background`) se algum item contiver "presente" (`ongoing = entries.some(e => e.period.includes('presente'))`).
  - Coluna das experiências (`flex-1`): para cada `entry` do grupo, um `div border-b border-border last:border-b-0` contendo, **nesta ordem**: período (data primeiro, `p font-mono uppercase`), `h3` cargo, `p` empresa, `p` summary de 1 linha.

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
