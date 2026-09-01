# Delta Spec: target-feedback

## ADDED Requirements

### Requirement: TargetSimbol como feedback auxiliar onde o TargetHover não atua
Os links mono uppercase fora do escopo permanente SHALL incluir um `TargetSimbol` auxiliar (`size=16`, classe `md:hidden`, posicionado após o label, `aria-hidden` herdado do componente) — visível somente onde o `TargetHover` (corners) não é anexado: mobile/touch (≤ 768px). O conjunto SHALL cobrir: Footer "Voltar ao topo", PostLayout "Voltar ao blog", share X e share Email do post, e as linhas de "Leia também". O simbol SHALL girar no `pointerdown` (tap) — comportamento existente de `target-simbol.ts`, sem JS novo. O email da seção de contato SHALL manter o simbol permanente (desktop+mobile) já existente, servindo de referência do padrão híbrido. O `TargetHover` SHALL permanecer inalterado.

#### Scenario: Visibilidade mobile-only
- **WHEN** a página é renderizada em viewport ≤ 768px
- **THEN** os links elencados exibem o simbol (16px) após o label; em viewport ≥ 768px o simbol está oculto (`display: none`) e o feedback é dado pelos corners do TargetHover

#### Scenario: Spin no tap
- **WHEN** o usuário toca o link "Voltar ao topo" (ou share) em mobile
- **THEN** o `data-spins` do wrapper do simbol incrementa e a mira executa o spin (~1s, 6 voltas), sem bloquear a navegação do link

#### Scenario: Reduced-motion estático
- **WHEN** `prefers-reduced-motion: reduce` está ativo
- **THEN** o simbol permanece estático (sem spin, sem observers), sem erro de console

#### Scenario: Email de contato inalterado
- **WHEN** a home é renderizada
- **THEN** o link de email mantém o simbol permanente atual (visível em desktop e mobile), sem duplicação de simbol
