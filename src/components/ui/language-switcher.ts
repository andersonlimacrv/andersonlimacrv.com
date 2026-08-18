const select = document.querySelector<HTMLSelectElement>('.site-locale-select');

if (select) {
  select.addEventListener('change', () => {
    const href = select.value;
    const current = location.pathname + location.search;
    if (href && href !== current) {
      location.assign(href + location.hash);
    }
  });
}