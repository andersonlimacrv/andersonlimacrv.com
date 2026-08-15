# plan-redesign.md

# Plano de Redesign — Anderson Carvalho Portfolio

> Transformar o website atual em uma implementação fiel ao wireframe de **Engineering Blueprint / Architectural Technical Drawing + Hand-Drawn Technical Sketch / Designer Annotation**, mantendo a arquitetura de conteúdo existente, priorizando performance, responsividade, semântica e uma base preparada para animações progressivas durante o scroll.

---

## 1. Objetivo

O objetivo deste redesign **não é criar um novo website**.

O objetivo é transformar o website atualmente implementado em Astro em uma representação web fiel ao wireframe produzido a partir da página atual.

A implementação deve preservar:

* estrutura atual;
* conteúdo atual;
* ordem das seções;
* fotografia principal;
* hierarquia tipográfica;
* quantidade de cards;
* links existentes;
* navegação;
* footer;
* proporções gerais;
* identidade visual já existente.

A nova camada visual deve introduzir:

1. uma estrutura de **Engineering Blueprint / Architectural Technical Drawing**;
2. uma camada independente de **Hand-Drawn Technical Sketch / Designer Annotation**;
3. grids e guias técnicas;
4. medidas dinâmicas;
5. marcações de layout;
6. referências técnicas;
7. anotações manuscritas;
8. preparação para animações acionadas pelo scroll.

A página final deve continuar parecendo um portfolio profissional, mas com a sensação de que seu layout está sendo analisado e refinado por um designer/engenheiro.

---

# 2. Referências obrigatórias

Existem duas referências principais.

## 2.1. Referência A — Website atual

A primeira imagem representa o estado atual do website.

Ela é a fonte de verdade para:

* conteúdo;
* textos;
* imagens;
* ordem;
* quantidade de elementos;
* links;
* estrutura;
* hierarquia;
* proporções;
* comportamento esperado;
* identidade visual existente.

Não substituir informações da página atual por textos inventados presentes no wireframe.

O wireframe possui algumas palavras e observações que são **anotações de projeto**, não conteúdo definitivo.

---

## 2.2. Referência B — Wireframe anotado

A segunda imagem representa a direção visual do redesign.

Ela é a fonte de verdade para:

* construção geométrica;
* grids;
* linhas;
* medidas;
* marcações;
* labels técnicos;
* hierarquia espacial;
* anotações manuscritas;
* elementos de revisão;
* sensação de projeto em desenvolvimento.

A referência B **não deve ser interpretada como uma nova página ou novo conteúdo**.

Ela é uma camada de art direction aplicada sobre a referência A.

---

# 3. Regra fundamental: conteúdo ≠ anotação

Esta é uma das regras mais importantes da implementação.

Existem dois sistemas visuais completamente diferentes.

## Sistema A — Conteúdo real

Representa o website.

Exemplos:

* Anderson Carvalho;
* descrição profissional;
* Sobre;
* Projetos;
* Blog;
* Contato;
* títulos dos posts;
* descrições;
* datas;
* links;
* footer;
* fotografia;
* navegação.

Esses elementos devem continuar sendo HTML semântico e acessível.

---

## Sistema B — Blueprint / Annotation

Representa a documentação visual do design.

Exemplos:

* `FIG. 01`;
* `GRID`;
* `HERO`;
* `SPACING`;
* `TYPE`;
* `MOVE`;
* `REDUZIR`;
* `ALIGN`;
* `KEEP`;
* `CHECK MOBILE`;
* setas;
* círculos;
* medidas;
* linhas;
* crosshairs;
* brackets;
* pequenos símbolos;
* observações manuscritas.

Esses elementos **não são conteúdo da página**.

Eles devem existir em uma camada visual própria.

Nunca misturar uma anotação diretamente no HTML responsável pelo conteúdo.

---

# 4. Arquitetura geral

Utilizar Astro como estrutura principal.

Não introduzir React, Vue, Svelte ou outro framework.

A arquitetura deve permanecer:

```text
Astro
├── HTML semântico
├── CSS
├── SVG
└── Vanilla JavaScript mínimo
```

A filosofia deve ser:

> HTML primeiro, CSS segundo, JavaScript somente quando realmente necessário.

---

# 5. Estrutura de diretórios recomendada

Organizar o projeto aproximadamente desta maneira:

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   └── Footer.astro
│   │
│   ├── sections/
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Projects.astro
│   │   ├── Blog.astro
│   │   └── Contact.astro
│   │
│   ├── blueprint/
│   │   ├── BlueprintOverlay.astro
│   │   ├── BlueprintGrid.astro
│   │   ├── BlueprintMeasure.astro
│   │   ├── BlueprintMarker.astro
│   │   └── BlueprintAnnotation.astro
│   │
│   └── ui/
│       └── ...
│
├── layouts/
│   └── Layout.astro
│
├── pages/
│   └── index.astro
│
├── data/
│   ├── projects.ts
│   └── posts.ts
│
├── scripts/
│   └── scroll-annotations.ts
│
├── styles/
│   ├── global.css
│   ├── blueprint.css
│   └── responsive.css
│
└── assets/
    └── images/
```

Não é necessário criar todos esses arquivos imediatamente.

A divisão deve acontecer de maneira incremental.

---

# 6. Ordem de implementação

Não tentar construir tudo de uma vez.

A implementação deve seguir estas etapas.

## Fase 01 — Auditoria

Antes de modificar o layout:

1. analisar o código atual;
2. identificar componentes existentes;
3. identificar estilos existentes;
4. identificar imagens;
5. identificar fontes;
6. identificar breakpoints;
7. identificar dados hardcoded;
8. identificar links;
9. identificar elementos reutilizáveis;
10. identificar quais estilos podem ser preservados.

Não apagar código funcional antes de compreender sua responsabilidade.

---

# 7. Fase 02 — Congelar o conteúdo

Antes do redesign visual, garantir que o conteúdo existente esteja separado da apresentação.

Exemplo:

```ts
const projects = [
  {
    title: "...",
    description: "...",
    href: "...",
    tags: [...]
  }
];
```

O mesmo princípio deve ser aplicado aos posts.

O redesign não deve exigir duplicação de conteúdo.

---

# 8. Fase 03 — Reconstruir a estrutura semântica

A página deve possuir uma estrutura semelhante a:

```html
<body>
  <header>
    ...
  </header>

  <main>
    <section id="hero">
      ...
    </section>

    <section id="sobre">
      ...
    </section>

    <section id="projetos">
      ...
    </section>

    <section id="blog">
      ...
    </section>

    <section id="contato">
      ...
    </section>
  </main>

  <footer>
    ...
  </footer>
</body>
```

A estrutura deve refletir a arquitetura real da página.

Não utilizar `<div>` para substituir elementos semanticamente apropriados quando houver uma alternativa melhor.

---

# 9. Fase 04 — Container principal

Criar um container global responsável pelo alinhamento do conteúdo.

Exemplo conceitual:

```css
:root {
  --content-max: 1440px;
  --page-gutter: clamp(1rem, 4vw, 4rem);
}

.container {
  width: min(
    calc(100% - (var(--page-gutter) * 2)),
    var(--content-max)
  );

  margin-inline: auto;
}
```

Não utilizar larguras fixas retiradas diretamente do screenshot.

O wireframe representa uma composição de referência.

O código deve transformar essas medidas em relações responsivas.

---

# 10. Medidas dinâmicas

As medidas do wireframe devem ser tratadas como **relações**, não como pixels absolutos.

Evitar:

```css
width: 760px;
margin-top: 120px;
font-size: 48px;
```

quando essas medidas representam apenas a composição desktop.

Preferir:

```css
font-size: clamp(2.5rem, 5vw, 5rem);
```

ou:

```css
padding-block: clamp(4rem, 10vw, 9rem);
```

ou:

```css
gap: clamp(1rem, 3vw, 2.5rem);
```

O objetivo é preservar a proporção visual do wireframe em diferentes tamanhos de viewport.

---

# 11. Sistema de espaçamento

Criar um sistema consistente.

Exemplo:

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;
}
```

Esses valores não devem ser aplicados mecanicamente.

Devem representar a lógica de espaçamento observada no wireframe.

---

# 12. Hero

O Hero é uma das regiões mais importantes.

Preservar:

* posição do título;
* fotografia;
* proporção da fotografia;
* descrição;
* metadata;
* composição lado a lado no desktop;
* relação entre texto e imagem.

A fotografia existente deve ser utilizada diretamente.

Não:

* recriar;
* redesenhar;
* alterar a pessoa;
* aplicar filtros diferentes;
* substituir a imagem.

A imagem deve continuar sendo um elemento real da página.

---

# 13. Hero responsivo

Desktop:

```text
┌───────────────────────────────┐
│             HERO              │
│                               │
│  TEXT              IMAGE      │
│                               │
└───────────────────────────────┘
```

Mobile:

```text
┌─────────────────┐
│      HERO       │
│                 │
│      TEXT       │
│                 │
│      IMAGE      │
│                 │
└─────────────────┘
```

Não tentar preservar a mesma coordenada absoluta do desktop.

Preservar:

* prioridade;
* hierarquia;
* proporção;
* espaçamento;
* leitura.

---

# 14. Sobre

Preservar a composição existente:

* identificador da seção;
* título;
* texto;
* pequena fotografia;
* links sociais;
* divisores;
* alinhamento editorial.

No desktop, utilizar grid.

No mobile, transformar a composição em fluxo vertical.

Não reduzir simplesmente todos os elementos proporcionalmente.

---

# 15. Projetos

Preservar exatamente a lógica de três cards apresentada atualmente.

Desktop:

```text
[ projeto ] [ projeto ] [ projeto ]
```

Tablet:

```text
[ projeto ] [ projeto ]
[ projeto ]
```

Mobile:

```text
[ projeto ]
[ projeto ]
[ projeto ]
```

Os cards devem manter:

* título;
* descrição;
* tags;
* link;
* hierarquia;
* bordas;
* espaçamento.

A anotação `3 colunas ✓` do wireframe deve ser tratada como **anotação**, não como conteúdo.

---

# 16. Blog

Preservar os posts atuais.

Desktop:

```text
[ post ] [ post ] [ post ]
```

Responsividade:

```text
desktop → 3 colunas
tablet  → 2 colunas
mobile  → 1 coluna
```

Preservar:

* data;
* título;
* descrição;
* tags;
* CTA;
* hierarquia tipográfica.

A anotação `cards mais compactos?` deve ser uma observação visual do designer.

Não deve aparecer como texto normal.

---

# 17. Contato

Manter a seção minimalista.

Não adicionar:

* formulário;
* newsletter;
* novos campos;
* novos CTAs;
* informações não existentes.

A intenção da seção atual deve permanecer intacta.

---

# 18. Footer

Preservar o footer atual.

Manter:

* copyright;
* navegação;
* voltar ao topo;
* alinhamento.

O wireframe pode adicionar marcações técnicas próximas ao footer, mas elas devem pertencer exclusivamente à camada de blueprint.

---

# 19. Sistema de Blueprint

Criar uma camada visual independente.

Conceitualmente:

```text
Website
│
├── conteúdo real
│
├── estrutura visual
│
└── blueprint overlay
    ├── grid
    ├── measurements
    ├── guides
    ├── markers
    └── annotations
```

A camada blueprint não deve controlar o layout real.

Ela apenas documenta visualmente o layout.

---

# 20. BlueprintOverlay

Criar um componente:

```astro
<BlueprintOverlay />
```

Sua responsabilidade é renderizar:

* linhas;
* grids;
* medidas;
* labels;
* marcadores;
* anotações;
* SVGs técnicos.

Não colocar conteúdo da página dentro desse componente.

---

# 21. Blueprint como SVG

Para elementos geométricos complexos, preferir SVG.

Exemplo:

```astro
<svg
  aria-hidden="true"
  class="blueprint-layer"
  viewBox="0 0 1000 1000"
>
  ...
</svg>
```

Usar SVG para:

* arrows;
* círculos;
* brackets;
* crosshairs;
* measurement lines;
* rough lines;
* technical markers.

Isso permite controle visual sem depender de dezenas de elementos HTML.

---

# 22. Linhas técnicas

As linhas do blueprint devem ser extremamente discretas.

Utilizar:

* linhas horizontais;
* linhas verticais;
* linhas de seção;
* guias de alinhamento;
* linhas pontilhadas;
* eixos;
* pequenas marcações.

As linhas nunca devem competir com o conteúdo.

---

# 23. Grid responsivo

O grid não pode possuir uma largura fixa.

Ele deve acompanhar o container real.

Conceito:

```css
.blueprint-grid {
  --grid-columns: 12;

  background-size:
    calc(100% / var(--grid-columns))
    100%;
}
```

Ou implementar o grid através de SVG com `viewBox` responsivo.

O importante é que:

> o grid visual corresponda ao grid real do website.

---

# 24. Relação entre layout e blueprint

O blueprint deve indicar relações reais.

Exemplo:

```text
conteúdo
│
├── container
├── coluna
├── gutter
├── section spacing
└── baseline
```

Não desenhar linhas aleatórias apenas para parecer técnico.

Cada marcação deve ter uma relação com algum elemento real.

---

# 25. Medidas

As medidas devem ser dinâmicas.

Não escrever:

```text
760px
```

como informação fixa se o valor muda com viewport.

O sistema pode utilizar valores derivados de CSS.

Exemplo:

```css
--section-gap: clamp(5rem, 10vw, 8rem);
```

E a anotação visual pode representar:

```text
SECTION GAP
dynamic
```

ou atualizar visualmente conforme necessário.

Quando uma medida for realmente fixa, ela pode ser documentada como fixa.

---

# 26. Anotações manuscritas

As anotações manuscritas são uma camada completamente diferente do conteúdo.

Exemplo:

```html
<div class="annotation">
  hierarquia ↑
</div>
```

A classe deve possuir estilo próprio.

Nunca utilizar a tipografia normal do website para simular uma anotação.

---

# 27. Tipografia das anotações

As anotações devem parecer feitas à mão.

Não utilizar:

* fonte normal;
* fonte monospace;
* heading;
* texto editorial.

Utilizar uma fonte manuscrita adequada ou asset vetorial quando necessário.

A aparência deve ser:

* irregular;
* humana;
* levemente imperfeita;
* espontânea;
* discreta.

Evitar aparência infantil.

---

# 28. Hierarquia visual entre os sistemas

A prioridade deve ser:

```text
1. conteúdo do website
2. estrutura/layout
3. blueprint técnico
4. anotações manuscritas
```

As anotações nunca podem prejudicar a leitura.

Se houver conflito entre conteúdo e anotação:

> o conteúdo sempre vence.

---

# 29. Anotações não devem ser acessíveis como conteúdo

Como são elementos puramente decorativos:

```html
aria-hidden="true"
```

quando apropriado.

Isso evita que um leitor de tela interprete:

```text
"reduzir?"
"keep image"
"move"
"good"
```

como conteúdo real do website.

---

# 30. Camadas de posicionamento

Utilizar uma arquitetura de camadas previsível:

```text
page
├── content
├── blueprint
└── annotations
```

Conceitualmente:

```css
.page {
  position: relative;
}

.content {
  position: relative;
  z-index: 2;
}

.blueprint-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.annotation-layer {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}
```

A camada visual nunca deve bloquear interação.

---

# 31. Posicionamento das anotações

Evitar coordenadas absolutas baseadas em pixels da imagem original.

Não fazer:

```css
top: 387px;
left: 142px;
```

para todos os elementos.

Preferir posicionamento relativo ao componente.

Exemplo:

```css
.annotation--hero-title {
  top: -1rem;
  left: 0;
}
```

ou ancoragem através de um wrapper:

```html
<div class="annotation-anchor">
  <h1>...</h1>
  <Annotation />
</div>
```

Isso permite que o conjunto continue funcionando em diferentes larguras.

---

# 32. Ancoragem local

Cada seção deve possuir seu próprio contexto visual.

Exemplo:

```text
Hero
└── hero-content
    ├── heading
    ├── image
    └── annotations

About
└── about-content
    ├── text
    ├── links
    └── annotations
```

Isso é preferível a um único SVG gigante com centenas de coordenadas absolutas.

---

# 33. Anotações futuras com scroll

As anotações devem ser implementadas desde o início pensando em animação futura.

Estado inicial:

```text
annotation:
opacity: 0
transform: translateY(8px) / scale(.98)
```

Estado visível:

```text
annotation:
opacity: 1
transform: none
```

A ideia é que as anotações apareçam gradualmente conforme o usuário chega à região correspondente.

---

# 34. Sequência de aparição

As anotações não devem aparecer todas simultaneamente.

Exemplo:

### Hero

1. grid;
2. measurement;
3. círculo do título;
4. seta;
5. `hierarquia ↑`;
6. `KEEP IMAGE`.

### Sobre

1. section marker;
2. measurement;
3. seta;
4. `alinhar`;
5. `reduzir?`.

### Projetos

1. grid;
2. bounding boxes;
3. `3 colunas ✓`;
4. medida de gutter;
5. pequena anotação.

### Blog

1. cards;
2. medida;
3. `cards mais compactos?`;
4. CTA annotation.

### Contato

1. section marker;
2. seta;
3. `link direto?`.

Isso deve criar a sensação de que alguém está revisando o projeto enquanto o usuário percorre a página.

---

# 35. Animação baseada em viewport

Priorizar:

```javascript
IntersectionObserver
```

em vez de listeners contínuos de scroll sempre que possível.

Exemplo conceitual:

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.15
  }
);
```

Isso é suficiente para a primeira versão das animações.

---

# 36. Animações futuras de scroll

A arquitetura deve permitir posteriormente:

* desenho progressivo de linhas;
* aparecimento de medidas;
* entrada de anotações;
* movimento sutil de setas;
* desenho de círculos;
* alteração de opacidade;
* pequenas correções visuais;
* sequência entre annotations.

Não implementar animações complexas antes de a estrutura estar correta.

Primeiro:

> estrutura → CSS → blueprint → annotations → viewport animation.

---

# 37. prefers-reduced-motion

Todas as animações devem respeitar:

```css
@media (prefers-reduced-motion: reduce) {
  .annotation,
  .blueprint-line {
    animation: none !important;
    transition: none !important;
  }
}
```

Para usuários que preferem reduzir movimento:

* mostrar as anotações diretamente;
* remover transições desnecessárias;
* preservar o layout.

---

# 38. Performance

Performance é requisito fundamental.

Evitar:

* framework JavaScript;
* bibliotecas de animação desnecessárias;
* listeners de scroll pesados;
* cálculos contínuos em cada frame;
* centenas de observers;
* SVGs gigantes;
* imagens duplicadas;
* efeitos de blur excessivos;
* DOM excessivamente profundo.

Preferir:

* Astro static rendering;
* CSS;
* SVG otimizado;
* IntersectionObserver;
* JavaScript mínimo;
* lazy loading quando apropriado;
* assets comprimidos;
* fontes carregadas de maneira eficiente.

---

# 39. JavaScript

JavaScript deve existir apenas para comportamentos que realmente exigem estado ou interação.

Exemplos aceitáveis:

* reveal de annotations;
* menu mobile;
* theme toggle existente;
* scroll-to-top;
* pequenas interações.

Não usar JavaScript para:

* layout;
* grid;
* espaçamento;
* posicionamento básico;
* responsividade;
* animações simples que CSS resolve.

---

# 40. CSS como principal ferramenta de layout

Utilizar:

* CSS Grid;
* Flexbox;
* clamp;
* min/max;
* container queries quando fizer sentido;
* CSS custom properties;
* media queries;
* logical properties.

Evitar:

```js
window.innerWidth
```

para definir layout.

Evitar:

```js
element.style.left = ...
```

para posicionamento estrutural.

---

# 41. Responsividade moderna

O website deve funcionar em:

```text
mobile pequeno
mobile
tablet
laptop
desktop
wide desktop
```

Não utilizar somente:

```text
768px
1024px
1280px
```

como regra absoluta.

Os breakpoints devem surgir quando a composição deixar de funcionar.

---

# 42. Container queries

Quando apropriado, utilizar container queries para componentes independentes.

Exemplo:

```css
.projects-grid {
  container-type: inline-size;
}

@container (max-width: 700px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
```

Isso torna os componentes mais reutilizáveis.

---

# 43. Mobile não é simplesmente desktop reduzido

No mobile:

* reduzir quantidade de linhas visuais;
* simplificar medidas;
* reduzir annotations;
* evitar sobreposição;
* reposicionar setas;
* transformar grids em fluxo vertical;
* manter legibilidade;
* preservar hierarquia.

O wireframe desktop é referência estrutural.

A versão mobile deve ser uma interpretação responsiva do mesmo sistema.

---

# 44. Blueprint responsivo

Nem todas as anotações do desktop precisam aparecer no mobile.

Definir níveis:

```text
DESKTOP
100% das annotations

TABLET
60–80%

MOBILE
30–50%
```

No mobile, priorizar:

* section labels;
* pequenos markers;
* algumas setas;
* poucas medidas;
* annotations mais importantes.

Isso evita transformar a página em uma camada visual poluída.

---

# 45. Estados responsivos das annotations

Cada annotation pode possuir:

```css
.annotation {
  --annotation-scale: 1;
}

@media (max-width: 768px) {
  .annotation {
    --annotation-scale: 0.8;
  }
}
```

Algumas annotations podem ser simplesmente ocultadas:

```css
.annotation--desktop-only {
  display: none;
}
```

O objetivo é preservar a sensação de projeto técnico sem sacrificar UX.

---

# 46. Dados fixos do wireframe

Elementos técnicos que realmente fazem parte da linguagem visual podem ser mantidos como dados estruturados.

Exemplo:

```ts
const blueprintLabels = [
  {
    id: "hero",
    label: "FIG. 01",
    section: "HERO"
  },
  {
    id: "about",
    label: "FIG. 02",
    section: "SOBRE"
  }
];
```

Isso permite manutenção sem espalhar strings pelo código.

---

# 47. Dados de annotations

As annotations também podem ser declaradas como dados:

```ts
const annotations = [
  {
    id: "hero-hierarchy",
    target: "hero-title",
    text: "hierarquia ↑",
    type: "handwritten",
    reveal: "on-enter"
  }
];
```

Porém, não transformar isso em um sistema excessivamente abstrato.

Se uma annotation possui geometria específica, um componente SVG dedicado pode ser melhor.

---

# 48. Não exagerar na abstração

Evitar criar um sistema genérico gigantesco para cinco seções.

A arquitetura deve ser simples.

Um bom princípio:

> abstrair padrões repetidos, não diferenças artificiais.

---

# 49. Section component

Cada seção deve possuir uma estrutura previsível:

```astro
<section class="section section--projects" id="projetos">
  <div class="container">
    ...
  </div>

  <BlueprintOverlay ... />
</section>
```

Isso facilita:

* responsividade;
* manutenção;
* animações;
* isolamento;
* debugging.

---

# 50. Blueprint labels

Os labels técnicos devem seguir a estética do wireframe.

Exemplos:

```text
FIG. 01
HERO

FIG. 02
SOBRE

FIG. 03
PROJETOS

FIG. 04
BLOG

FIG. 05
CONTATO
```

Esses labels são documentação visual.

Não são títulos alternativos das seções.

---

# 51. Medições visuais

As medições devem ser utilizadas com parcimônia.

Exemplos:

```text
SECTION GAP
GRID
COL
GUTTER
TYPE
BASELINE
```

As medidas devem reforçar a leitura de engenharia.

Não transformar cada padding em uma medição.

---

# 52. Elementos desenhados à mão

Utilizar principalmente:

* linhas;
* círculos;
* setas;
* sublinhados;
* pequenas estrelas;
* brackets;
* riscos;
* `x`;
* marcações de aprovação.

A irregularidade deve ser controlada.

O objetivo é:

> designer experiente revisando uma especificação.

Não:

> desenho livre.

---

# 53. Estados das annotations

Cada annotation pode possuir estados:

```text
hidden
visible
active
dismissed
```

Na primeira versão, implementar apenas:

```text
hidden → visible
```

Mas manter a arquitetura preparada para estados posteriores.

---

# 54. Scroll progressivo

Posteriormente, algumas annotations podem responder ao progresso do scroll.

Exemplo conceitual:

```text
0%    → invisível
25%   → linha começa
50%   → annotation aparece
75%   → seta termina
100%  → annotation totalmente visível
```

Não implementar isso através de dezenas de cálculos independentes.

Se necessário, utilizar uma única camada de controle de scroll e CSS variables.

---

# 55. CSS variables para animações futuras

Preparar:

```css
.section {
  --section-progress: 0;
}
```

E futuramente:

```css
.annotation {
  opacity: var(--annotation-opacity, 0);
  transform:
    translateY(calc((1 - var(--section-progress)) * 8px));
}
```

Isso permite evolução sem reescrever a arquitetura.

---

# 56. A página deve continuar funcionando sem JavaScript

O conteúdo principal precisa funcionar com JavaScript desabilitado.

Sem JavaScript:

* conteúdo aparece;
* navegação funciona;
* links funcionam;
* imagens funcionam;
* layout funciona;
* annotations podem permanecer visíveis ou ser omitidas.

JavaScript é enhancement, não requisito estrutural.

---

# 57. Acessibilidade

Garantir:

* headings em ordem;
* landmarks semânticos;
* links reais;
* `alt` correto nas imagens;
* foco visível;
* contraste adequado;
* navegação por teclado;
* `aria-hidden` nas annotations decorativas;
* reduced motion.

O blueprint nunca deve prejudicar acessibilidade.

---

# 58. Imagens

A imagem principal deve:

* permanecer a mesma;
* manter proporção;
* utilizar `width` e `height`;
* evitar layout shift;
* utilizar `loading` apropriado;
* possuir `alt` significativo quando for conteúdo;
* ser otimizada pelo pipeline do Astro quando possível.

Não aplicar alterações visuais que descaracterizem a fotografia.

---

# 59. Tipografia

Separar três funções:

### Tipografia editorial

Usada pelo website real.

Responsável por:

* headings;
* body;
* navigation;
* metadata;
* cards.

### Tipografia técnica

Usada para:

* FIG;
* GRID;
* REV;
* measurements;
* coordinates;
* specification labels.

### Tipografia manuscrita

Usada somente para:

* observações;
* correções;
* arrows labels;
* designer notes.

Essas três linguagens precisam ser visualmente distintas.

---

# 60. O wireframe não deve virar uma imagem

Não recriar a página simplesmente utilizando a imagem do wireframe como background.

Errado:

```html
<img src="wireframe.png">
```

A implementação precisa ser HTML/CSS/SVG real.

O resultado deve possuir:

* texto selecionável;
* links funcionais;
* layout responsivo;
* acessibilidade;
* SEO;
* performance.

---

# 61. O blueprint também não deve ser uma imagem única

Evitar utilizar a imagem inteira do blueprint como overlay.

O blueprint deve ser construído a partir de componentes.

Motivos:

* responsividade;
* animação;
* manutenção;
* performance;
* acessibilidade;
* controle individual das annotations.

---

# 62. Desktop como referência principal

A composição desktop deve ser reconstruída primeiro.

Ordem:

```text
1. container
2. header
3. hero
4. about
5. projects
6. blog
7. contact
8. footer
9. blueprint
10. annotations
11. animations
```

Somente depois otimizar mobile.

---

# 63. Validação visual

Após cada etapa, comparar a implementação com:

### Referência A

Perguntar:

* o conteúdo continua igual?
* a fotografia está correta?
* as seções continuam iguais?
* os cards continuam iguais?
* a hierarquia continua reconhecível?

### Referência B

Perguntar:

* o grid está correto?
* as linhas acompanham a estrutura?
* as annotations estão nas regiões corretas?
* a estética de engenharia está presente?
* o aspecto manuscrito está presente?

---

# 64. Critério de fidelidade

A página deve ser imediatamente reconhecível.

Um usuário deve conseguir olhar para:

```text
website atual
        ↓
wireframe
        ↓
implementação
```

e identificar a mesma página.

O redesign não deve criar uma interpretação completamente diferente.

---

# 65. Ordem das camadas visuais

A composição final deve seguir aproximadamente:

```text
BACKGROUND
    ↓
SECTION STRUCTURE
    ↓
CONTENT
    ↓
BLUEPRINT GRID
    ↓
TECHNICAL MARKERS
    ↓
HANDWRITTEN ANNOTATIONS
    ↓
INTERACTION / MOTION
```

A camada manuscrita é a última camada visual.

---

# 66. Annotations como "estado de revisão"

A intenção estética é que o usuário perceba:

> "Este layout está sendo analisado."

Não:

> "Este website possui vários rabiscos decorativos."

Portanto, cada annotation deve parecer ter uma função.

Exemplos:

```text
hierarquia ↑
```

indica análise de hierarquia.

```text
reduzir?
```

indica possível ajuste.

```text
3 colunas ✓
```

indica decisão validada.

```text
check mobile
```

indica preocupação responsiva.

```text
KEEP IMAGE
```

indica preservação de elemento importante.

---

# 67. Annotations devem aparecer durante o scroll

O comportamento desejado é:

```text
usuário entra na página
        ↓
estrutura aparece
        ↓
hero entra em foco
        ↓
annotations do hero aparecem
        ↓
usuário continua
        ↓
annotations do Sobre aparecem
        ↓
Projetos
        ↓
Blog
        ↓
Contato
```

Isso transforma o scroll em uma espécie de revisão progressiva do projeto.

---

# 68. Não animar tudo

Alguns elementos devem permanecer estáticos.

Estáticos:

* conteúdo;
* headings;
* cards;
* fotografia;
* layout;
* grid principal.

Animados:

* algumas annotations;
* linhas secundárias;
* medidas;
* setas;
* pequenos markers.

A animação deve ser uma camada editorial.

---

# 69. Performance das animações

Priorizar propriedades aceleradas:

```css
transform
opacity
```

Evitar animar continuamente:

```css
width
height
top
left
margin
padding
```

quando não for necessário.

---

# 70. SVG eficiente

SVGs devem ser:

* pequenos;
* otimizados;
* sem metadata desnecessária;
* sem paths gigantes;
* reutilizáveis quando possível.

Para desenhos repetidos, utilizar `<symbol>` e `<use>` quando trouxer benefício real.

---

# 71. Evitar excesso de DOM

Uma annotation simples não deve exigir:

```text
div
  div
    span
      svg
        path
```

se um único SVG ou elemento for suficiente.

A estética de blueprint deve parecer complexa visualmente, não estruturalmente.

---

# 72. Header

O header deve manter sua estrutura atual.

Adicionar apenas:

* guias;
* pequenos markers;
* eventualmente uma annotation discreta.

Não transformar o header em uma HUD.

---

# 73. Navegação

A navegação continua sendo navegação real.

Não converter:

```text
SOBRE
BLOG
PROJETOS
CONTATO
```

em elementos puramente gráficos.

As annotations podem apontar para a navegação, mas não substituí-la.

---

# 74. Mobile navigation

Se o projeto atual já possui comportamento mobile, preservá-lo.

Se não possuir, implementar uma solução mínima e acessível.

Não adicionar um sistema complexo de menu apenas por causa do redesign.

---

# 75. Footer e blueprint

O footer pode possuir:

* baseline grid;
* marker;
* pequeno `REV`;
* uma annotation discreta.

Evitar excesso de desenhos na região inferior.

O footer deve continuar funcionando como encerramento visual.

---

# 76. SEO

O redesign não deve prejudicar SEO.

Manter:

* `<title>`;
* meta description;
* headings;
* links;
* semântica;
* Open Graph;
* URLs atuais.

Annotations não devem entrar no conteúdo SEO.

---

# 77. Checklist de implementação

* [ ] Auditar o código atual.
* [ ] Identificar todos os componentes existentes.
* [ ] Preservar conteúdo atual.
* [ ] Preservar fotografia principal.
* [ ] Separar dados de apresentação.
* [ ] Reconstruir container responsivo.
* [ ] Reconstruir header.
* [ ] Reconstruir hero.
* [ ] Reconstruir Sobre.
* [ ] Reconstruir Projetos.
* [ ] Reconstruir Blog.
* [ ] Reconstruir Contato.
* [ ] Reconstruir Footer.
* [ ] Validar desktop.
* [ ] Validar tablet.
* [ ] Validar mobile.
* [ ] Criar blueprint grid.
* [ ] Criar section markers.
* [ ] Criar measurements.
* [ ] Criar technical labels.
* [ ] Criar annotation layer.
* [ ] Separar annotations do conteúdo.
* [ ] Criar estados hidden/visible.
* [ ] Implementar IntersectionObserver.
* [ ] Adicionar reveals progressivos.
* [ ] Implementar reduced motion.
* [ ] Otimizar SVG.
* [ ] Otimizar imagens.
* [ ] Revisar JavaScript.
* [ ] Revisar acessibilidade.
* [ ] Revisar performance.
* [ ] Fazer comparação visual final.

---

# 78. Critérios de aceite

O redesign estará pronto quando:

### Estrutura

* a página continuar sendo a mesma;
* nenhuma seção original for perdida;
* nenhuma nova seção for inventada;
* o conteúdo atual permanecer correto.

### Visual

* o layout possuir linguagem de engineering blueprint;
* existir uma camada clara de desenho técnico;
* existir uma camada clara de anotações manuscritas;
* o resultado parecer um documento em revisão;
* a composição continuar minimalista.

### Responsividade

* desktop reproduzir a referência;
* tablet adaptar os grids;
* mobile reorganizar corretamente;
* annotations não prejudicarem a leitura.

### Código

* Astro continuar sendo o framework principal;
* nenhum framework de UI adicional ser necessário;
* JavaScript permanecer mínimo;
* CSS controlar o layout;
* SVG controlar desenhos técnicos;
* conteúdo permanecer semanticamente estruturado.

### Performance

* evitar bibliotecas desnecessárias;
* evitar listeners pesados;
* evitar animações de layout;
* utilizar IntersectionObserver;
* utilizar `transform` e `opacity`;
* respeitar reduced motion;
* manter JavaScript como progressive enhancement.

---

# 79. Resultado esperado

O resultado final deve parecer uma evolução natural do website atual:

```text
WEBSITE ATUAL
      ↓
estrutura preservada
      ↓
layout responsivo refinado
      ↓
engineering blueprint
      ↓
technical drawing
      ↓
designer annotations
      ↓
scroll-driven review
```

A sensação final deve ser:

> um portfolio profissional real que foi transformado em uma especificação arquitetônica viva, onde o grid representa a precisão da engenharia e as anotações manuscritas representam o processo humano de revisão.

O website deve continuar sendo **um website primeiro**.

O blueprint e os desenhos à mão são uma camada narrativa e visual sobre ele.

---

# 80. Regra final

Sempre que houver dúvida entre:

**fidelidade ao website atual**

e

**fidelidade a uma anotação do wireframe**,

a prioridade é:

```text
1. conteúdo real
2. estrutura real
3. responsividade
4. acessibilidade
5. performance
6. blueprint
7. annotations
8. animação
```

O wireframe deve orientar a implementação, não substituir o produto.

A animação deve revelar o processo de design.

As annotations devem parecer feitas por alguém revisando o projeto.

As medidas devem representar relações reais e responsivas.

O código deve permanecer simples.

O resultado deve ser tecnicamente sólido, semanticamente correto, performático e visualmente fiel à combinação de:

**Engineering Blueprint / Architectural Technical Drawing**

*

**Hand-Drawn Technical Sketch / Designer Annotation**

sem transformar o website em uma imagem estática ou em um mockup.
