# Delta Spec: layout-rhythm

## ADDED Requirements

### Requirement: Ritmo vertical padronizado
O layout SHALL padronizar distâncias entre conteúdo e divisórias horizontais: (a) seções com heading (`About`, `Projects`, `Blog`, `Contact`) usam `scroll-mt-24 py-16 sm:py-20` no wrapper da seção e slot do `SectionHeading` com `mt-8` entre heading (KineticGrid) e conteúdo; (b) blocos internos do About usam `py-6 sm:py-8` de forma uniforme; (c) divisórias `ElasticLine h-16` do `HomePage` mantêm altura uniforme.

#### Scenario: Distância heading↔conteúdo é mt-8
- **WHEN** qualquer seção numerada é renderizada
- **THEN** a distância entre o box do `KineticGrid` e o primeiro elemento do conteúdo é `mt-8` (32px)

#### Scenario: Blocos do About uniformes
- **WHEN** a seção Sobre é renderizada
- **THEN** cada bloco (Perfil, Trajetória) tem padding vertical `py-6 sm:py-8` (sem bloco com `py-4`)

#### Scenario: Divisórias horizontais uniformes
- **WHEN** a home é renderizada
- **THEN** cada `ElasticLine` horizontal entre seções tem `h-16` e as seções têm `py-16 sm:py-20`, mantendo ritmo constante
