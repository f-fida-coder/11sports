import { appState } from './state.js';

export function initHeroSlider(slides, root) {
  if (!root || !slides?.length) return;

  const track = root.querySelector('.hero-track');
  const dotsWrap = root.querySelector('.hero-dots');
  const prev = root.querySelector('.hero-prev');
  const next = root.querySelector('.hero-next');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;

  function renderSlide(index) {
    appState.heroIndex = (index + slides.length) % slides.length;
    const slide = slides[appState.heroIndex];

    track.innerHTML = `
      <article class="hero-item">
        <p class="text-xs font-bold uppercase text-emerald-400">${slide.tag}</p>
        <h3 class="mt-2 text-2xl font-extrabold">${slide.title}</h3>
        <p class="muted mt-2 text-sm">${slide.subtitle}</p>
        <button class="btn-primary mt-4">${slide.cta}</button>
      </article>
    `;

    dotsWrap.innerHTML = slides
      .map((_, i) => {
        const active = i === appState.heroIndex;
        return `<button type="button" class="hero-dot ${active ? 'active' : ''}" data-slide-index="${i}" aria-label="Go to slide ${
          i + 1
        }" ${active ? 'aria-current="true"' : ''}></button>`;
      })
      .join('');
  }

  function restartAuto() {
    clearInterval(timer);
    if (prefersReducedMotion) return;
    timer = setInterval(() => renderSlide(appState.heroIndex + 1), 5000);
  }

  renderSlide(0);
  restartAuto();

  prev?.addEventListener('click', () => {
    renderSlide(appState.heroIndex - 1);
    restartAuto();
  });

  next?.addEventListener('click', () => {
    renderSlide(appState.heroIndex + 1);
    restartAuto();
  });

  dotsWrap?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const i = Number(target.dataset.slideIndex);
    if (Number.isNaN(i)) return;

    renderSlide(i);
    restartAuto();
  });

  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', restartAuto);
  root.addEventListener('focusin', () => clearInterval(timer));
  root.addEventListener('focusout', (event) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && root.contains(nextTarget)) return;
    restartAuto();
  });
}
