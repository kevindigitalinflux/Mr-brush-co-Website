/**
 * SectionRevealEffect
 *
 * Injects a two-layer background (image + grime) into each target section
 * and drives their reveal via GSAP ScrollTrigger + scrub.
 *
 * Layer stack (bottom → top within the section stacking context):
 *   0 · image  — clean office photo,  opacity 0 → IMAGE_PEAK
 *   1 · dark   — permanent tint,      keeps text legible over the photo
 *   2 · grime  — splotchy overlay,    opacity GRIME_START → 0
 *  10 · content (existing section markup, elevated by index.css rule)
 *
 * Nothing in the existing section components is touched.
 */

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// How much of the clean photo bleeds through at full reveal.
// 0.28 is enough to register but won't overpower dark text.
const IMAGE_PEAK = 0.28

// Starting opacity of the grime overlay (removed during reveal).
const GRIME_START = 0.52

// Each section paired with its background environment photo.
// backgroundPosition fine-tunes which part of the image shows
// behind a portrait-style section of varying height.
const REVEALS = [
  {
    id: '#problem',
    // Bright open-plan office — familiar but imperfect
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 35%',
  },
  {
    id: '#how-it-works',
    // Modern clean corridor / organised workspace
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 50%',
  },
  {
    id: '#services',
    // Minimal, sunlit desk environment
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 40%',
  },
  {
    id: '#why-us',
    // Premium executive office — the pinnacle of clean
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 45%',
  },
]

// ─── Grime gradient — simulates uneven dirt / residue ────────────────────────
// Three overlapping radial blobs at different positions, matching the dark
// palette of the sponge animation's dirt canvas.
const GRIME_BG = [
  'radial-gradient(ellipse 58% 48% at 16% 30%, rgba(0,0,0,0.42) 0%, transparent 100%)',
  'radial-gradient(ellipse 52% 58% at 80% 68%, rgba(0,0,0,0.36) 0%, transparent 100%)',
  'radial-gradient(ellipse 78% 72% at 50% 52%, rgba(4,10,6,0.22) 0%, transparent 100%)',
].join(', ')

/** GSAP scroll-triggered reveal effect applied to all content sections */
export function SectionRevealEffect() {
  useEffect(() => {
    const cleanupFns: (() => void)[] = []

    REVEALS.forEach(({ id, image, pos }) => {
      const section = document.querySelector<HTMLElement>(id)
      if (!section) return

      // Mark section so index.css rules activate (stacking context + content z-index)
      section.setAttribute('data-reveal', 'true')

      // ── Layer 0 · Background image ──────────────────────────────────────────
      const bgEl = document.createElement('div')
      bgEl.className = 'reveal-layer'
      Object.assign(bgEl.style, {
        position: 'absolute',
        inset: '0',
        backgroundImage: `url('${image}')`,
        backgroundSize: 'cover',
        backgroundPosition: pos,
        opacity: '0',
        zIndex: '0',
        pointerEvents: 'none',
        willChange: 'opacity',
        transform: 'translateZ(0)',
      })

      // ── Layer 1 · Permanent dark tint ───────────────────────────────────────
      // Sits above the photo at all times — keeps heading/body text legible
      // even once the photo is at full opacity.
      const darkEl = document.createElement('div')
      darkEl.className = 'reveal-layer'
      Object.assign(darkEl.style, {
        position: 'absolute',
        inset: '0',
        background: 'rgba(9, 15, 11, 0.72)',
        zIndex: '1',
        pointerEvents: 'none',
      })

      // ── Layer 2 · Grime overlay ─────────────────────────────────────────────
      const grimeEl = document.createElement('div')
      grimeEl.className = 'reveal-layer'
      Object.assign(grimeEl.style, {
        position: 'absolute',
        inset: '0',
        backgroundImage: GRIME_BG,
        opacity: String(GRIME_START),
        zIndex: '2',
        pointerEvents: 'none',
        willChange: 'opacity',
        transform: 'translateZ(0)',
      })

      // Prepend in reverse order so DOM order = bg, dark, grime (z-index matches)
      section.prepend(grimeEl)
      section.prepend(darkEl)
      section.prepend(bgEl)

      // ── ScrollTrigger reveal ─────────────────────────────────────────────────
      //
      // start: section top crosses 72 % of viewport height (just below fold)
      // end:   section top crosses 18 % (section well into view, heading readable)
      //
      // The image fades in while the grime fades out simultaneously,
      // creating a "cleaning in real time" feel as the user scrolls into view.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          end: 'top 18%',
          scrub: 2,
        },
      })

      tl
        .to(bgEl,    { opacity: IMAGE_PEAK, ease: 'power1.inOut', duration: 1 }, 0)
        .to(grimeEl, { opacity: 0,          ease: 'power1.in',    duration: 1 }, 0)

      cleanupFns.push(() => {
        tl.scrollTrigger?.kill()
        tl.kill()
        bgEl.remove()
        darkEl.remove()
        grimeEl.remove()
        section.removeAttribute('data-reveal')
      })
    })

    return () => cleanupFns.forEach(fn => fn())
  }, [])

  return null
}
