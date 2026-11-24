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

// Phone carousel hint: "Swipe for more" + dots under the reel row. Only shows
// when the row actually overflows; dims once you reach the last reel.
(() => {
  document.querySelectorAll('.reel-scroller').forEach((scroller) => {
    const row = scroller.querySelector('.reel-row');
    const dots = [...scroller.querySelectorAll('.reel-dots span')];
    const reels = [...row.children];
    if (!dots.length) return;

    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      scroller.classList.toggle('can-scroll', max > 4);
      scroller.classList.toggle('is-end', row.scrollLeft >= max - 4);
      /* the active dot is the reel whose left edge is closest to the row's left */
      const left = row.getBoundingClientRect().left;
      let best = 0, bestDist = Infinity;
      reels.forEach((r, i) => {
        const d = Math.abs(r.getBoundingClientRect().left - left - parseFloat(getComputedStyle(row).paddingLeft));
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (row.scrollLeft >= max - 4) best = reels.length - 1;
      dots.forEach((d, i) => d.classList.toggle('is-on', i === best));
    };

    let raf = 0;
    row.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
