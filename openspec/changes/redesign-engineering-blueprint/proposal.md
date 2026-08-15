## Why

Preparar o código para o redesign em camadas, trabalhando **uma parte por vez**. A primeira tentativa (camada blueprint via SVG/CSS + anotações manuscritas com fonte Caveat) ficou visualmente ruim e foi descartada. Esta change consolida apenas a fundação: estrutura de pastas nova, dados extraídos e a pasta `handwrite/` onde os elementos desenhados à mão serão colocados — tudo o mais é revertido ao estado anterior.

## What Changes

- **Reorganização de componentes** (mantida): `components/layout/` (Header, Footer), `components/sections/` (Hero, About, Projects, Blog, Contact), `components/ui/` (10 componentes + 5 scripts), `components/blueprint/` (vazia, reservada) e `components/pages/` (HomePage como composition root).
- **Dados**: `src/data/projects.ts` como fonte única dos 3 projetos (urls/tags/títulos), descrições vindas do dicionário i18n.
- **Pasta `src/components/handwrite/`**: criada para receber os itens desenhados à mão (SVGs/assets) que o usuário fornecerá nas próximas etapas.
- **Reversão total da camada blueprint**: removidos os 6 componentes `Blueprint*`, o `data/blueprint.ts`, o spec e2e `blueprint.spec.ts`, o `@font-face` do Caveat (pacote desinstalado), todos os estilos `.blueprint-*`/`.annotation`/`.bp-*`, os tokens `--space-*`/`--content-max`/`--page-gutter`/`--font-hand` e a mudança do `.container-site` — tudo restaurado ao estado anterior via HEAD.

## Capabilities

### New Capabilities
_(nenhuma nesta change — reestruturação de código sem mudança de comportamento observável)_

### Modified Capabilities
_(nenhuma)_

## Impact

- **Estrutura**: `src/components/*` reorganizado (novo), `src/components/handwrite/` (novo), `src/data/projects.ts` (novo).
- **Código revertido**: `global.css`, `SectionHeading`, `Footer`, seções sem overlay blueprint.
- **Fora do escopo (Non-goals)**: camada blueprint/annotation (postergada — será reconstruída de forma incremental com assets manuais em `handwrite/`); nenhuma animação; nenhum conteúdo novo; fotografia intocada.
- **Verificação**: `astro check` 0 erros, build OK, e2e 36/36, audit sem payload novo (fontes 161.9 KB, gzip < baseline).