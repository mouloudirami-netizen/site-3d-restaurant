import type { Tier } from '../lib/capabilities';

/** Hero loop: autoplay muted, paused off-screen, a visible pause control (WCAG 2.2.2), poster as the fallback. */
export function setupVideo(video: HTMLVideoElement, toggle: HTMLButtonElement, tier: Tier) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (tier === 'static' || reduce.matches) {
    video.removeAttribute('autoplay');
    video.preload = 'none';
    video.pause();
    toggle.hidden = true; // the poster stays
    return;
  }
  const setLabel = (paused: boolean) => {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Relancer la vidéo' : 'Mettre la vidéo en pause';
  };
  const play = () =>
    video.play().catch((err) => {
      console.warn('[video] autoplay blocked or failed', err);
      setLabel(true);
    });
  let userPaused = false;
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    if (userPaused) video.pause(); else play();
    setLabel(userPaused);
  });
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !userPaused) play(); else video.pause();
  }, { threshold: 0.05 }).observe(video);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause(); else if (!userPaused) play();
  });
  video.addEventListener('error', () => console.error('[video] source failed', video.currentSrc), true);
}
