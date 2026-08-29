// Reveal — transição de entrada das seções (vanilla, cf. elastic-line.ts).
//
// Progressive enhancement: o conteúdo nasce visível no HTML; quando o JS roda,
// `reveal-present` é adicionado ao <html> e os [data-reveal] abaixo da dobra
// ficam ocultos até o IntersectionObserver adicionar `is-visible`.
//
// POR QUE ESTE MÓDULO EXISTE (e não um <script> solto no componente):
// com View Transitions (ClientRouter), o Astro restaura os atributos do <html>
// a partir do HTML estático da página seguinte — o que apaga `reveal-present`,
// `theme-applied` etc. — e os módulos já carregados NÃO re-executam (cache de
// módulo do browser). O componente antigo perdia o reveal após a 1ª navegação.
// Aqui o init roda em astro:page-load / astro:after-swap, re-arma a classe e
// observa os elementos novos (dedupe por WeakSet).

let io: IntersectionObserver | null = null;
const observed = new WeakSet<Element>();

function init() {
  const root = document.documentElement;
  // Reaplica após navegação (o swap limpa os atributos do <html>).
  if (!root.classList.contains('reveal-present')) {
    root.classList.add('reveal-present');
  }

  const reduced =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const els = document.querySelectorAll('[data-reveal]');

  if (reduced) {
    els.forEach((el) => {
      el.classList.add('is-visible');
      observed.add(el);
    });
    return;
  }

  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            requestAnimationFrame(() => el.classList.add('is-visible'));
            io?.unobserve(el);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
  }

  els.forEach((el) => {
    if (observed.has(el)) return;
    observed.add(el);
    io!.observe(el);
  });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
init();

// Marca o arquivo como módulo ES (evita colisão no escopo global do tsc com
// outros scripts sem import/export, ex.: elastic-line.ts).
export {};