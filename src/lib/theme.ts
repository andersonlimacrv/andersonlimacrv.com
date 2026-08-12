/**
 * Theme controller — vanilla mirror of the `useThemeToggle` hook from the
 * Skiper 26 draft (docs/drafts/example-toggle-usage.tsx), rebuilt without
 * React / next-themes for a zero-JS Astro client.
 *
 * State lives in `localStorage['theme']` + the `.dark` class on <html>,
 * matching the anti-FOUC inline script in BaseLayout.astro.
 */

import { createAnimation, type Animation } from './theme-transition';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';
const STYLE_ID = 'theme-transition-styles';
export const THEME_CHANGE_EVENT = 'themechange';

type ThemeChangeDetail = { theme: Theme };

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function isDark(): boolean {
  return getTheme() === 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Preferência do sistema será usada na próxima visita.
  }
  document.dispatchEvent(
    new CustomEvent<ThemeChangeDetail>(THEME_CHANGE_EVENT, {
      detail: { theme },
    }),
  );
}

/**
 * Reaplica o tema armazenado (ou o do sistema) no <html>, sem disparar
 * `themechange` e sem gravar no storage. Usado em `astro:after-swap` para
 * garantir que o tema persista em navegações por view transition, já que o
 * snapshot SSR não carrega a classe `.dark`.
 */
export function applyStoredTheme() {
  const stored = readStored();
  const theme =
    stored ?? (systemPrefersDark() ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function injectTransitionStyles(animation: Animation) {
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = animation.css;
  return () => {
    styleEl?.remove();
  };
}

let transitionActive = false;

function setThemeAnimated(next: Theme, animation?: Animation) {
  if (getTheme() === next) return;

  const canAnimate =
    animation !== undefined &&
    !transitionActive &&
    !prefersReducedMotion() &&
    typeof document.startViewTransition === 'function';

  if (!canAnimate) {
    applyTheme(next);
    return;
  }

  transitionActive = true;
  const cleanup = injectTransitionStyles(animation!);

  let transition: {
    finished?: Promise<void>;
  };
  try {
    transition = document.startViewTransition(() => applyTheme(next));
  } catch {
    cleanup();
    transitionActive = false;
    applyTheme(next);
    return;
  }

  const finish = () => {
    cleanup();
    transitionActive = false;
  };

  if (transition.finished) {
    transition.finished.then(finish, finish);
    // Rede de segurança: nunca deixar o <style> órfão.
    window.setTimeout(() => {
      if (transitionActive) finish();
    }, 1600);
  } else {
    window.setTimeout(finish, 800);
  }
}

export function toggleTheme(animation?: Animation): Theme {
  const effect = animation ?? createAnimation();
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  setThemeAnimated(next, effect);
  return next;
}

export { readStored };
