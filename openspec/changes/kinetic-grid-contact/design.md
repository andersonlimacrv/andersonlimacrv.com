# Design: kinetic-grid-contact

## Context

Referência: `references/background-interactive/background-interactive.tsx` (React, SatoriUI/MIT) — canvas full-screen com grid warp + ripples. Destino: box contido no `Contact.astro` (placeholder existente). Padrão do repo para componentes interativos: `.astro` com `data-*` + módulo TS vanilla co-localizado + `<script> import './modulo'` (ex.: `ElasticLine.astro`/`elastic-line.ts`), com init/cleanup via eventos Astro.

## Goals / Non-Goals

**Goals**: fidelidade da física; tema claro/escuro via tokens; zero libs; zero custo fora da viewport; e2e testável.
**Non-Goals**: full-screen; touch-drag; usar o azul "default" do original (será `--primary` do site).

## Decisions

1. **Módulo vanilla + eventos Astro** (`astro:page-load` init, `astro:before-swap` cleanup, WeakMap de estados): mesmo contrato de `elastic-line.ts`/`target-hover.ts`; sobrevive a ClientRouter sem duplicar listeners.
2. **Coordenadas relativas ao canvas** (`getBoundingClientRect` em `pointermove`/`pointerdown` no wrapper) em vez de `clientX/Y` globais: o efeito vive num box, não na página. Listeners no wrapper — click em links fora do box não gera ripple.
3. **Fundo transparente**: original pinta `#161618`/`#000`; nós não pintamos bg — o box herda o fundo do site e funciona em light/dark.
4. **Cores via `getComputedStyle(wrapper)`**: `color` → base (composto rgba com alphas 0.13/0.05/0.2); `--primary` (resolvido via elemento provisório com `color: var(--primary)`) → ativo/glow/ripple. Revalidado por `MutationObserver` em `html.class` (theme toggle) + cache invalidado em `astro:after-swap`.
5. **DPR**: `canvas.width = cssW * dpr` + `ctx.setTransform(dpr,0,0,dpr,0,0)` — o original desenha em CSS px sem DPR (blur em retina). `ResizeObserver` no wrapper re-dimensiona.
6. **Pausa fora da viewport**: `IntersectionObserver` cancela/retoma o rAF (original roda sempre — custo inaceitável numa home com scroll).
7. **Reduced-motion**: desenha 1 frame estático (grid + textura, sem mouse/ripples), `data-static="true"`, sem listeners de movimento; convenção do projeto (WCAG/reduced-motion).
8. **Debug hooks p/ e2e**: `data-ripple-count` (incrementado por ripple criado) e `data-static` no wrapper — asserção sem API global.
9. **Props**: `globalColor?: "default" | "monochrome"` mapeia cor ativa (`--primary` vs `foreground`) e `class` repassada ao wrapper (paridade com a API original); `children` → `<slot/>`.
10. **Box no Contact**: `relative overflow-hidden border border-border` com cantoneiras `CrossMark` (componente existente), `h-60`, canvas absoluto; hint mono uppercase (`text-muted-foreground`, tracking largo) posicionado no canto inferior esquerdo do box, localizado via chave nova `contactGridHint` em `ui.ts` (pt/es/en).

## Risks / Trade-offs

- [getComputedStyle por frame custa] → leitura cacheada; só revalida em eventos (tema/resize/swap).
- [Ripple em touch sem hover prévio] → `pointerdown` cobre tap; warp segue `pointermove` de touch enquanto pressionado; aceitável.
- [Glow radial custoso em nós ativos] → mesmo parâmetro do original (poucos nós com t>0.3 por vez); Canvas 2D aguenta no box pequeno.
- [Layout do box muda altura da seção] → altura fixa `h-60` evita shift; section já usa `py-16/20`.

## Migration Plan

Arquivos novos + 2 alterações localizadas (Contact, ui.ts). Sem dados/rotas. Rollback = remover os 2 arquivos novos e reverter os 2 alterados. Verificação: `check`, `test:e2e`, `build`+`audit`.

## Open Questions

Nenhuma — fonte (código original colado) e posição (box do placeholder) aprovadas pelo usuário.
