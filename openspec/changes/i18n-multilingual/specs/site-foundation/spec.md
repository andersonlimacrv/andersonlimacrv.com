## MODIFIED Requirements

### Requirement: Projeto Astro configurado e buildável
O projeto SHALL ser um site Astro (SSG, zero JS por padrão) com TypeScript, cujo `npm run build` produz um diretório `dist/` estático sem erros, com multi-idioma configurado (`i18n` com locales `pt`, `es`, `en`; default `pt`; prefixo apenas para idiomas não-default).

#### Scenario: Build de produção
- **WHEN** o usuário executa `npm run build` em um projeto recém-clonado após `npm install`
- **THEN** o build conclui com sucesso e gera o diretório `dist/` com HTML estático de todas as rotas localizadas

#### Scenario: Dev server local
- **WHEN** o usuário executa `npm run dev`
- **THEN** um servidor local serve o site em localhost com hot reload e o layout base renderiza

#### Scenario: Rotas localizadas
- **WHEN** o build é inspecionado
- **THEN** existem por baixo de `dist/` as rotas `/`, `/es/`, `/en/` (e suas variantes de blog); `/es/`/`/en/` com prefixo correto

### Requirement: Layout base com navegação
O layout `BaseLayout` SHALL fornecer `<head>` completo, skip-link para o conteúdo principal e estruturas `<header>`/`<main>`/`<footer>` semânticas reutilizáveis por todas as páginas, com `lang` e `dir` vindo do locale atual.

#### Scenario: Layout reutilizado
- **WHEN** qualquer página usa o `BaseLayout`
- **THEN** o HTML resultante contém um único `<h1>`, skip-link apontando para o main, e landmarks `<header>`, `<main>`, `<footer>` com `lang` do locale

#### Scenario: lang do locale no documento
- **WHEN** `/en/` usa o `BaseLayout`
- **THEN** `<html lang="en">` é emitido