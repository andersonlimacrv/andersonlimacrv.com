# Design

## Context

Ver `proposal.md` (Why). Estado atual:

- Referências: `script.ts` (15 217 bytes, 437 linhas, WAAPI + rAF por item, sem deps), `tailwind.css` (5 460 bytes, tokens `--fm-*` hardcoded `#120F17`/`#fff`), `FlowingMenu.htm` (4 321 bytes, 4 imagens Unsplash 600×400 com preload), `ManyHovers.html` (16 417 bytes, WAAPI `translate` 600 ms expo, sem loop contínuo).
- Padrões do projeto a reutilizar: `ElasticLine.astro` + `elastic-line.ts`, `KineticGrid.astro` + `kinetic-grid.ts`, `Reveal.astro` + `reveal.ts` (componente fino com props + `<script> import './x'` + `data-*`; re-init em `astro:page-load`/`astro:after-swap` com `WeakSet`; CSS em `@layer components` ou `<style>` escopado; `astro.config.mjs` com `inlineStylesheets: 'auto'` — CSS global é inlineado nas 15 páginas).
- Restrições: zero JS na home por padrão, View Transitions (`ClientRouter`), i18n pt/es/en, `prefers-reduced-motion`, WCAG AA, `robots`/`sitemap`.

## Goals / Non-Goals

**Goals:**

- Rota `/lab` isolada com os dois ports lado a lado, mensuráveis (peso, FPS do marquee, contraste light/dark).
- Ports idiomáticos Astro sem dependências, com pausa fora da viewport e `destroy()` no swap.

**Non-Goals:**

- Não decidir nesta change o uso final na home (só coletar evidência para decisão futura).
- Não criar sistema genérico de "reveal engine" além do atributo `[data-edge-reveal]`.

## Decisions

1. **Rota `/lab` em vez de seção na `HomePage`** — `src/pages/lab.astro` (+ `es/lab`, `en/lab` via i18n existente). Alternativa (seção nova na home) foi rejeitada: contaminaria LCP/CLS da home com ~7 KB gzip + rAF contínuo + 4 imagens, e exigiria `noindex` parcial impossível por seção.
2. **Co-localização `FlowingMenu.astro` + `flowing-menu.ts` e `EdgeReveal.astro` + `edge-reveal.ts` em `src/components/lab/`** — segue `ElasticLine`/`KineticGrid`; props via `data-*` (`data-speed`, `data-items` JSON). Rejeitado: copiar `script.ts`/`tailwind.css` crus (tokens hardcoded, imagens remotas, sem pausa por `IntersectionObserver`, sem ciclo View Transitions).
3. **CSS escopado (`<style>` no `.astro` da lab) em vez de `global.css`** — `inlineStylesheets: 'auto'` inlinearia CSS global nas 15 páginas (~+8 KB); escopado só pesa na `/lab`. Tokens mapeados: `--fm-*` → `var(--background/foreground/primary/border)`; `font-size: 4vh` → `text-h2`/`clamp` editorial; pill `999px` fica escopado na lab (design system mantém `radius 4px`).
4. **Imagens locais via `astro:assets`** — as 4 do Unsplash viram 2–4 thumbs locais WebP/AVIF com `width`/`height` + `decoding="async"` (reaproveita `preload`/`decode()` do original sem 3rd-party). Lab usa `loading="lazy"` (abaixo da dobra da própria página).
5. **Ciclo de vida View Transitions + pausa** — `init` em `astro:page-load`/`astro:after-swap` com dedupe `WeakSet` (cf. `reveal.ts`); cada `createFlowingMenu` retorna `destroy()` (rAF cancel, listeners e WAAPI cancelados); `IntersectionObserver` por menu pausa os N loops (hoje só `document.hidden`). Resize mantém debounce 150 ms; medição após `document.fonts.ready`.
6. **Auditoria antes do merge** — medir com `npm run build` + `scripts/css-audit.mjs` + e2e: (a) bytes JS/CSS gzip da `/lab` vs `/`, (b) `data-ripple-count`-style hooks (`data-lab="flowing|edge"`, `.is-open`), (c) contraste AA light/dark, (d) `prefers-reduced-motion`.

## Risks / Trade-offs

- [Risco] 4 loops rAF simultâneos engasgam em mobile → Mitigação: 1 rAF por menu + pausa por `IntersectionObserver` + `partWidth` cacheado; fallback estático em reduced-motion.
- [Risco] `mix-blend-mode: difference` quebra contraste no tema claro → Mitigação: teste AA nos dois temas na lab; se falhar, fallback sem blend com cores de token explícitas.
- [Risco] `translate` (propriedade CSS) vs `transform` em browsers antigos → Mitigação: repouso via inline `translate` + `transform: translateY(101%)` fallback no-JS mantido; WAAPI com `commitStyles` + timeout fallback (padrão já usado nas referências).
- [Risco] Hidratacão dupla no swap do ClientRouter → Mitigação: `destroy()` + `WeakSet` guard, mesmo padrão de `reveal.ts`.
- Trade-off: duplicar ~200 linhas de lógica WAAPI entre os dois componentes em vez de abstrair — aceito propositadamente para manter cada port auditável; abstração só se um uso na home for aprovado.

## Migration Plan

1. Criar `/lab` + ports (só arquivos novos, exceto 3–4 chaves i18n em `src/i18n/ui.ts`).
2. E2E + css-audit em CI local; build limpo (`astro check` + `astro build`).
3. Rollback: deletar `src/pages/lab.astro` + `src/components/lab/` = home volta a zero byte (nenhum import na home).
4. Decisão futura (outra change): à luz das métricas, propor — ou descartar — uso real (ex.: EdgeReveal em `ProjectLink`).

## Open Questions

- Quantas imagens locais usar na lab (reaproveitar `me.png` vs gerar 2 thumbs neutras)? Resposta não muda specs nem tasks — decidir na implementação pelo menor custo.
