# Delta Spec: navigation

## ADDED Requirements

### Requirement: Nav espelha a ordem das seções numeradas
Os links do nav do header SHALL seguir a mesma ordem das seções numeradas da home: `Sobre (01) → Projetos (02) → Blog (03) → Contato (04)` — âncoras `#sobre, #projetos, #blog, #contato`, localizados em pt/es/en. A ordem SHALL ser idêntica nos 3 idiomas e SHALL coincidir com a ordem vertical de `HomePage` (Hero, Sobre, Projetos, Blog, Contato).

#### Scenario: Ordem alinhada com as seções
- **WHEN** qualquer página é renderizada em qualquer locale
- **THEN** o nav contém 4 links, nesta ordem: Sobre, Projetos, Blog, Contato (labels localizados, hrefs `/{locale?}/#sobre`, `#projetos`, `#blog`, `#contato`)

#### Scenario: Estabilidade entre idiomas preservada
- **WHEN** as larguras de pílula e links são comparadas entre pt/es/en
- **THEN** o teste existente de `locale-layout.spec.ts` continua válido (mesmos 4 links em ordem uniforme)
