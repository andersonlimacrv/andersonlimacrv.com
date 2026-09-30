# Design

## Context

Ver `proposal.md`. Motor `reveal.ts` (IO compartilhado, threshold 0,1, dedupe `WeakSet`, re-arme View Transitions) + `Reveal.astro` (`delay` via `--reveal-delay`) + CSS em `global.css`. Achado: `--reveal-delay` nunca lido — stagger morto.

## Goals / Non-Goals

**Goals:** assinatura visível, stagger CSS automático, cobertura por elemento, motor e APIs intactos.

**Non-Goals:** novas props de animação, blur/scale, mudanças no IO.

## Decisions

1. **Só CSS no motor de animação** — assinatura + `transition-delay: var(--reveal-delay, 0ms)` + `nth-child(1..9)` 0→480ms com teto `n+10` em 480ms; `reveal.ts`/`Reveal.astro` intocados.
2. **Grupos em pais existentes** (`footer`, `nav`, `ul`, `nav`, `form`, divs) + `data-reveal` nos itens; blocos `Reveal` viram `div` comum só onde o item assume (Projetos, Blog, BlogIndex, Contato, sociais) — sem mudar layout (mesmas classes).
3. **FlowingMenu/EdgeReveal seguros** — reveal age no container do item (`opacity`/`transform`); marquee mede `offsetWidth` (opacity preserva layout) e usa `translate` (eixo separado).
4. **Hero anima** — decisão anterior revertida com o usuário; `animationName` continua `none` (são transitions), `locale-layout` atualizado.
5. **Specs reescritos onde conflitam** — `reveal.spec` t1 (só abaixo-da-dobra nasce oculto), stagger novo, settles 800→1200ms onde se mede caixa em transição.

## Risks / Trade-offs

- [Risco] `nth-child` conta todos os irmãos, não só itens → Mitigação: grupos escolhidos com filhos uniformes; e2e de stagger comprova a ordem.
- [Risco] Mais alvos IO (~35) → Mitigação: 1 observer, callback trivial; sem timers JS.
- [Risco] Elementos colados no fim da página nunca cruzavam o `rootMargin: -40px` inferior e ficavam presos em opacity 0 (copyright do footer, pego em e2e) → Mitigação: `rootMargin: '0px'`; threshold 0,1 continua exigindo visibilidade.
- [Risco] Waits fixos frágeis com stagger (480ms + 0,7s) sob carga → Mitigação: e2e usa poll (foto de estado 2× idêntica ou opacity total) em vez de timeouts fixos.
- [Risco] `reveal.ts` carregava só via `Reveal.astro` — páginas sem o componente (`/blog`) nunca aplicavam `reveal-present` → Mitigação: import global no `BaseLayout.astro`; `Reveal.astro` vira wrapper puro de markup.
- [Risco] Viewport do runner é 720p (`Desktop Chrome` sobrescreve o viewport do config): CTAs do hero ficam abaixo da dobra e o IO nunca dispara → Mitigação: `section#hero [data-reveal]` revela no `init` (entrada escalonada no load, intenção original do hero-entrance); `reveal.spec` exclui o hero do `belowFoldHidden`.
- [Risco] Teste óptico excede o timeout padrão de 30s (4 combos × 8 settles com transitions 0,7s) → Mitigação: `test.setTimeout(120_000)` nesse teste.
- Trade-off: primeira dobra anima no load (movimento inicial aceito e pedido).
- **Decisão one-shot (padrão permanente)**: o reveal dispara uma única vez por elemento (`unobserve` após revelar). Re-animar a cada cruzamento custaria pouco em CPU (só compositor), mas gera flicker na dobra, distrai a leitura e quebra o determinismo dos testes. O sweep de `load`+1200ms é só rede de segurança para entrega perdida, nunca re-disparo.

## Migration Plan

1. CSS → componentes → specs.
2. Full suite. Rollback por arquivo (atributos removíveis).
