// TextScramble — port do experimento em references/text-scramble para TS
// vanilla nos moldes do projeto (cf. reveal.ts, target-simbol.ts).
//
// Uso:
//   <TextScramble text="Engenheiro de Software" variant="label" />
//   <TextScramble text="..." onHover /> (também re-anima no hover)
//   <TextScramble text="..." onEntry={false} onHover /> (só no hover)
//
// Comportamento:
//   - SSR entrega o texto final legível (progressive enhancement; sem JS
//     nada muda — o conteúdo nasce pronto no HTML).
//   - Com JS: anima UMA vez ao entrar na viewport (IntersectionObserver,
//     threshold 0.5; re-entrada re-anima) — só se onEntry (default true).
//     Re-anima em pointerenter / pointerdown (hover no desktop, tap no
//     mobile — cf. target-simbol) — só se onHover (default false).
//   - Frase única: anima e para (sem loop — diferente da referência, que
//     cicla `phrases[]` com setTimeout).
//   - prefers-reduced-motion: nunca anima, mantém o texto final.
//   - Re-triggers durante a animação são ignorados (flag `running`).
//   - Caracteres temporários ("dud") usam a classe .scramble-dud, com estilo
//     no <style> do .astro (cor via currentColor — sem hardcode).
//
// Debug hook p/ e2e: data-scrambled="true" quando a animação conclui.

interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';
const BASE_FRAMES = 40; // mesma janela aleatória da referência (0–40)
const DUD_REDRAW_CHANCE = 0.28; // mesma taxa da referência

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

class Scrambler {
  private el: HTMLElement;
  private chars: string;
  private speed: number;
  private queue: QueueItem[] = [];
  private frame = 0;
  private frameRequest = 0;
  private resolve: (() => void) | null = null;
  running = false;

  constructor(el: HTMLElement, chars: string, speed: number) {
    this.el = el;
    this.chars = chars.length > 0 ? chars : DEFAULT_CHARS;
    this.speed = Number.isFinite(speed) && speed > 0 ? speed : 1;
  }

  setText(newText: string): Promise<void> {
    const promise = new Promise<void>((resolve) => {
      this.resolve = resolve;
    });
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const jitter = Math.max(1, Math.round(BASE_FRAMES / this.speed));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] ?? '';
      const to = newText[i] ?? '';
      const start = Math.floor(Math.random() * jitter);
      const end = start + Math.floor(Math.random() * jitter);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.running = true;
    this.el.removeAttribute('data-scrambled');
    this.update();
    return promise;
  }

  private update = (): void => {
    let output = '';
    let complete = 0;
    for (const item of this.queue) {
      if (this.frame >= item.end) {
        complete++;
        output += escapeHtml(item.to);
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < DUD_REDRAW_CHANCE) {
          item.char = this.randomChar();
        }
        output += `<span class="scramble-dud">${item.char}</span>`;
      } else {
        output += escapeHtml(item.from);
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.running = false;
      this.el.dataset.scrambled = 'true';
      this.resolve?.();
      this.resolve = null;
    } else {
      this.frame++;
      this.frameRequest = requestAnimationFrame(this.update);
    }
  };

  private randomChar(): string {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const instances = new WeakMap<HTMLElement, Scrambler>();
const bound = new WeakSet<HTMLElement>();
let io: IntersectionObserver | null = null;

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function play(el: HTMLElement): void {
  if (reducedMotion()) return;
  const fx = instances.get(el);
  if (!fx || fx.running) return;
  void fx.setText(el.dataset.text ?? el.innerText);
}

function bind(el: HTMLElement): void {
  const chars = el.dataset.chars || DEFAULT_CHARS;
  const speed = Number.parseFloat(el.dataset.speed ?? '1');
  const onHover = el.dataset.onHover === 'true';
  const onEntry = el.dataset.onEntry !== 'false';
  instances.set(el, new Scrambler(el, chars, speed));
  if (onHover) {
    el.addEventListener('pointerenter', () => play(el));
    el.addEventListener('pointerdown', () => play(el));
  }
  if (onEntry) io?.observe(el);
}

function init(): void {
  // Sem observer/eventos em reduced-motion: o texto final do SSR permanece.
  if (reducedMotion()) return;
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) play(entry.target as HTMLElement);
        }
      },
      { threshold: 0.5 },
    );
  }
  document.querySelectorAll<HTMLElement>('[data-text-scramble]').forEach((el) => {
    if (bound.has(el)) return;
    bound.add(el);
    bind(el);
  });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
init();

// Marca o arquivo como módulo ES (evita colisão no escopo global do tsc).
export {};
