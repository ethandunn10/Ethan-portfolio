// ReelCard player: click plays inline with sound, click again pauses,
// and starting one reel pauses any other that's playing.
(() => {
  const cards = [...document.querySelectorAll('button.reel-card')];
  const videoOf = (card) => card.querySelector('video');

  const setPlaying = (card, playing) => {
    card.classList.toggle('is-playing', playing);
    const title = card.getAttribute('aria-label').replace(/^(Play|Pause) reel: /, '');
    card.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} reel: ${title}`);
  };

  cards.forEach((card) => {
    const video = videoOf(card);
    video.addEventListener('play', () => setPlaying(card, true));
    video.addEventListener('pause', () => setPlaying(card, false));
    video.addEventListener('ended', () => setPlaying(card, false));

    card.addEventListener('click', () => {
      if (!video.paused) { video.pause(); return; }
      cards.forEach((other) => { if (other !== card) videoOf(other).pause(); });
      video.muted = false;
      video.play().catch(() => {});
    });
  });
})();
