# Design: target-simbol-spin

## Context

Referência visual: `references/target-simbol.svg` (VTracer, 2 paths, fills #fff/#CCC). Bbox medido no browser: **centro exato em (256,256)** do viewBox 512 → `transform-origin: center` sem ajustes. Padrão do repo para interativos: `.astro` + módulo TS vanilla + `astro:page-load`/`after-swap` (cf. `reveal.ts`, `target-hover.ts`).

## Goals / Non-Goals

**Goals**: spin roleta (fast→stop) nos 3 triggers; custo mínimo (1 instância, compositor); tema-aware; e2e determinístico via `data-spins`.
**Non-Goals**: marcador por link; substituir TargetHover; libs.

## Decisions

1. **SVG inline no componente** (não arquivo em `public/`): zero request extra, controle de fill via CSS, ~3–4 KB no HTML da home. Fills: `.target-simbol-ring` = `color-mix(foreground 55%)`, `.target-simbol-dot` = `var(--primary)`.
2. **Web Animations API** (`el.animate(rotate 0→1080deg, 1000ms, cubic-bezier(0.16,1,0.3,1))`): nativa, compositor (transform), `onfinish`/`oncancel` liberam a flag `spinning` — re-triggers ignorados (flag checada no início do spin). Sem rAF manual, sem reflow. `will-change: transform` no wrapper (1 instância sempre visível — custo desprezível).
3. **Trigger por entrada na viewport**: `IntersectionObserver` único delegado (threshold 0.5), spins em cada re-entrada (decisão do usuário). `pointerenter` e `pointerdown` escutados no wrapper.
4. **Reduced-motion**: `init()` retorna cedo — sem observer, sem listeners (nada anima; `data-spins` fica 0). Convenção do projeto.
5. **Posição**: `absolute bottom-3 right-4` dentro do box do KineticGrid (`#contato`), `opacity-60 hover:opacity-100` — oposta ao hint (bottom-left). Complementar ao TargetHover.
6. **e2e**: `data-spins` (incremento no início de cada spin) — asserções de viewport/reentrada/hover/click/re-trigger/reduced-motion/tema. Sem flakiness de timing (contador, não rAF).

## Risks / Trade-offs

- [Spin longo 1s vs UX] → convenção aprovada; re-triggers ignorados evitam acumulação.
- [SVG cru 7KB VTracer] → inline aceito (~3–4 KB gzip ~1 KB); não vale otimizar paths manualmente.
- [color-mix em fill de SVG] → suportado no Chrome/Chromium (teste cobre computed fill).

## Migration Plan

Arquivos novos + 1 alteração localizada (Contact). Verificação: `check`, `test:e2e`, `build`+`audit`. Rollback: reverter.

## Open Questions

Nenhuma — escopo/posição/tamanho/triggers aprovados pelo usuário.