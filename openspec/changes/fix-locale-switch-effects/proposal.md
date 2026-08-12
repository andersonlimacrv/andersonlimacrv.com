# Change: fix-locale-switch-effects

## What

Ao trocar o idioma (View Transitions + select nativo), o site apresentava dois problemas de estabilidade:

1. **Efeitos de entrada re-executavam**: o hero (eyebrow, nome, subtítulo e imagem) usava `hero-entrance` (`@keyframes hero-in`) que re-animava a cada navegação — flash de fade/slide na imagem e nos textos a cada troca de idioma.
2. **Header mudava de largura por idioma**: os links de navegação tinham largura automática ("Projetos" vs "Proyectos" vs "Projects"), fazendo a pílula do header encolher/crescer conforme o idioma e causando salto de layout na troca.

## Why

Estabilidade visual é parte do design editorial do site: navegação entre idiomas deve ser a troca de conteúdo, sem animações repetidas e sem mudança de medidas de componentes estruturantes (header). Também adiciona verificação automatizada (Playwright) para que qualquer regressão visual por idioma seja detectada.

## How

- Remover por completo o sistema `hero-entrance`/`@keyframes hero-in` (HTML + CSS), deixando o hero estático.
- Fixar a largura dos links de nav (`w-24`, 96px, centralizado) para que a pílula tenha largura idêntica nas 3 línguas.
- Normalizar a legenda da foto em es (`figCaption`) para a mesma string das demais línguas.
- Adicionar Playwright (dev) com testes e2e que medem a largura da pílula e dos links nas 3 línguas, verificam a ausência de animação no hero (inclusive após troca de idioma pelo select) e conferem o conteúdo do blog em pt/es/en.
- Registrar verificação estrutural no build (dist sem `hero-entrance`/`hero-in`; `w-24` nas locales) e checklist visual por página × idioma.

## Areas

- `src/components/pages/HomePage.astro`
- `src/styles/global.css`
- `src/components/Header.astro`
- `src/i18n/ui.ts`
- `playwright.config.ts`, `e2e/`, `package.json`, `.gitignore`