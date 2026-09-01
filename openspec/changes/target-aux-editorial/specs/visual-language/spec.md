# Delta Spec: visual-language

## ADDED Requirements

### Requirement: Separador unificado em ponto médio
Todo separador visível entre termos SHALL ser o ponto médio `·` (U+00B7) renderizado pelo componente `Sep.astro` — `<span aria-hidden="true" class="select-none font-mono text-[0.8em] leading-none text-muted-foreground/60">·</span>` com `mx` ajustável via prop `class`. Contextos SHALL cobrir: chip eyebrow do Hero (`Eyebrow` com prop `label2` renderizando `{label} <Sep/> {label2}`), Trajetória (cargo·empresa), meta do post (data · tempo de leitura · atualização), mainStack do About (dados `profile.hero.mainStack` renderizados com split `' · '` intercalado por `Sep`, sem mudar a fonte de dados) e label `shareX` (`"X · Twitter"` em pt/es/en). Nenhum `/` visível SHALL permanecer nesses contextos. A chave `contactGridHint` permanece como dado i18n (não renderizada no DOM desde o redesign do contato).

#### Scenario: Meta do post com Sep consistente
- **WHEN** a página de post é renderizada em qualquer locale
- **THEN** a linha de metadados exibe `data · tempo de leitura (· atualização)` com spans `aria-hidden`/`select-none` do `Sep` na mesma cor/tamanho entre si

#### Scenario: Trajetória e eyebrow do Hero
- **WHEN** a home é renderizada
- **THEN** a linha da trajetória exibe `cargo · empresa` via `Sep` e o chip eyebrow exibe `{texto} · {ano}` via `label2`

#### Scenario: MainStack do About
- **WHEN** a seção Sobre é renderizada
- **THEN** a linha de stack principal intercala os termos com `Sep` (ponto médio), derivada de `split(' · ')` da mesma string de `profile.ts` (fonte única preservada)

#### Scenario: shareX
- **WHEN** qualquer locale é renderizado
- **THEN** o link de share exibe `X · Twitter` (string i18n padronizada)
