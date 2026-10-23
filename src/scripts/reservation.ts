const form = document.querySelector<HTMLFormElement>('#reservation-form');
if (form) {
  const ro = form.dataset.lang === 'ro';
  const date = form.querySelector<HTMLInputElement>('[name=date]')!;
  const time = form.querySelector<HTMLInputElement>('[name=time]')!;
  const name = form.querySelector<HTMLInputElement>('[name=name]')!;
  const phone = form.querySelector<HTMLInputElement>('[name=phone]')!;
  const status = form.querySelector<HTMLElement>('#form-status')!;
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  function localNow() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Bucharest',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (type: string) => parts.find((p) => p.type === type)!.value;
    return {
      date: `${get('year')}-${get('month')}-${get('day')}`,
      time: `${get('hour')}:${get('minute')}`,
    };
  }
  date.min = localNow().date;
  function validate() {
    const now = localNow();
    date.min = now.date;
    name.setCustomValidity(
      name.value.trim().length < 2
        ? ro
          ? 'Introdu un nume de cel puțin două caractere.'
          : 'Enter a name with at least two characters.'
        : '',
    );
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(
      digits.length < 7 || digits.length > 15 || !/^\+?[0-9() .-]+$/.test(phone.value)
        ? ro
          ? 'Introdu un număr de telefon valid.'
          : 'Enter a valid phone number.'
        : '',
    );
    time.setCustomValidity(
      date.value === now.date && time.value <= now.time
        ? ro
          ? 'Alege o oră viitoare.'
          : 'Choose a future time.'
        : '',
    );
  }
  form.addEventListener('input', validate);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    validate();
    if (!form.reportValidity()) return;
    if (button.disabled) return;
    status.classList.remove('success');
    if (!form.dataset.endpoint) {
      status.textContent = ro
        ? 'Solicitarea nu a fost trimisă. Rezervările online nu sunt activate. Sună la 0734 983 984.'
        : 'Your request was not sent. Online bookings are not enabled. Please call 0734 983 984.';
      status.focus();
      return;
    }
    button.disabled = true;
    button.textContent = button.dataset.loading!;
    form.setAttribute('aria-busy', 'true');
    status.textContent = '';
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Submission rejected');
      status.textContent = ro
        ? 'Solicitarea a fost trimisă. Masa nu este încă rezervată: așteaptă confirmarea telefonică a restaurantului.'
        : 'Your request has been sent. Your table is not yet booked: please wait for the restaurant’s phone confirmation.';
      status.classList.add('success');
      form.reset();
      date.min = localNow().date;
    } catch {
      status.textContent = ro
        ? 'Nu am putut confirma trimiterea. Sună la 0734 983 984 înainte de a reîncerca, pentru a evita o solicitare duplicată.'
        : 'We could not confirm delivery. Please call 0734 983 984 before trying again, to avoid a duplicate request.';
    } finally {
      window.clearTimeout(timeout);
      button.disabled = false;
      button.textContent = button.dataset.idle!;
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
}
const mapButton = document.querySelector<HTMLButtonElement>('#load-map');
mapButton?.addEventListener('click', () => {
  const iframe = document.createElement('iframe');
  iframe.title = mapButton.dataset.title!;
  iframe.src =
    'https://maps.google.com/maps?q=Erra%20Restaurant%20Strada%20Constantin%20C.%20Nottara%2013%20Bucuresti&output=embed';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.className = 'map-iframe';
  mapButton.closest('[data-map]')?.replaceChildren(iframe);
});
