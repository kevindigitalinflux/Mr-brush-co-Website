/**
 * SectionCleanEffect
 *
 * Adds a subtle "dirty → clean" veil to every non-hero section.
 * Each section gets a single .clean-veil div that starts semi-opaque
 * (making the section feel slightly imperfect / textured) and fades
 * away when the section scrolls into view.
 *
 * Zero per-frame JS — animation is handled entirely by a CSS transition
 * on `.clean-veil`; the only JS is a one-shot class toggle via ScrollTrigger.
 */

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Each section with its veil gradient variant.
// Different shapes so each section feels uniquely "soiled".
const TARGETS = [
  {
    id: '#problem',
    // Top-left smear + bottom-right smear
    veil: [
      'radial-gradient(ellipse 65% 55% at 8%  20%, rgba(0,0,0,0.30) 0%, transparent 100%)',
      'radial-gradient(ellipse 55% 45% at 92% 85%, rgba(0,0,0,0.24) 0%, transparent 100%)',
      'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(4,8,5,0.12) 0%, transparent 100%)',
    ].join(', '),
  },
  {
    id: '#how-it-works',
    // Wide central haze, heavier on the right
    veil: [
      'radial-gradient(ellipse 90% 70% at 60% 45%, rgba(0,0,0,0.26) 0%, transparent 100%)',
      'radial-gradient(ellipse 40% 80% at 95% 50%, rgba(0,0,0,0.20) 0%, transparent 100%)',
    ].join(', '),
  },
  {
    id: '#services',
    // Bottom-heavy grime (desk surface feel)
    veil: [
      'radial-gradient(ellipse 100% 40% at 50% 100%, rgba(0,0,0,0.32) 0%, transparent 100%)',
      'radial-gradient(ellipse 50% 60% at 15% 30%,  rgba(0,0,0,0.18) 0%, transparent 100%)',
    ].join(', '),
  },
  {
    id: '#why-us',
    // Spotlight centre with dirty edges
    veil: [
      'radial-gradient(ellipse 50% 50% at 50% 50%, transparent 30%, rgba(0,0,0,0.28) 100%)',
      'radial-gradient(ellipse 30% 40% at 85% 15%, rgba(0,0,0,0.18) 0%, transparent 100%)',
    ].join(', '),
  },
  {
    id: '#ratings',
    // Subtle overall dusting
    veil: [
      'radial-gradient(ellipse 80% 50% at 50% 0%,   rgba(0,0,0,0.22) 0%, transparent 100%)',
      'radial-gradient(ellipse 60% 60% at 10% 80%,  rgba(0,0,0,0.16) 0%, transparent 100%)',
    ].join(', '),
  },
  {
    id: '#trust',
    // Corner smears
    veil: [
      'radial-gradient(ellipse 45% 55% at 0%   0%,  rgba(0,0,0,0.24) 0%, transparent 100%)',
      'radial-gradient(ellipse 45% 55% at 100% 100%,rgba(0,0,0,0.20) 0%, transparent 100%)',
    ].join(', '),
  },
  {
    id: '#quote',
    // Top edge smear — like water marks on a form
    veil: [
      'radial-gradient(ellipse 100% 35% at 50% 0%,  rgba(0,0,0,0.28) 0%, transparent 100%)',
      'radial-gradient(ellipse 35% 65% at 75% 60%,  rgba(0,0,0,0.16) 0%, transparent 100%)',
    ].join(', '),
  },
]

// Sections that already have data-reveal (handled by SectionRevealEffect).
// These only need the veil — the stacking context is already established.
const REVEAL_SECTIONS = new Set(['#problem', '#how-it-works', '#services', '#why-us'])

export default function SectionCleanEffect() {
  useEffect(() => {
    const triggers: ReturnType<typeof ScrollTrigger.create>[] = []

    TARGETS.forEach(({ id, veil }) => {
      const section = document.querySelector<HTMLElement>(id)
      if (!section) return

      // Sections without data-reveal need data-clean to activate the
      // stacking context + content z-index rules from index.css.
      if (!REVEAL_SECTIONS.has(id)) {
        section.setAttribute('data-clean', 'true')
      }

      // Inject veil div
      const veilEl = document.createElement('div')
      veilEl.className = 'clean-veil reveal-layer'
      Object.assign(veilEl.style, {
        position: 'absolute',
        inset: '0',
        backgroundImage: veil,
        zIndex: '3',          // above grime (z:2) and dark tint (z:1) in reveal sections
        pointerEvents: 'none',
      })
      section.prepend(veilEl)

      // One-shot trigger — adds .is-clean which drives the CSS transition
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: () => veilEl.classList.add('is-clean'),
      })
      triggers.push(st)
    })

    return () => {
      triggers.forEach(t => t.kill())
      TARGETS.forEach(({ id }) => {
        const section = document.querySelector<HTMLElement>(id)
        if (!section) return
        section.removeAttribute('data-clean')
        // Remove injected veil (find by class — may be 1 or none)
        section.querySelector('.clean-veil')?.remove()
      })
    }
  }, [])

  return null
}
