const select = document.querySelector<HTMLSelectElement>('.site-locale-select');

if (select) {
  select.addEventListener('change', () => {
    const href = select.value;
    if (href && href !== location.pathname + location.search) {
      location.assign(href);
    }
  });
}