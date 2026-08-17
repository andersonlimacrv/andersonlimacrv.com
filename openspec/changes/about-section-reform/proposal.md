## Why

A seção Sobre precisa refletir o novo desenho do usuário: **duas colunas fixas** (desktop e mobile — no mobile as larguras reduzem proporcionalmente, sem nunca empilhar). À esquerda, o **retrato P&B com marcações blueprint** e as **informações pessoais ao lado da foto (nunca abaixo)**: Nome, cargo, stack principal e localização, curtos e alinhados. À direita, uma **timeline vertical contínua** com os anos como pontos fixos na linha e a **duração destacada visualmente**. A estética Engineering Blueprint (grid rigorosa, divisores finos, tipografia técnica, espaçamento uniforme) permanece.

O usuário editou `About.astro` manualmente (quebrou a compilação) e pediu: corrigir o arquivo atual, rodar para visualizar e adequar o código ao spec.

## What Changes

- **Duas colunas fixas em `#sobre-content`**: grid `grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]` com `divide-x` + `border-t`/`divide-border`. No mobile as colunas **permanecem lado a lado** (larguras reduzem; padding `pr-3`/`pl-3`, `sm:pr-6/pl-6`, `lg:pr-10/pl-10`), nunca empilham.
- **Coluna 01 — Perfil**: label "Perfil" + `01`; box do retrato (`id="sobre-portrait"`, `aspect-square`, alvo do morph, `BlueprintMorphEnd finalX=0/finalY=0`) com um `dl` ao lado (nunca abaixo): **Nome** (`hero.name`), **Role** (`hero.title`), **Stack principal** (`hero.mainStack`), **Localização** (`hero.location`). Depois: **frase** (`blockquote` serif + `<cite>`), **"Sobre mim"** (`aboutBio`, 2 parágrafos) e **social/contato** no fim da coluna (GitHub/LinkedIn/Email com `cursor-target`/TargetHover + telefone `+55` + localização).
- **Coluna 02 — Trajetória**: label "Trajetória" + intervalo real dos dados (header `yearRange` = min–max dos anos dos períodos; `presente` conta como o ano corrente). **Timeline vertical contínua**: linha `w-px` percorrendo toda a coluna; cada item de `careerJourney` tem o **ano como ponto fixo** na linha (marcador), cargo/formação (`h3`), empresa, período em mono e **descrição de 1 linha** (`summary`). Marcação temporal (início / trajetória / atual) e marcação técnica inferior (`AC / ABOUT / 01`).
- **Morph alinhado ao retrato**: o alvo do morph vira `#sobre-portrait` (`Hero.astro` `target="#sobre-portrait"`, `finalX=0`, `finalY=0`). Diâmetro final responsivo via `--morph-final-size` no `:root` (64px base, 104px ≥640, 128px ≥768, 160px ≥1024); JS do morph (`scroll-morph.ts`) e wireframes blueprint (`morph-measure.ts`, `BlueprintMorphEnd/Start/Board`) leem a var, com a prop como fallback.
- **Dados**: `profile.ts` ganha `hero.mainStack` e `TimelineEntry.summary` (7 entradas preenchidas). Fatos em pt; rótulos localizados (pt/es/en).

## Capabilities

### New Capabilities
<!-- Nenhuma nova — a capability `about-section` já existe no delta deste change. -->

### Modified Capabilities
- `about-section`: duas colunas fixas (perfil + trajetória), informações ao lado da foto, timeline com anos fixos e barra de duração, intervalo real no header.
- `blueprint-morph-wireframe` (delta do change `redesign-engineering-blueprint`): alvo do morph e diâmetro final responsivos (`#sobre-portrait`, `--morph-final-size`); rótulos de cota escalam com o diâmetro (`--bp-scale`).

## Non-goals

- Não empilhar as colunas no mobile (a decisão do usuário é manter lado a lado).
- Não alterar as demais seções (Projetos, Blog, Contato) nem o design system global (tokens, cores, tipografia).
- Não traduzir os dados factuais (cargos/períodos/stack) — ficam em pt; só rótulos/quote são localizados.
- Não remover CSS em uso nem alterar estilos de outras seções.

## Impact

- `src/components/sections/About.astro`: reescrito (duas colunas fixas, info ao lado da foto, timeline contínua com barra de duração, header com intervalo real).
- `src/data/profile.ts`: `hero.mainStack`, `TimelineEntry.summary`.
- `src/i18n/ui.ts`: novos rótulos (colunas, Nome/Role/Stack/Location, bio, duração).
- `src/styles/global.css`: `--morph-final-size` responsivo.
- `src/components/ui/scroll-morph.ts`, `src/components/blueprint/morph-measure.ts`, `BlueprintMorphEnd.astro`, `BlueprintMorphStart.astro`, `BlueprintMorphBoard.astro`: tamanho final responsivo + escala de rótulos (`--bp-scale`).
- `src/components/sections/Hero.astro`: alvo `#sobre-portrait`, `finalX=0`, `finalY=0`.
- `e2e/about-section.spec.ts`: reescrito (duas colunas, info ao lado, timeline, header, /en/).
- `e2e/blueprint-morph.spec.ts`, `e2e/scroll-morph.spec.ts`: alvo/parâmetros/tamanho final responsivos.
- `docs/perf-seo-checklist.md` + `docs/audit*.md`: atualizados.
