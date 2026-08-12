import {
  applyStoredTheme,
  getTheme,
  toggleTheme,
  THEME_CHANGE_EVENT,
} from '../lib/theme';
import { createAnimation } from '../lib/theme-transition';

function bindToggle() {
  const rootEl = document.querySelector<HTMLButtonElement>('.theme-toggle');
  if (!rootEl || rootEl.dataset.bound === 'true') return;
  rootEl.dataset.bound = 'true';
  rootEl.addEventListener('click', () => {
    toggleTheme(createAnimation());
  });
}

function syncToggle() {
  const button = document.querySelector<HTMLButtonElement>('.theme-toggle');
  if (!button) return;
  const darkLabel = button.dataset.labelDark ?? 'Ativar tema escuro';
  const lightLabel = button.dataset.labelLight ?? 'Ativar tema claro';
  const dark = getTheme() === 'dark';
  button.classList.toggle('is-dark', dark);
  button.setAttribute('aria-pressed', String(dark));
  button.setAttribute('aria-label', dark ? lightLabel : darkLabel);
}

function watchThemeChanges() {
  const rootEl = document.querySelector<HTMLButtonElement>('.theme-toggle');
  if (!rootEl || rootEl.dataset.listening === 'true') return;
  rootEl.dataset.listening = 'true';
  document.addEventListener(THEME_CHANGE_EVENT, syncToggle);
}

function init() {
  bindToggle();
  watchThemeChanges();
  syncToggle();
}

init();
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', () => {
  applyStoredTheme();
  syncToggle();
});
