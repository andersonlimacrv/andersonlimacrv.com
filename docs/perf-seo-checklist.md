# Checklist de performance & SEO — andersonlimacrv.com

Checklist reutilizável para validar o site antes de deploy. O script
`scripts/audit.mjs` regenera `docs/audit.md` (relatório atual) e compara
com o baseline salvo em `docs/audit-baseline.json`.

## Como rodar

```sh
npm run build          # build de produção
npm run check          # diagnóstico Astro (0 erros)
npm run test:e2e       # 76 testes Playwright (desktop/mobile, wireframe blueprint)
node scripts/audit.mjs # build + métricas + comparação vs baseline
```

## Performance

- [x] Build gera 15 páginas HTML (pt/es/en) sem erros.
- [x] 6 arquivos de fonte (woff2) em vez dos 13 originais — apenas subsets
      latin/latin-ext usados pelo conteúdo (pt/es/en).
- [x] `@font-face` explícitos com `unicode-range` (sem cyrillic/greek/vietnamese).
- [x] Zero warnings do Lightning CSS no build.
- [x] `font-display: swap` em todas as fontes.
- [x] OG dedicada 1200×630 derivada de `me.png` (webp), com width/height/alt.
- [x] Seção Sobre em duas colunas fixas (desktop/mobile) sem overflow horizontal.
- [x] Morph do retrato com diâmetro final responsivo (`--morph-final-size`),
      lido pelo JS e pelos wireframes blueprint em vez de constante fixa.

| Métrica | Baseline | Atual | Δ |
| --- | --- | --- | --- |
| Arquivos dist/ | 42 | 39 | −3 |
| Peso raw | 640.9 KB | 932.4 KB | +291.5 KB |
| Peso gzip | 411.1 KB | 442.8 KB | +31.7 KB |
| Fontes | 13 | 6 | −7 |
| CSS externo (linhas global.css) | 706 | 687 | −19 |
| `group-link`/`group-arrow` (regras) | 2 | 0 | −2 |
| SVGs inline de link | 6 | 0 | −6 |
| Instâncias `<TargetHover>` | 1 (About) | 1 (global) | — |

## SEO on-page

- [x] Meta description em todas as páginas.
- [x] Canonical em todas as páginas.
- [x] Open Graph completo: type, title, description, image (dimensões+alt),
      site_name, locale, locale:alternate, url.
- [x] Twitter card (summary_large_image).
- [x] `meta robots` controlável por página.
- [x] `theme-color` claro/escuro (media queries).
- [x] favicon com `type="image/svg+xml"`.
- [x] Hreflang + `x-default` para pt/es/en.
- [x] 27 blocos JSON-LD válidos (Person, WebSite, BlogPosting, BreadcrumbList).

## GEO / IA

- [x] `llms.txt` com "Resposta direta" e resumo do site.
- [x] `robots.txt` liberando GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
- [x] JSON-LD no `<head>` (via slot) — zero blocos no body.

## Descoberta

- [x] sitemap-index.xml presente.
- [x] robots.txt presente.
- [x] llms.txt presente.

## Acessibilidade

- [x] Skip-link para `#main-content`.
- [x] Logo com `aria-label` localizado.
- [x] Nav com `aria-label` localizado.
- [x] Theme toggle com `aria-label` localizado e sincronizado com o estado.
- [x] Seções numeradas com `aria-labelledby` apontando para o `<h2 id="*-title">`.
- [x] Hero com `aria-labelledby="hero-title"` no `<h1>`.
- [x] Colunas Perfil/Trajetória marcadadas com `data-col` (sem landmarks anônimos).
