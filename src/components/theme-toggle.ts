const button = document.querySelector('.theme-toggle') as HTMLButtonElement | null;
const sun = button?.querySelector('.icon-sun') as SVGSVGElement | null;
const moon = button?.querySelector('.icon-moon') as SVGSVGElement | null;

if (!button || !sun || !moon) {
  // Scripts do Astro são type="module"; se o elemento não existe, nada a fazer.
} else {
  const toggleButton = button;
  const sunIcon = sun;
  const moonIcon = moon;

  function sync() {
    const isDark = document.documentElement.classList.contains('dark');
    sunIcon.classList.toggle('hidden', isDark);
    moonIcon.classList.toggle('hidden', !isDark);
    toggleButton.setAttribute('aria-pressed', String(isDark));
    toggleButton.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
  }

  toggleButton.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    root.classList.toggle('dark', !isDark);
    try {
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    } catch {
      // Preferência do sistema será usada na próxima visita.
    }
    sync();
  });

  sync();
}
