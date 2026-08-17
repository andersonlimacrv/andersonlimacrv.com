## Why

A seção Sobre precisa refletir o novo desenho do usuário: **duas colunas** (Perfil à esquerda, Trajetória à direita) que **empilham no mobile** e ficam lado a lado em `lg`. À esquerda, o **retrato P&B com marcações blueprint** e as **informações pessoais ao lado da foto (nunca abaixo)**: Role, stack principal e localização, curtos e alinhados. À direita, uma **timeline vertical contínua agrupada por ano**, com os anos como pontos fixos na linha, a data primeiro ao lado do ano e o marcador preenchido (concluído) ou vazio (em andamento). A estética Engineering Blueprint (divisores finos, tipografia técnica, marcadores `T` no topo/fim da linha, espaçamento uniforme) permanece. Hover de links padronizado no site todo via `TargetHover` global e classe `.cursor-target`; seções numeradas com `aria-labelledby`.

## What Changes

- **Layout em duas colunas (flex) em `#sobre-content`**: `relative flex flex-col divide-y divide-border border-t border-border lg:flex-row lg:divide-x lg:divide-y-0`. Cada coluna é um `<section data-col="perfil"|"trajetoria">` com `min-w-0` e `basis-full lg:basis-[46%]`/`lg:basis-[54%]`. No mobile (<1024px) as colunas **empilham** (Perfil acima, Trajetória abaixo); em `lg` ficam lado a lado.
- **Coluna 01 — Perfil**: header com label "Perfil" + `01`; bloco **foto + informações** (`flex items-start gap-3 sm:gap-5`): `#sobre-portrait` (`aspect-square shrink-0 basis-[47.5%]`, alvo do morph, `BlueprintMorphEnd finalX=0/finalY=0`) com um `dl` `flex-1` ao lado (nunca abaixo) com **3 itens**: **Role** (`hero.title` em 3 `span class="block"` — "Engenheiro de Software", "Enterpreneur", "Arquiteto de Soluções"), **Stack principal** (`hero.mainStack`), **Localização** (`hero.location`). Depois, separados por `border-t`: **frase** (`blockquote` serif itálico em caixa `border border-dashed` com cantoneiras blueprint, **sem `<cite>`**), **"Sobre mim"** (`aboutBio`) e **"Redes sociais"** (rótulo `aboutContactTitle` localizado — "Redes sociais"/"Redes sociales"/"Social media" — com `<nav>` de **5 links** — GitHub, LinkedIn, Instagram, WhatsApp, Email — cada `<a class="cursor-target border-b border-border py-2.5 hover:border-foreground hover:text-foreground">`; **sem telefone e sem localização** nesse bloco).
- **Coluna 02 — Trajetória**: header simétrico ao da coluna 01 (label "Trajetória" + `02`); o intervalo real dos dados (`yearRange` = min–max dos anos dos períodos; `presente` conta como o ano corrente) aparece como rótulo mono `absolute right-0 top-2` **dentro do wrapper da timeline**. **Timeline vertical contínua**: linha `w-px` percorrendo a coluna, com **marcadores `T`** (`CrossMark` `t-top`/`t-bottom`) no topo e no fim. Itens de `careerJourney` **agrupados pelo ano de início** (`careerGroups` em `About.astro`); cada grupo é um `<li>` com a coluna do ano (ponto fixo + marcador preenchido/vazio conforme `ongoing`) e a coluna das experiências (`flex-1`), onde cada `entry` renderiza **nesta ordem**: período (mono uppercase), `h3` cargo, `p` empresa, `p` **summary** de 1 linha.
- **Morph alinhado ao retrato**: o alvo do morph vira `#sobre-portrait` (`Hero.astro` `target="#sobre-portrait"`, `finalX=0`, `finalY=0`). Diâmetro final responsivo via `--morph-final-size` no `:root` (**128px** base/`sm`/`md`, **160px** ≥1024); JS do morph (`scroll-morph.ts`) e wireframes blueprint (`morph-measure.ts`, `BlueprintMorphEnd/Start/Board`) leem a var, com a prop como fallback.
- **TargetHover global + semântica**: `<TargetHover>` instanciado uma única vez em `BaseLayout.astro` (seletor default `.cursor-target`); `.group-link`/`.group-arrow` e os 6 SVGs inline removidos do site todo; `SectionHeading`/`Hero` com `aria-labelledby` nos `<h2>`/`<h1>`; `.container-site` migrado para utilitários Tailwind e a regra CSS apagada.
- **Dados**: `profile.ts` já tem `hero.mainStack` e `TimelineEntry.summary` preenchidos. `src/lib/site.ts` ganha `socialLinks.instagram` e `socialLinks.whatsapp` (`https://wa.me/5553981004874`, derivado de `hero.contact.phone`). Fatos em pt; rótulos localizados (pt/es/en).

## Capabilities

### New Capabilities
<!-- Nenhuma nova — a capability `about-section` já existe no delta deste change. -->

### Modified Capabilities
- `about-section`: duas colunas fixas (perfil + trajetória), informações ao lado da foto, timeline com anos fixos e barra de duração, intervalo real no header.
- `blueprint-morph-wireframe` (delta do change `redesign-engineering-blueprint`): alvo do morph e diâmetro final responsivos (`#sobre-portrait`, `--morph-final-size`); rótulos de cota escalam com o diâmetro (`--bp-scale`).

## Non-goals

- Não empilhar a foto acima das informações no mobile (foto+informações sempre lado a lado).
- Não alterar `TargetHover.astro` (componente), o design system de cores/fontes, ou os wireframes blueprint.
- Não migrar para grid (decisão: layout usa flex/flexbox).
- Não traduzir os dados factuais (cargos/períodos/stack) — ficam em pt; só rótulos/quote são localizados.
- Não exibir o telefone formatado na UI (somente no `wa.me`).

## Impact

- `src/components/sections/About.astro`: reescrito (flex/empilha no mobile, info ao lado da foto, timeline agrupada por ano, marcadores `T`, 5 links sociais, sem telefone).
- `src/components/ui/CrossMark.astro` (novo): marcadores `T` no topo/fim da linha vertical.
- `src/data/profile.ts`: `hero.mainStack`, `TimelineEntry.summary` (já preenchidos).
- `src/lib/site.ts`: `socialLinks.instagram`, `socialLinks.whatsapp`.
- `src/i18n/ui.ts`: `aboutContactTitle` → "Redes sociais"/"Redes sociales"/"Social media".
- `src/styles/global.css`: `--morph-final-size` (128px base/`sm`/`md`, 160px ≥1024); `.container-site` e `.group-link:hover .group-arrow` apagadas.
- `src/components/ui/scroll-morph.ts`, `src/components/blueprint/morph-measure.ts`, `BlueprintMorphEnd.astro`, `BlueprintMorphStart.astro`, `BlueprintMorphBoard.astro`: tamanho final responsivo + escala de rótulos (`--bp-scale`).
- `src/components/sections/Hero.astro`: alvo `#sobre-portrait`, `finalX=0`, `finalY=0` + `aria-labelledby="hero-title"` + container via utilitários.
- `src/components/layout/Header.astro`, `Footer.astro`: `.cursor-target` no lugar de `group-link` + container via utilitários (Footer).
- `src/components/ui/{PostCard,ProjectLink,SectionHeading}.astro`, `src/components/sections/{Blog,Contact}.astro`, `src/components/pages/BlogIndexPage.astro`, `src/layouts/{BaseLayout,PostLayout}.astro`: `.cursor-target` + `aria-labelledby` + TargetHover global em `BaseLayout`.
- `e2e/about-section.spec.ts`: reescrito (flex/empilha no mobile, 3 itens no dl, 6 grupos na timeline, 5 links, sem telefone, CrossMarks).
- `e2e/blueprint-morph.spec.ts`, `e2e/scroll-morph.spec.ts`: tamanho final responsivo (mobile 128px).
- `e2e/locale-layout.spec.ts`: `section#hero` no lugar de `section.container-site`.
- `docs/perf-seo-checklist.md` + `docs/audit*.md`: atualizados com métricas atuais (932.4 KB raw / 442.8 KB gzip, −19 linhas em `global.css`, −6 SVGs, −2 regras `.group-*`).
