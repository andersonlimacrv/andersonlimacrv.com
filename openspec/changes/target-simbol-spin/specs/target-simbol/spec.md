# Delta Spec: target-simbol

## ADDED Requirements

### Requirement: Mira decorativa com spin roleta
O componente TargetSimbol SHALL renderizar o símbolo da mira (SVG inline: anel com 4 traços cardeais + ponto central) em ~48px, sempre visível, e girar ~3 voltas em ~1s com easing `--ease-expo-out` (começa rápido e desacelera até parar) quando: (a) entra na viewport — e a cada re-entrada; (b) `pointerenter`; (c) `pointerdown`. Re-triggers SHALL ser ignorados enquanto um spin está em andamento. A animação SHALL usar transform via Web Animations API (compositor), sem rAF manual.

#### Scenario: Spin na entrada e re-entrada da viewport
- **WHEN** a página carrega com a mira abaixo da dobra e o usuário rola até ela
- **THEN** `data-spins` no wrapper incrementa; rolando para longe e voltando, `data-spins` incrementa novamente

#### Scenario: Hover e click
- **WHEN** o ponteiro entra no wrapper ou o usuário clica/toca nele (após o spin anterior terminar)
- **THEN** `data-spins` incrementa a cada trigger

#### Scenario: Re-trigger durante o spin
- **WHEN** dois triggers ocorrem com menos de 1s de intervalo
- **THEN** apenas o primeiro inicia spin (`data-spins` +1); após a animação terminar, novos triggers voltam a incrementar

### Requirement: Reduced-motion e acessibilidade
Com `prefers-reduced-motion: reduce` o componente SHALL permanecer estático: nenhuma animação, nenhum observer/listener ativo e `data-spins` SEMPRE 0. O símbolo SHALL ser decorativo (`aria-hidden="true"`, sem foco).

#### Scenario: Reduced-motion estático
- **WHEN** o usuário navega com `prefers-reduced-motion: reduce`, rola até a mira e clica nela
- **THEN** `data-spins` permanece 0 e não há animação

### Requirement: Tema-aware
As cores SHALL vir dos tokens do site: anel/traços em `foreground` com transparência (color-mix 55%) e ponto central em `--primary` — adaptando automaticamente a claro/escuro (os fills fixos #fff/#CCC do SVG original não SHALL ser usados).

#### Scenario: Cores computadas
- **WHEN** a página carrega em tema claro ou escuro
- **THEN** o `fill` computado do ponto equivale ao `--primary` resolvido e o do anel difere de `none` e do primary (tinta foreground translúcida)

### Requirement: Integração na seção contato
O `Contact.astro` SHALL exibir a mira no canto inferior direito do box do KineticGrid (`absolute bottom-3 right-4`, ~48px, `opacity-60 hover:opacity-100`), dentro do `#contato`, complementar aos corners do TargetHover (que permanecem).

#### Scenario: Mira dentro do box
- **WHEN** a home renderiza em qualquer locale e viewport
- **THEN** existe `[data-target-simbol]` com bounding box ~48×48px contido no box `[data-kinetic-grid]`, visível sem interação prévia