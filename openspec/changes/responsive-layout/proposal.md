## Why

O prompt exige design mobile-first com breakpoints bem definidos e tipografia fluida. Este change garante que todas as páginas (home, blog) se comportem corretamente de mobile a desktop.

## What Changes

- Layout mobile-first em todas as páginas/componentes (Tailwind `sm/md/lg/xl`), projetado primeiro para mobile.
- Tipografia fluida via `clamp()` (já nos tokens) — sem múltiplos breakpoints de font-size.
- Header: menu hambúrguer animado no mobile (nav empilhada na toolbox, sem overlay pesado), nav inline no desktop.
- Grade de posts do blog: 1 coluna mobile → 2 tablet → 2–3 desktop.
- Hero: empilhado no mobile (retrato abaixo do texto), lado a lado no desktop.
- Grid das seções numeradas com rail/divisor responsivo (esconder rail no mobile).
- Container com padding fluido (`px-4 sm:px-6 lg:px-8` + `max-w`), gutter consistente.
- Verificação manual nos breakpoints principais (320, 375, 768, 1024, 1440) via build + revisão de CSS.
- Touch targets ≥ 44px para links/CTAs no mobile.
- Sem overflow horizontal em nenhum breakpoint.

## Capabilities

### New Capabilities
- `responsive`: Comportamento responsivo mobile-first de todas as páginas e componentes, com tipografia fluida e breakpoints verificados.

### Modified Capabilities
<!-- nenhuma -->

## Impact

- Classes/estilos em `index.astro`, blog pages, componentes (`Header`, `Hero`, `PostCard`, etc.) e `global.css`.
- Depende de `site-foundation`, `design-tokens`, `home-page`, `mini-blog`, `motion`.
