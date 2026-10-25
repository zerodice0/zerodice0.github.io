const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

for (const carousel of document.querySelectorAll('.screenshot-carousel')) {
  const scroller = carousel.querySelector('.play-screens');
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');

  const update = () => {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    prev.hidden = next.hidden = maxScroll <= 1;
    prev.disabled = scroller.scrollLeft <= 1;
    next.disabled = scroller.scrollLeft >= maxScroll - 1;
  };

  const move = direction => {
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const current = scroller.scrollLeft;
    const firstOffset = scroller.firstElementChild.offsetLeft;
    let target = direction > 0 ? maxScroll : 0;
    for (const item of scroller.children) {
      const itemTarget = Math.min(maxScroll, item.offsetLeft - firstOffset);
      if (direction > 0 && itemTarget > current + 1) {
        target = itemTarget;
        break;
      }
      if (direction < 0 && itemTarget < current - 1) target = itemTarget;
    }
    scroller.scrollTo({
      left: target,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  };

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  scroller.addEventListener('scroll', update, { passive: true });
  scroller.addEventListener('keydown', event => {
    if (event.target !== scroller || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  new ResizeObserver(update).observe(scroller);
  update();
}
