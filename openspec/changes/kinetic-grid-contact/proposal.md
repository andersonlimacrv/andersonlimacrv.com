# Proposal: kinetic-grid-contact

## Why

A seção de contato está visualmente plana comparada às demais (sem nenhum elemento interativo próprio). A referência aprovada (`references/background-interactive/`) é um background canvas interativo (KineticGrid, SatoriUI/MIT) que deforma um grid em direção ao cursor e emite ondas no click — encaixa na estética blueprint do site e dá vida à seção sem adicionar dependências.

## What Changes

- Transcrição do componente React `KineticGrid` para **Astro + TS vanilla sem React e sem libs**: `KineticGrid.astro` + módulo co-localizado `kinetic-grid.ts` (padrão `ElasticLine`).
- Física original preservada (warp com bell falloff, edge pin, ripples no click, lerp do mouse, smoothstep, glow).
- Adaptações obrigatórias: canvas contido no box (não full-screen `fixed`), fundo transparente theme-aware (cores lidas dos tokens do site), listeners no container, DPR, pausa fora da viewport, `prefers-reduced-motion` estático, ciclo de vida View Transitions.
- Integração no `Contact.astro` substituindo o placeholder `<div>teste o background aqui</div>` por box emoldurado com o efeito + hint mono localizado (pt/es/en).
- Hook de debug `data-ripple-count` para asserção em e2e.

## Capabilities

### New Capabilities

- `kinetic-grid`: background canvas interativo reutilizável (grid warp + ripples), com requisitos de tema, performance, reduced-motion e ciclo de vida.

### Modified Capabilities

Nenhuma (a seção de contato não tem capability spec própria; a mudança é aditiva).

## Impact

- **Código novo**: `src/components/ui/KineticGrid.astro`, `src/components/ui/kinetic-grid.ts`.
- **Código alterado**: `src/components/sections/Contact.astro` (placeholder → box), `src/i18n/ui.ts` (1 chave nova por locale).
- **Testes**: novo `e2e/kinetic-grid.spec.ts`; specs existentes não são afetados (nenhum seletor removido).
- **Performance**: ~2–3 KB gzip de JS novo; rAF pausado fora da viewport; sem libs.
- **Referência**: `references/background-interactive/background-interactive.tsx` (fonte colada pelo usuário, MIT).

## Non-goals

- Não usar o efeito como fundo full-screen da página ou de outras seções (apenas no box do contato).
- Não portar o modo de cor "default" azul do original como tema próprio — as cores vêm dos tokens do site (`foreground`/`primary`).
- Não adicionar dependências npm (framer-motion, cn util, etc.).
- Não suportar touch-drag contínuo (tap gera ripple; warp segue pointermove/touchmove pontual).
