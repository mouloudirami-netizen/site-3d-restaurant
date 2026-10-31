import './styles.css';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { detectTier, type Tier } from './lib/capabilities';
import { scrollState } from './motion/scrollState';
import { setupVideo } from './media/video';
import { initFireStatus } from './live/fire-status';
import type { PlateHandle } from './three/plate';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const tier: Tier = detectTier();
document.documentElement.dataset.tier = tier;

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s));

// ---------- the live thing ----------
const fire = $('[data-fire]');
if (fire) initFireStatus(fire);

// ---------- video ----------
const video = $<HTMLVideoElement>('.stage__video');
const toggle = $<HTMLButtonElement>('.video-toggle');
if (video && toggle) setupVideo(video, toggle, tier);

// ---------- smooth scroll (one engine: Lenis driven by the GSAP ticker) ----------
let lenis: Lenis | null = null;
try {
  if (tier !== 'static') {
    lenis = new Lenis({ autoRaf: false, lerp: tier === 'lite' ? 0.2 : 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
} catch (err) {
  console.error('[scroll] Lenis failed, using native scroll', err);
  lenis = null;
}

// in-page links go through Lenis so the scroll engine stays in charge
$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    const target = id === '#top' ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'auto' });
    if (target instanceof HTMLElement && target !== document.body) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

// ---------- the 3D dish, loaded only when the intro approaches ----------
const canvasHost = $('.stage__canvas')!;
const still = $<HTMLImageElement>('.stage__still')!;
let plate: PlateHandle | null = null;
let plateFailed = false;

function showStill() {
  plateFailed = true;
  still.loading = 'eager';
  gsap.set(canvasHost, { autoAlpha: 0 });
}

async function loadPlate() {
  if (plate || plateFailed || tier === 'static') return;
  const timeout = window.setTimeout(() => { if (!plate) { console.warn('[three] load timed out'); showStill(); } }, 15000);
  try {
    const { createPlate } = await import('./three/plate');
    if (plateFailed) return;
    plate = createPlate(canvasHost, tier);
    canvasHost.addEventListener('plate:error', showStill);
    // pause rendering whenever the stage is off-screen
    new IntersectionObserver(([entry]) => plate?.setPaused(!entry.isIntersecting)).observe($('.stage')!);
    document.addEventListener('visibilitychange', () => plate?.setPaused(document.hidden));
    (window as unknown as { __plate: PlateHandle }).__plate = plate;
  } catch (err) {
    console.error('[three] could not start the 3D dish', err);
    showStill();
  } finally {
    window.clearTimeout(timeout);
  }
}

if (new URLSearchParams(location.search).has('capture')) loadPlate();

// ---------- view tabs: a keyboard alternative to dragging the plate ----------
const tabs = $$<HTMLButtonElement>('.tab');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    scrollState.view = tab.dataset.view as typeof scrollState.view;
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
  });
});

// ---------- the plating steps, driven by the scroll ----------
const steps = $$('.step');
const stepStarts = [0.03, 0.2, 0.4, 0.52, 0.66, 0.86];
function updateSteps(p: number) {
  steps.forEach((s, i) => s.classList.toggle('is-on', p >= stepStarts[i] + 0.02));
}

// ---------- motion ----------
const mm = gsap.matchMedia();

mm.add(
  {
    motion: '(prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
    desktop: '(min-width: 768px)',
  },
  (ctx) => {
    const { motion, desktop } = ctx.conditions as { motion: boolean; reduce: boolean; desktop: boolean };
    const isStatic = tier === 'static' || !motion;

    // Plating progress: from the dish section entering to its end.
    ScrollTrigger.create({
      trigger: '#le-plat',
      start: desktop ? 'top 75%' : 'top 60%',
      end: desktop ? 'bottom 65%' : 'bottom 90%',
      onUpdate: (self) => { scrollState.plating = self.progress; updateSteps(self.progress); },
      onLeave: () => { scrollState.plating = 1; updateSteps(1); },
      onLeaveBack: () => { scrollState.plating = 0; updateSteps(0); },
    });

    // Load the 3D chunk as the intro approaches.
    ScrollTrigger.create({ trigger: '.intro', start: 'top 180%', once: true, onEnter: () => { loadPlate(); } });

    if (isStatic) {
      // poster, then a still of the dressed plate; no travel, no scrub
      ScrollTrigger.create({
        trigger: '.intro', start: 'top 60%',
        onEnter: () => { still.loading = 'eager'; gsap.set(still, { opacity: 1 }); gsap.set(video, { opacity: 0 }); },
        onLeaveBack: () => { gsap.set(still, { opacity: 0 }); gsap.set(video, { opacity: 1 }); },
      });
      updateSteps(1);
      return;
    }

    // Stage: the fire gives way to the dish (scrubbed crossfade).
    gsap.timeline({
      scrollTrigger: { trigger: '.intro', start: desktop ? 'top 85%' : 'top 70%', end: desktop ? 'top 15%' : 'top 10%', scrub: true },
    })
      .to(video, { opacity: 0, scale: 1.04, ease: 'none' }, 0)
      .to(toggle, { autoAlpha: 0, ease: 'none', duration: 0.3 }, 0)
      .fromTo(canvasHost, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: () => (plateFailed ? 0 : 1), scale: 1, ease: 'none' }, 0)
      .to(still, { opacity: () => (plateFailed ? 1 : 0), ease: 'none' }, 0);

    // Load sequence: the wordmark rises letter by letter, then the sentence, status and action.
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
    intro
      .from('.stage__frame', { scale: 1.04, opacity: 0.4, duration: 1.1 }, 0)
      .from('.wm-l', { yPercent: 105, duration: 0.8, stagger: 0.03 }, 0)
      .from('[data-hero]', { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.25)
      .from('.nav', { autoAlpha: 0, duration: 0.6 }, 0.3);

    // Signature move: the monument is heavy — the name sinks a few percent as the first screen leaves…
    gsap.to('.wordmark', {
      scale: 0.94, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    // …and returns to full size as the footer arrives.
    gsap.fromTo('.foot__giant', { scale: 0.94, yPercent: 6 }, {
      scale: 1, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });

    // Section entrances: heading, then text, then the rest, once.
    $$('section').forEach((section) => {
      const parts = $$('[data-r]', section);
      if (!parts.length) return;
      gsap.from(parts, {
        y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.075,
        scrollTrigger: { trigger: section, start: 'top 82%', once: true },
      });
    });

    // The menu arrives row by row, its dots a beat later.
    $$('.menu__group').forEach((group) => {
      const rows = $$('.row', group);
      gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 88%', once: true } })
        .from(rows, { y: 16, autoAlpha: 0, duration: 0.7, ease: 'quint.out', stagger: 0.06 }, 0)
        .from($$('.row__dot', group), { scale: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06, clearProps: 'transform' }, 0.15);
    });

    // Steps and tabs settle in as the dish section enters.
    gsap.from('.step', {
      x: -12, autoAlpha: 0, duration: 0.8, ease: 'quint.out', stagger: 0.07,
      scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true },
    });
    gsap.from('.tab, .cell', {
      y: 12, autoAlpha: 0, duration: 0.7, ease: 'quint.out', stagger: 0.05,
      scrollTrigger: { trigger: '.dish', start: 'top 80%', once: true },
    });

    // Visit: the embers drift up slowly under the card; the card lands.
    gsap.fromTo('.visit__img', { scale: 1.12, yPercent: -4 }, {
      scale: 1, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from('.visit__card > *', {
      y: 20, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: '.visit__card', start: 'top 90%', once: true },
    });

    // Footer picture opens from a slight scale; the menu rises item by item.
    gsap.from('.foot__media img', {
      scale: 1.15, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.foot', start: 'top 75%', once: true },
    });
    gsap.from('.foot__menu li', {
      y: 28, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: '.foot__menu', start: 'top 85%', once: true },
    });
  },
);

// Layout changes once fonts and images arrive.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
