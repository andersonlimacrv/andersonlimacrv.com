# Proposal: lab-multiphoto-marquee

## Why

O marquee final do projeto exibirá várias fotos por item; antes de trocar os assets é preciso validar o layout com múltiplas imagens lado a lado (densidade, ritmo de larguras, reveal com partes largas, mobile). Teste isolado na `/lab`, sem tocar Projetos.

## What Changes

- `FlowingMenu.astro` ganha `imagesPerPart?: number` (default `1` — A, B e Projetos intactos) + 3 crops locais de `me.png` com larguras de exibição alternadas (160/110/200px).
- `buildPart()` cria N `<img>` por parte (ciclando os crops); `data-images`/`data-widths` CSV alimentam o enhance.
- `LabPage.astro`: bloco C "multi-imagem" com `imagesPerPart={3}` + i18n `lab.variantC` (pt/es/en).
- E2E: partes do bloco C com 3 imagens na mesma linha, `loading="lazy"`.

## Capabilities

### New Capabilities

- `lab-multiphoto-marquee`: demo lab de marquee com múltiplas fotos lado a lado por parte, para validação visual antes dos assets finais.

### Modified Capabilities

Nenhuma.

## Impact

- **Alterado**: `FlowingMenu.astro`/`.ts` (aditivo, retrocompatível), `LabPage.astro`, `src/i18n/ui.ts` (+1 chave/locale), 1 teste e2e.
- **Performance**: mesma URL base reaproveitada (1 request, 1 decode); kinvalidade zero fora da `/lab`.
- **Referência**: bloco de teste — deletável sem impacto quando os assets finais chegarem.

## Non-goals

- Não trocar thumbs de Projetos/A/B; não adicionar campos em `src/data/projects.ts`.
- Não buscar fotos distintas (só `me.png` em crops).
