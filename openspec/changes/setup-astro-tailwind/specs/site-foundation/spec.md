## Purpose

Fundação técnica do site: scaffold Astro SSG com Tailwind, fontes self-hosted e layouts base que sustentam todas as demais capabilities do site pessoal.

## ADDED Requirements

### Requirement: Projeto Astro configurado e buildável
O projeto SHALL ser um site Astro (SSG, zero JS por padrão) com TypeScript, cujo `npm run build` produz um diretório `dist/` estático sem erros.

#### Scenario: Build de produção
- **WHEN** o usuário executa `npm run build` em um projeto recém-clonado após `npm install`
- **THEN** o build conclui com sucesso e gera o diretório `dist/` com HTML estático

#### Scenario: Dev server local
- **WHEN** o usuário executa `npm run dev`
- **THEN** um servidor local serve o site em localhost com hot reload e o layout base renderiza

### Requirement: Tailwind CSS v4 integrado
O site SHALL usar Tailwind CSS v4 configurado via CSS (plugin Vite), com purga de CSS não utilizado no build.

#### Scenario: Utilitários Tailwind no build
- **WHEN** o projeto é compilado para produção
- **THEN** apenas as classes Tailwind efetivamente usadas aparecem no CSS final

### Requirement: Estrutura de pastas padronizada
O projeto SHALL conter a estrutura `src/components`, `src/content`, `src/layouts`, `src/pages`, `src/styles` e `public` com arquivos iniciais coerentes.

#### Scenario: Estrutura verificável
- **WHEN** se inspeciona o repositório após o change
- **THEN** os diretórios `src/components`, `src/content`, `src/layouts`, `src/pages`, `src/styles` e `public` existem com os arquivos base

### Requirement: Fontes variáveis self-hosted
O site SHALL carregar Manrope, JetBrains Mono e Fraunces a partir de arquivos locais (via @fontsource), nunca do Google Fonts CDN, com `font-display: swap`.

#### Scenario: Nenhuma requisição externa de fonte
- **WHEN** o HTML de produção é inspecionado
- **THEN** nenhum `link` ou `@import` aponta para um CDN de fontes (ex.: fonts.googleapis.com)

### Requirement: Layout base com navegação
O layout `BaseLayout` SHALL fornecer `<head>` completo, skip-link para o conteúdo principal e estruturas `<header>`/`<main>`/`<footer>` semânticas reutilizáveis por todas as páginas.

#### Scenario: Layout reutilizado
- **WHEN** qualquer página usa o `BaseLayout`
- **THEN** o HTML resultante contém um único `<h1>`, skip-link apontando para o main, e landmarks `<header>`, `<main>`, `<footer>`
