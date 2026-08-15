## Why

O site tem boa fundação de tokens (`design-tokens`), movimento (`motion-transitions`) e um novo divisor elástico (`elastic-line-divider`), mas **não existe um léxico visual unificado**: hovers, linhas, marcadores e divisores foram decididos caso a caso. Os marcadores de seção atuais (`01` em mono + h2) destoam — o usuário quer um design de **linhas retas com formatos uniformes**. Este change define a identidade visual de "linhas" do site (regras normativas) e aplica o redesign dos marcadores de seção como primeiro caso de uso.

## What Changes

- Define o **léxico de linhas**: qualquer linha/divisor/hover usa traço 1px, cor dos tokens existentes (`--border`, `--muted-foreground`, `--primary`), tracking mono 0.16–0.3em — sem novas cores nem pesos.
- Redesign do **`SectionHeading`**: marcador de seção com linha reta horizontal conectando número → título (ex.: `01 ──── Sobre`), mesma estrutura nas 4 seções (sobre/projetos/blog/contato) e nos 3 idiomas.
- Alinha **hovers** ao léxico: mantém micro-interações `motion-transitions` (transform/opacity 150–250ms), sem exceções novas.
- Harmoniza o divisor elástico (`elastic-line-divider`) com a gramática de linhas para futura aplicação (task aberta lá).

## Capabilities

### New Capabilities
- `visual-identity-lines`: Léxico normativo de linhas do site (traço 1px, tokens existentes, tracking mono) aplicável a marcadores de seção, divisores e hovers, garantindo formatos uniformes e consistência entre componentes.

## Impact

- `SectionHeading.astro` redesenhado (4 seções × 3 idiomas) — mudança visual localizada no cabeçalho de seção.
- Regras documentadas em spec para componentes futuros (hover/linhas) seguirem a mesma gramática.
- Sem impacto em build/SEO/RSS; zero JS novo.