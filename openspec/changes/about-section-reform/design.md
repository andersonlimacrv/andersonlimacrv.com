## Context

A seção Sobre atual (`src/components/sections/About.astro`) foi reformulada para `flex flex-col lg:flex-row` com spacer de 256px reservando o círculo (posição `finalX=0.15`/`finalY=0.5`), quote serif + bio em 2 parágrafos + chips + bloco "agora". O usuário redefiniu o desenho: **duas colunas** (esquerda ~40% quote+descrição; direita timeline minimalista), **imagem como selo no topo-esquerdo**, **extremo geométrico** (linhas formando retângulos), e **todos os campos** de `add-data.json` no projeto. `container-site` é cravado em 1024px (`--container-5xl`). `#sobre-content` deve continuar fora de `[data-reveal]` (teste `contentNotRevealed` + transform do Reveal desalinha o anel).

## Goals / Non-Goals

**Goals:**
- Duas colunas via flex (nunca grid) com divisores de linha (`border`) — visual geométrico/minimalista no padrão de UI do site.
- Selo: apenas o ponto de aterrissagem do morph muda (`finalX=0.06`, `finalY=0.10`); imagem do hero e clamp intactos.
- Dados factuais em `src/data/profile.ts` (fonte única, pt, sem `OUTDATED_*`); rótulos/quote localizados.
- Limpeza de CSS morto comprovado, sem tocar no restante.

**Non-Goals:**
- Alterar hero (imagem/clip/scale), outras seções, design system, `TargetHover.astro`.
- Traduzir dados factuais.

## Decisions

### 1. Duas colunas flex + divisores geométricos
`#sobre-content` = `flex flex-col lg:flex-row lg:flex-wrap lg:items-stretch`. Coluna esquerda `lg:w-[min(40vw,55%)] lg:shrink-0` (≈40% da tela; limite 55% do container para telas grandes) com citação + descrição + bloco de detalhes + rodapé; coluna direita `lg:flex-1` com a timeline. Abaixo das colunas, **faixa de stack em largura total** (`lg:basis-full`, grupos em `flex-wrap` com `lg:w-1/3`). Divisores: `border-l` na coluna da direita (desktop), `border-t` entre blocos/itens/rodapé; cor `--border` existente — sem novos tokens. Alternativa (grid) rejeitada por instrução do usuário ("sempre flex").

### 2. Selo da imagem (finalX=0.06, finalY=0)
O círculo pousa **colado no topo-esquerdo**: com `finalY=0`, `top = max(0, −80) = 0` para qualquer altura — estável no desktop e no mobile (sem depender da altura da seção). `left = max(0, 0.06*1024−80) = 0` → selo em `x:0–160px`, `y:0–160px`. Para evitar sobreposição: desktop → coluna esquerda com `lg:pl-44` (176px) para o texto ficar à direita do selo; mobile → coluna com `pt-44` para começar abaixo do selo. Alterar `finalX/finalY` em: `Hero.astro` (ScrollMorphPortrait data-* + BlueprintMorphBoard/legenda x·y), `About.astro` (BlueprintMorphEnd). Constantes dos e2e (`blueprint-morph.spec.ts`) atualizadas para 0.06/0.

### 3. Dados — `src/data/profile.ts`
Tipos `Profile`, `AboutItem`, `TechGroup`, `TimelineEntry`, `ExperienceDetail`. Fonte única em pt extraída de `add-data.json`, filtrando `OUTDATED_*`. `careerJourney` ordenado do mais recente para o mais antigo (por período inicial desc; "presente" como agora). `experienceDetails` indexados por empresa para casar com a timeline. `education` fica disponível (já representado na timeline mesclada). `hero.bio`/`hero.title` → JSON-LD Person (`HomePage.astro`).

### 4. Expansão da timeline com `<details>`
Cada item com `experienceDetails` usa `<details><summary>` nativo (sem JS, acessível, respeita reduced-motion). Highlights agrupados por frontend/backend/IoT quando o item tem objetos; senão lista plana. Visual mono/minimalista, separado por linhas.

### 5. Limpeza de CSS não utilizado
Inventariar regras custom de `global.css` e `<style>` de componentes; para cada seletor, greppar uso real em `src/` (e `e2e/`). Remover apenas os mortos comprovados (ex.: `.bp-legend-rule` definido sem elemento; `.rail-left` pode ficar órfão se o rodapé substituir o aside). Tailwind v4 já purga utilities — foco só nos blocos custom. Validar com build + e2e completo + auditoria (peso do CSS não deve subir).

## Risks / Trade-offs

- [Selo sobrepõe texto em larguras intermediárias] → container fixo em 1024px torna a matemática estável; `lg:pl-44`/`pt-40` cobrem; ajuste fino na revisão visual.
- [Efeito visual das linhas] → cor `--border` (oklch 0.92) sobre fundo branco pode ser sutil; se preciso, aumentar para `--bp-line` no desktop — decidir na revisão visual, sem mudar tokens.
- [Conteúdo factual em pt para en/es] → dados factuais ficam em pt por decisão do usuário; rótulos localizados.
- [Mudança de geometria quebra e2e existentes] → atualizar as constantes de `blueprint-morph.spec.ts` (0.15/0.5 → 0.06/0.10) e reescrever `about-section.spec.ts` na Fase 1.