document.getElementById('year').textContent = new Date().getFullYear();

function updateEthanTime() {
  const el = document.getElementById('ethan-time');
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  el.textContent = `${time} — Ethan Time`;
}

updateEthanTime();
setInterval(updateEthanTime, 1000);

/* Copy-to-email — mailto: is the primary path, but a visitor with no mail
   client configured gets nothing from it, so the address is also copyable. */
document.querySelectorAll('[data-copy-mail]').forEach((btn) => {
  const label = btn.textContent;
  let reset;

  btn.addEventListener('click', async () => {
    const address = btn.dataset.copyMail;
    try {
      await navigator.clipboard.writeText(address);
      btn.textContent = 'Copied';
    } catch (e) {
      /* clipboard denied or unavailable (http, old browser) — select it
         instead so a manual copy still works */
      btn.textContent = address;
    }
    btn.classList.add('is-copied');
    clearTimeout(reset);
    reset = setTimeout(() => {
      btn.textContent = label;
      btn.classList.remove('is-copied');
    }, 1800);
  });
});
