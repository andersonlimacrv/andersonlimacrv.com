## Why

A home é a página central do site pessoal. Este change entrega a one-page editorial completa (hero com retrato B&W, sobre, projetos, blog em destaque, contato), incluindo a integração da imagem `me.png` via `astro:assets`.

## What Changes

- Move `me.png` (raiz do repo, 1122x1402px, já em B&W) para `src/assets/me.png`.
- Importa a imagem via `astro:assets` no hero, com otimização automática (AVIF/WebP), `loading="eager"` e `fetchpriority="high"` (LCP), `alt` descritivo e legenda em mono (ex.: `AndersonLima0001 / B&W`).
- Header sticky (backdrop blur) com nome + links de navegação âncora.
- Hero: eyebrow mono + nome grande em display `clamp()` + parágrafo de posicionamento + retrato com legenda.
- Seções numeradas: `01 / Sobre`, `02 / Projetos`, `03 / Blog`, `04 / Contato` (número mono, título display).
- Sobre: texto curto de posicionamento + lista de links com seta `→` (GitHub, LinkedIn, etc.).
- Projetos: cards com borda 1px, raio 4px, lista de links com seta e hover sutil.
- Blog em destaque: 2–3 `PostCard` (data em mono, título, resumo, tags chips) — dados vêm de Content Collections (criadas no change mini-blog; aqui renderiza lista estática mínima de fallback).
- Contato: email/links diretos, sem formulário.
- Footer minimalista: copyright + link "voltar ao topo".
- Componentes: `Header.astro`, `Footer.astro`, `Eyebrow.astro`, `SectionHeading.astro`, `ProjectLink.astro`, `PostCard.astro`.

## Capabilities

### New Capabilities
- `home-page`: Página inicial one-page com hero editorial (retrato B&W otimizado), seções numeradas, links de projetos, blog em destaque e contato.

### Modified Capabilities
<!-- nenhuma -->

## Impact

- `me.png` é movido de `src/../me.png` para `src/assets/me.png` (rastreado pelo git).
- `src/pages/index.astro` e 6 novos componentes em `src/components/`.
- Depende de `site-foundation` (layouts, tokens, fontes).
