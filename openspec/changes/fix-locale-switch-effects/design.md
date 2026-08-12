## Context

O site tem 3 línguas (pt/es/en) navegadas por View Transitions e por um `<select>` de idioma no header. Ao trocar de idioma, `hero-entrance` (com `@keyframes hero-in`) re-executava no hero, e a largura da pílula do header variava porque os links de nav eram auto-width ("Projetos" 8 chars vs "Proyectos" 9 vs "Projects" 8). Demais textos variáveis (Ver todos os posts, Voltar ao topo, tempo de leitura, títulos de cards) são standalone ou quebram linha naturalmente, sem empurrar outros elementos — verificados por checklist.

## Goals / Non-Goals

**Goals:**
- Hero estático em todas as cargas/navegações (sem efeito de entrada).
- Header com largura constante entre línguas (sem salto de layout na troca).
- Verificação automatizada (Playwright) + structural checks no build.

**Non-Goals:**
- Congelar a largura de todo e qualquer texto do site (parágrafos continuam quebrando linha normalmente).
- Animar/desanimar outros componentes (Reveal é inerte — sem CSS — e fica como está).
- CI/CD (repo sem pipelines; a suite roda localmente ou onde for configurada).

## Decisions

### 1. Remover `hero-entrance` por completo

`HomePage.astro`: remover a classe e o `--hero-delay` dos 4 elementos (eyebrow, h1, subtítulo, figure). `global.css`: remover o bloco `@media (prefers-reduced-motion)` do `.hero-entrance` e o `@keyframes hero-in`. Mantém-se `.hero-name` (tipografia). Alternativa considerada: manter o efeito e só pular em View Transitions — rejeitada (efeito indesejado também na carga inicial e JS extra para distinguir navegações).

### 2. Largura fixa nos links de nav

Cada link de nav recebe `w-24` (96px) + `justify-center` + `whitespace-nowrap` (substituindo `px-2.5`). O maior rótulo ("Proyectos") mede ≈80px a 12px mono com tracking 0.16em — cabe folgado. A pílula passa a ter largura idêntica nas 3 línguas (~logo 70px + 4×96px + select 88px + toggle 44px + gaps), tornando a troca de idioma sem salto. `aria-current`/underline ativo inalterados.

### 3. Legenda do retrato igual nas línguas

`ui.ts`: `figCaption` do es deixa de ter o sufixo " / B&W" e passa a "AndersonLimaCRV" (igual pt/en) — largura idêntica.

### 4. Playwright como dependência de dev + webServer

`@playwright/test` (free, Apache 2.0) + `npx playwright install chromium`. Config: `webServer` sobe `astro preview` (build estático recompilado via `npm run build` no `test:e2e`) na porta 4321 (`reuseExistingServer: !CI`) e viewport fixo 1280×800. Rodar contra o preview elimina cache/estado de conteúdo do dev server (fonte de falsos vazios) e testa exatamente o que vai para produção. Não impacta produção (devonly dependência; site SSG).

### 5. Testes e2e (medidas e estado, sem diff de pixels)

`e2e/locale-layout.spec.ts`: (a) largura da pílula e de cada link igual entre pt/es/en (±2px), antes/depois de trocar idioma pelo select; (b) hero sem animação — `animation-name: none` e visibilidade no primeiro paint (inclusive pós-VT); (c) conteúdo: 3 cards na landing e posts listados em `/blog` por língua; (d) screenshots por idioma para inspeção.

## Risks / Trade-offs

- [Largura w-24 apertar rótulo em futuras traduções] → texto maior que 96px quebraria/esticaria; mitigação: revisão no teste de largura (assert de igualdade) e checklist.
- [Dev server pré-existente com cache velho causar falsos negativos no e2e] → `reuseExistingServer` + instrução de rodar suite com servidor novo (ou CI sem reuse).
- [Screenshot por idioma divergir por fonte não carregada (FOIT)] → testes de medida aguardam `document.fonts.ready` antes de medir.
- [Remoção do efeito de entrada empobrecer a apresentação] → aceito: estabilidade na troca de idioma é o requisito; hero continua com composição forte.

## Migration Plan

1. `HomePage.astro` + `global.css`: remoção do sistema `hero-entrance`/`hero-in`.
2. `Header.astro`: links de nav com `w-24` centralizado.
3. `ui.ts`: `figCaption` do es normalizado.
4. Playwright: `npm i -D @playwright/test`, `npx playwright install chromium`, `playwright.config.ts` (webServer = `astro preview`), `e2e/locale-layout.spec.ts`, script `test:e2e` (build + playwright) em `package.json`, entradas no `.gitignore`.
5. OpenSpec: artifacts (proposal/spec/design/tasks) e validação `--strict`.
6. Verificação: `astro check`, build 15 páginas, assertions no dist (sem `hero-entrance`/`hero-in`; `w-24` nas 3 locales), `npm run test:e2e`, checklist visual por página × idioma, revisão de screenshots.