document.getElementById('year').textContent = new Date().getFullYear();

function updateEthanTime() {
  const el = document.getElementById('ethan-time');
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  el.textContent = `${time} — Ethan Time`;
}

updateEthanTime();
setInterval(updateEthanTime, 1000);
