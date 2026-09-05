// contact-form.ts — progressive enhancement do formulário de contato.
//
// O HTML nasce funcional sem JS: maxlength/contador nativo, radios de assunto
// com default, action="mailto:" no form e href wa.me no link direto.
// Quando o JS roda, este módulo adiciona: contador dinâmico, validação inline
// (sem alert), Clipboard API nos botões COPIAR e composição de mailto/wa.me
// com os dados digitados.
//
// Segue o padrão de reveal.ts: init em astro:page-load / astro:after-swap
// (ClientRouter) com dedupe por WeakSet, sem estado global.

const boundForms = new WeakSet<HTMLFormElement>();
const boundCopyButtons = new WeakSet<HTMLButtonElement>();
const copyTimers = new WeakMap<HTMLButtonElement, number>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function copyText(value: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value).then(
      () => true,
      () => legacyCopy(value),
    );
  }
  return Promise.resolve(legacyCopy(value));
}

function legacyCopy(value: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = value;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

function bindCopyButton(btn: HTMLButtonElement) {
  if (boundCopyButtons.has(btn)) return;
  boundCopyButtons.add(btn);
  btn.addEventListener('click', () => {
    const value = btn.dataset.copy ?? '';
    const original = btn.dataset.copyLabel ?? btn.textContent ?? '';
    const copied = btn.dataset.copiedLabel ?? original;
    if (!value) return;
    void copyText(value).then((ok) => {
      if (!ok) return;
      btn.textContent = copied;
      window.clearTimeout(copyTimers.get(btn));
      copyTimers.set(
        btn,
        window.setTimeout(() => {
          btn.textContent = original;
        }, 2000),
      );
    });
  });
}

function setError(
  input: HTMLInputElement | HTMLTextAreaElement,
  errorEl: HTMLElement | null,
  message: string,
) {
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.classList.toggle('hidden', message === '');
  if (message === '') input.removeAttribute('aria-invalid');
  else input.setAttribute('aria-invalid', 'true');
}

function buildMailto(form: HTMLFormElement, data: { name: string; email: string; subject: string; message: string }): string {
  const to = form.dataset.email ?? '';
  const subject = encodeURIComponent(`[${data.subject}] ${data.name}`);
  const body = encodeURIComponent(
    `Nome: ${data.name}\nE-mail: ${data.email}\nAssunto: ${data.subject}\n\n${data.message}`,
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

function buildWhatsApp(form: HTMLFormElement, data: { name: string; email: string; subject: string; message: string }): string {
  const base = form.dataset.whatsapp ?? 'https://wa.me/';
  const text = encodeURIComponent(
    `[${data.subject}] ${data.name} (${data.email}): ${data.message}`.trim(),
  );
  return text ? `${base}?text=${text}` : base;
}

function readForm(form: HTMLFormElement) {
  const name = form.querySelector<HTMLInputElement>('#contact-name');
  const email = form.querySelector<HTMLInputElement>('#contact-email');
  const message = form.querySelector<HTMLTextAreaElement>('#contact-message');
  const subject =
    form.querySelector<HTMLInputElement>('input[name="subject"]:checked')?.value ?? '';
  return { name, email, message, subject };
}

function bindForm(form: HTMLFormElement) {
  if (boundForms.has(form)) return;
  boundForms.add(form);
  // Desliga a validação nativa só quando o JS assume (sem JS ela continua valendo).
  form.noValidate = true;

  const name = form.querySelector<HTMLInputElement>('#contact-name');
  const email = form.querySelector<HTMLInputElement>('#contact-email');
  const message = form.querySelector<HTMLTextAreaElement>('#contact-message');
  if (!name || !email || !message) return;

  const counter = form.querySelector<HTMLElement>('#contact-counter');
  const max = Number(counter?.dataset.max ?? message.maxLength ?? 1000);
  const direct = form.querySelector<HTMLAnchorElement>('#contact-direct');
  const errRequired = form.dataset.errRequired ?? 'Required field.';
  const errEmail = form.dataset.errEmail ?? 'Invalid email.';
  const errMax = form.dataset.errMax ?? 'Too long.';

  const nameError = form.querySelector<HTMLElement>('#contact-name-error');
  const emailError = form.querySelector<HTMLElement>('#contact-email-error');
  const subjectError = form.querySelector<HTMLElement>('#contact-subject-error');
  const messageError = form.querySelector<HTMLElement>('#contact-message-error');

  const snapshot = () => {
    const current = readForm(form);
    return {
      name: current.name?.value.trim() ?? '',
      email: current.email?.value.trim() ?? '',
      subject: current.subject,
      message: current.message?.value ?? '',
    };
  };

  const updateCounter = () => {
    if (counter) counter.textContent = `${message.value.length}/${max}`;
  };

  const updateDirect = () => {
    if (direct) direct.href = buildWhatsApp(form, snapshot());
  };

  name.addEventListener('input', () => setError(name, nameError, ''));
  email.addEventListener('input', () => setError(email, emailError, ''));
  message.addEventListener('input', () => {
    setError(message, messageError, '');
    updateCounter();
    updateDirect();
  });
  form.querySelectorAll<HTMLInputElement>('input[name="subject"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      if (subjectError) {
        subjectError.textContent = '';
        subjectError.classList.add('hidden');
      }
      updateDirect();
    });
  });

  updateCounter();
  updateDirect();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = snapshot();
    let firstInvalid: HTMLElement | null = null;

    if (data.name === '') {
      setError(name, nameError, errRequired);
      firstInvalid ??= name;
    }
    if (data.email === '') {
      setError(email, emailError, errRequired);
      firstInvalid ??= email;
    } else if (!EMAIL_RE.test(data.email)) {
      setError(email, emailError, errEmail);
      firstInvalid ??= email;
    }
    if (data.subject === '' && subjectError) {
      subjectError.textContent = errRequired;
      subjectError.classList.remove('hidden');
      firstInvalid ??= form.querySelector<HTMLElement>('input[name="subject"]');
    }
    if (data.message.trim() === '') {
      setError(message, messageError, errRequired);
      firstInvalid ??= message;
    } else if (data.message.length > max) {
      setError(message, messageError, errMax);
      firstInvalid ??= message;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    window.location.href = buildMailto(form, data);
  });
}

function init() {
  document
    .querySelectorAll<HTMLFormElement>('#contact-form')
    .forEach(bindForm);
  document
    .querySelectorAll<HTMLButtonElement>('[data-copy]')
    .forEach(bindCopyButton);
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
init();

// Marca o arquivo como módulo ES (evita colisão no escopo global do tsc com
// outros scripts sem import/export, ex.: elastic-line.ts).
export {};
