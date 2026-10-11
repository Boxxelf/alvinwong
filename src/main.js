import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WarpText, HERO_FRAMES, THROUGH_FRAMES } from './warp-text.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- smooth scroll ----------
const lenis = reduced ? null : new Lenis({ lerp: 0.1 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

document.querySelectorAll('[data-scroll]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const el = id === '#top' ? 0 : document.querySelector(id);
    if (el === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else window.scrollTo({ top: el === 0 ? 0 : el.offsetTop, behavior: reduced ? 'auto' : 'smooth' });
  });
});

// ---------- warp text ----------
const BLACK = '#000000';
const WHITE = '#ffffff';
const T = (text, extra = {}) => ({ text, ...extra });

const WARPS = {
  hero: {
    layout: {
      align: 'left',
      lines: [
        T('ALVIN WONG', { size: 1, tracking: -0.045, lh: 0.86 }),
        T('UX Designer,', { size: 0.21, lh: 1.08 }),
        T('Magician & Student', { size: 0.21, lh: 1.02 }),
        T('— Eastvale, California', { size: 0.21, lh: 1.02 }),
      ],
    },
    frames: HERO_FRAMES, widthDesktop: 0.5, widthMobile: 0.86, color: BLACK, end: '+=200%',
  },
  status: { lines: ['Class of 2027,', 'open to internships'], widthDesktop: 0.42, widthMobile: 0.88, color: BLACK },
  statement1: { lines: ['Designing digital experiences', 'that feel like magic.'], widthDesktop: 0.46, widthMobile: 0.9, color: BLACK },
  statement2: { lines: ['Research, wireframe,', 'prototype — then perform.'], widthDesktop: 0.42, widthMobile: 0.88, color: BLACK },
  p1: { lines: ['USER', 'FIRST'], caps: true, widthDesktop: 0.38, widthMobile: 0.78, color: WHITE },
  p2: { lines: ['CLEAR', 'DESIGN'], caps: true, widthDesktop: 0.46, widthMobile: 0.84, color: WHITE },
  p3: { lines: ['A LITTLE', 'MAGIC'], caps: true, widthDesktop: 0.5, widthMobile: 0.86, color: WHITE },
};

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

async function init() {
  const useGL = webglOK();
  await document.fonts.load('400 100px "Inter Tight"').catch(() => {});
  await document.fonts.ready;

  let warp = null;
  if (useGL && !reduced) {
    document.documentElement.classList.add('has-webgl');
    warp = new WarpText(document.querySelector('.warp-canvas'));
    if (import.meta.env.DEV) window.__warp = warp;
  } else {
    document.querySelector('.warp-canvas').remove();
  }

  document.querySelectorAll('[data-warp]').forEach((section) => {
    const cfg = WARPS[section.dataset.warp];
    if (!warp) return; // plain DOM text is the fallback
    const layout = cfg.layout ?? {
      lines: cfg.lines.map((l) => T(l, cfg.caps ? { size: 1, tracking: -0.02, lh: 0.9 } : { size: 1, lh: 1.0 })),
    };
    const block = warp.add({ ...cfg, layout, frames: cfg.frames ?? THROUGH_FRAMES });
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: cfg.end ?? '+=150%',
      pin: true,
      scrub: true,
      onUpdate: (st) => { block.progress = st.progress; },
      onToggle: (st) => { block.active = st.isActive; },
      onRefresh: (st) => { block.progress = st.progress; block.active = st.isActive; },
    });
  });

  // the hero is pinned from the very top, so it must be live on first paint
  ScrollTrigger.refresh();

  // ---------- experience hover panel ----------
  const exp = document.querySelector('.exp');
  const shot = document.querySelector('.exp__shot');
  const shotImg = shot.querySelector('img');
  let floatY = 0;
  let floatTo = 0;
  exp.querySelectorAll('.exp__row').forEach((row) => {
    // rows with a photo or mockup show it behind the table; the rest show nothing
    if (!row.dataset.shot) return;
    const src = import.meta.env.BASE_URL + row.dataset.shot;
    new Image().src = src;
    row.addEventListener('mouseenter', () => {
      shotImg.src = src;
      shot.classList.add('is-on');
    });
    row.addEventListener('mouseleave', () => shot.classList.remove('is-on'));
  });
  exp.addEventListener('mousemove', (e) => {
    const r = exp.getBoundingClientRect();
    floatTo = e.clientY - r.top;
  });

  // ---------- outro: name rises and un-squashes ----------
  if (!reduced) {
    gsap.fromTo('.outro__name',
      { yPercent: 40, scaleY: 0.6, skewX: -8 },
      { yPercent: 0, scaleY: 1, skewX: 0, ease: 'none',
        scrollTrigger: { trigger: '.outro', start: 'top 80%', end: 'bottom bottom', scrub: true } });
    gsap.fromTo('.outro__sub',
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '.outro', start: 'top 85%', end: 'center center', scrub: true } });
  }

  // ---------- project shots: slow zoom-out as they scroll through ----------
  if (!reduced) {
    gsap.utils.toArray('.shot img').forEach((img) => {
      gsap.fromTo(img, { scale: 1.12 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  // ---------- active nav link ----------
  const links = [...document.querySelectorAll('.nav__links a')];
  links.forEach((a) => {
    const target = document.querySelector(a.getAttribute('href'));
    ScrollTrigger.create({
      trigger: target, start: 'top 50%', end: 'bottom 50%',
      onToggle: (st) => a.classList.toggle('is-active', st.isActive),
    });
  });

  // ---------- frame loop ----------
  gsap.ticker.add(() => {
    floatY += (floatTo - floatY) * 0.12;
    shot.style.transform = `translate3d(0, ${floatY - shot.offsetHeight / 2}px, 0)`;
    warp?.render();
  });

  window.addEventListener('resize', () => {
    warp?.resize();
  });
}

init();
