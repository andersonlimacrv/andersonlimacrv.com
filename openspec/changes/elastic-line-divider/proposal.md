## Why

A linha elástica original foi prototipada como componente React + `framer-motion`. Depois da decisão de não colocar React no site (stack é Astro + Tailwind v4, zero JS por padrão), a linha foi portada para TypeScript vanilla e integrada à landing como divisor entre seções. Este change formaliza o trabalho já implementado e registra as validações/ajustes que ficaram **em aberto** (telas grandes e identidade visual).

## What Changes

- Port para TS vanilla do comportamento elástico (extremidades fixas em `midX`/`midY`, resistência ~2.2x, thresholds de grab/release) sem React nem `framer-motion`.
- Componente `ElasticLine.astro` consumível como divisor full-width entre seções da HomePage; remoção trivial (apagar as linhas de uso).
- Quatro instâncias na landing (hero|sobre, sobre|projetos, projetos|blog, blog|contato) com um único script inline deduplicado (~2.3 KB) — JS total ~16 KB.
- Correção de responsividade: `applySize()` sincroniza `width`/`height` + `viewBox` e recentra o controle no `ResizeObserver`.
- Sem `prefers-reduced-motion`: comportamento preserva o do original (linha diverte a interação, sem animação contínua independente).

## Capabilities

### New Capabilities
- `elastic-line`: Divisor interativo elástico (TS vanilla) com extremidades fixas, responsivo, leve e sem dependências, usado como marcador de transição entre seções na landing.

## Impact

- Landing page: +4 divisores full-width (~4.9 KB HTML bruto extra ao total).
- Zero dependências novas; JS entregue é um script inline único por página.
- Sem mudanças em build/SEO/RSS.