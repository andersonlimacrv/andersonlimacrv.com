## 1. Fundação (concluída)

- [x] 1.1 Instalar `@fontsource-variable/caveat` (removido depois — não usado)
- [x] 1.2 Criar `src/data/projects.ts` (3 projetos tipados, fonte única) — mantido
- [x] 1.3 Reorganizar componentes: `layout/`, `sections/`, `ui/`, `blueprint/` (reservada), `pages/` — mantido
- [x] 1.4 Extrair seções da HomePage para `components/sections/` preservando conteúdo/ordem/links — mantido
- [x] 1.5 Criar `src/components/handwrite/` (reservada) para itens desenhados à mão — mantido

## 2. Reversão da camada blueprint (concluída)

- [x] 2.1 Remover os 6 componentes `Blueprint*` e `src/data/blueprint.ts`
- [x] 2.2 Remover overlays blueprint das seções (Hero, About, Projects, Blog, Contact) e do Footer
- [x] 2.3 Remover `e2e/blueprint.spec.ts`
- [x] 2.4 Reverter `global.css` a HEAD: sem `.blueprint-*`/`.annotation`/`.bp-*`, sem tokens `--space-*`/`--content-max`/`--page-gutter`/`--font-hand`, sem Caveat, `.container-site` original
- [x] 2.5 Desinstalar `@fontsource-variable/caveat`

## 3. Validação (concluída)

- [x] 3.1 `npm run check` → 0 erros
- [x] 3.2 `npm run test:e2e` → 36/36 (suites originais)
- [x] 3.3 `node scripts/audit.mjs` → fontes 161.9 KB, gzip 394.3 KB (sem payload novo)

## 4. Próximas partes (postergadas — fora desta change)

- [ ] 4.1 Receber assets manuscritos em `src/components/handwrite/` e definir consumo
- [ ] 4.2 Reconstruir a camada visual de blueprint/annotation incrementalmente a partir de `handwrite/`
- [ ] 4.3 Animações de scroll (estrutura preparada em fases futuras)