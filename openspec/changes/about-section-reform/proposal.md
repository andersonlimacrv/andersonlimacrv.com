## Why

A seção Sobre atual é esparsa (1 parágrafo, sem identidade), o texto colide com o círculo da imagem no canto e não usa o perfil real (dados existem em `add-data.json`). O usuário quer uma reforma completa: **duas colunas** — esquerda (~40% da tela) com **quote em cima e descrição embaixo**; direita com uma **timeline minimalista** de empregos/títulos/estudos — num visual **extremo geométrico** (linhas finas formando retângulos, padrão de UI mantido), mantendo a imagem do hero intocada e limpando CSS morto.

## What Changes

- **Layout duas colunas via flex** (nunca grid) em `#sobre-content`: esquerda `lg:w-[40%]` (quote + descrição), direita `flex-1` (timeline). Divisores geométricos: `border-l` vertical entre colunas, `border-t` entre blocos/itens/rodapé.
- **Imagem como selo no canto superior-esquerdo**: ponto de aterrissagem do morph vira `finalX=0.06`/`finalY=0.10` (Hero + `bp-end`); a imagem do hero em si não é tocada.
- **Conteúdo completo** a partir de `src/data/profile.ts` (fonte única, fatos em pt, sem campos `OUTDATED_*`): timeline mesclada de `careerJourney` (mais recente → antigo) com `experienceDetails` como `<details>` expansível; chips = grupos de `techStack`; bloco de detalhes = itens de `about`; rodapé com `hero.location` + links sociais (com `cursor-target`/TargetHover); `hero.bio`/`hero.title` enriquecem o JSON-LD Person.
- **Rótulos localizados** em pt/es/en (quote, títulos de bloco); dados factuais ficam em pt.
- **Limpeza de CSS não utilizado** (regras custom mortas em `global.css`/componentes) sem tocar na estrutura geral.

## Capabilities

### New Capabilities
- `about-section`: seção Sobre em duas colunas (quote+descrição ~40% à esquerda; timeline minimalista à direita), dividida por linhas geométricas, com selo da imagem no canto superior-esquerdo, timeline expandível, chips de stack, bloco de detalhes, rodapé de localização/contato e hover de mira (TargetHover).

### Modified Capabilities
<!-- Nenhuma capability principal existente (specs/ está vazio). O delta `blueprint-morph-wireframe` do change `redesign-engineering-blueprint` documenta o ponto de aterrissagem (0.15/0.5) e será atualizado para o novo selo (0.06/0.10) por coerência. -->

## Non-goals

- Não alterar o hero (a imagem em si, o morph clip/scale) — apenas o ponto de aterrissagem do círculo dentro de `#sobre-content`.
- Não mexer nas demais seções (Projetos, Blog, Contato) nem no design system global (tokens, cores, tipografia).
- Não traduzir os dados factuais (cargos/períodos/stack) — ficam em pt; só rótulos/quote são localizados.
- Não remover CSS em uso nem alterar estilos de outras seções (a limpeza é só de regras comprovadamente mortas).

## Impact

- `src/data/profile.ts` (novo): tipos + dados de `add-data.json` (filtrado).
- `src/components/sections/About.astro`: layout duas colunas + timeline + chips + detalhes + rodapé.
- `src/components/sections/Hero.astro`: `finalX`/`finalY` do morph e da legenda do board.
- `src/components/blueprint/BlueprintMorphEnd.astro` (via props): novo `finalX`/`finalY`.
- `src/i18n/ui.ts`: rótulos/quote novos (pt/es/en); `src/components/pages/HomePage.astro`: JSON-LD enriquecido.
- `src/styles/global.css` + `<style>` de componentes: remoção de CSS morto.
- `e2e/about-section.spec.ts` (reescrito), `e2e/blueprint-morph.spec.ts` (constantes de geometria).
- `add-data.json`: removido após migração confirmada.