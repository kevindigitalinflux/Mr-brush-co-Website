import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── SVG icons — one per section ───────────────────────────────────────────
const ICONS = [
  // 0 · hero — Assessment: magnifying glass
  <svg key="assess" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
  </svg>,

  // 1 · problem — Identify: water droplet / stain marker
  <svg key="problem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 C12 3 5 11 5 15.5 a7 7 0 0 0 14 0 C19 11 12 3 12 3 Z" />
    <path d="M9 16 a4 4 0 0 0 3.5 2.5" strokeWidth="1" opacity="0.6" />
  </svg>,

  // 2 · how-it-works — Systematic process: flow arrows
  <svg key="process" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 8h10M5 12h10M5 16h6" />
    <polyline points="13 5 16 8 13 11" />
  </svg>,

  // 3 · services — Spray bottle: treatment applied
  <svg key="spray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="7" y="11" width="7" height="9" rx="1.5" />
    <path d="M7 11 V9 a2 2 0 0 1 2-2 h3" />
    <line x1="14" y1="7" x2="17" y2="7" />
    <line x1="17" y1="5" x2="17" y2="9" />
    <line x1="18" y1="7" x2="21" y2="7" strokeDasharray="1.5 1.5" />
  </svg>,

  // 4 · why-us — Detail brush: precision work
  <svg key="brush" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 21 L15 9" />
    <path d="M15 9 L19 5" strokeWidth="2" />
    <ellipse cx="4.5" cy="19.5" rx="2.5" ry="2" />
  </svg>,

  // 5 · ratings — Polish / quality: circular motion
  <svg key="polish" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 a9 9 0 0 1 9 9" />
    <path d="M12 21 a9 9 0 0 1-9-9" />
    <circle cx="12" cy="12" r="3" />
    <polyline points="21 9 21 12 18 12" />
  </svg>,

  // 6 · trust — Inspection: eye with tick
  <svg key="inspect" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12 C5 7 9 4 12 4 s7 3 10 8 C19 17 15 20 12 20 s-7-3-10-8Z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M10 12 l1.5 1.5 3-3" strokeWidth="1.6" />
  </svg>,

  // 7 · quote — Complete: sparkle / clean
  <svg key="complete" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="7.05" y2="7.05" />
    <line x1="16.95" y1="16.95" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="7.05" y2="16.95" />
    <line x1="16.95" y1="7.05" x2="19.78" y2="4.22" />
  </svg>,
]

// Section anchors in page order — used to derive progress thresholds
const SECTIONS = [
  '#hero',
  '#problem',
  '#how-it-works',
  '#services',
  '#why-us',
  '#ratings',
  '#trust',
  '#quote',
]

// ─── Component ─────────────────────────────────────────────────────────────

export default function CleaningProgressIndicator() {
  const rootRef     = useRef<HTMLDivElement>(null)
  const fillRef     = useRef<HTMLDivElement>(null)
  const dotRef      = useRef<HTMLDivElement>(null)
  const iconsRef    = useRef<(HTMLDivElement | null)[]>([])
  const activeRef   = useRef(0)

  useEffect(() => {
    const root  = rootRef.current
    const fill  = fillRef.current
    const dot   = dotRef.current
    if (!root || !fill || !dot) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const TRACK_H = root.offsetHeight

    // ── Initial states ──────────────────────────────────────────────────────
    gsap.set(root,  { opacity: 0 })
    gsap.set(fill,  { scaleY: 0, transformOrigin: 'top' })
    gsap.set(dot,   { y: 0 })
    iconsRef.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0 })
    })

    // Pre-compute each section's scroll progress threshold (0–1).
    // Done once after layout is stable — avoids repeated getBoundingClientRect in onUpdate.
    function computeThresholds(): number[] {
      const maxScroll = ScrollTrigger.maxScroll(window)
      if (maxScroll === 0) return SECTIONS.map(() => 0)
      return SECTIONS.map(selector => {
        const el = document.querySelector<HTMLElement>(selector)
        if (!el) return 0
        const top = el.getBoundingClientRect().top + window.scrollY
        // Trigger when the top of the section crosses 65% of viewport
        const triggerY = top - window.innerHeight * 0.65
        return Math.max(0, triggerY / maxScroll)
      })
    }

    let thresholds = computeThresholds()

    function switchIcon(next: number) {
      if (next === activeRef.current) return
      const prev = activeRef.current
      activeRef.current = next
      const prevEl = iconsRef.current[prev]
      const nextEl = iconsRef.current[next]
      if (prevEl) gsap.to(prevEl, { opacity: 0, duration: 0.35, ease: 'power2.out', overwrite: true })
      if (nextEl) gsap.to(nextEl, { opacity: 1, duration: 0.35, ease: 'power2.in',  overwrite: true })
    }

    // ── Single scrubbed ScrollTrigger ───────────────────────────────────────
    // One timeline drives fill + dot; onUpdate handles icon switching.
    // This replaces the previous 9 separate ScrollTrigger instances.
    const tl = gsap.timeline({
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress

          // Fade indicator in/out
          const opacity = p < 0.06
            ? gsap.utils.mapRange(0, 0.06, 0, 1, p)
            : p > 0.92
            ? gsap.utils.mapRange(0.92, 1, 1, 0, p)
            : 1
          gsap.set(root, { opacity: gsap.utils.clamp(0, 1, opacity) })

          // Icon: find the highest threshold not yet exceeded
          let next = 0
          for (let i = thresholds.length - 1; i >= 0; i--) {
            if (p >= thresholds[i]) { next = i; break }
          }
          switchIcon(next)
        },
        onRefresh: () => {
          // Re-derive thresholds whenever ScrollTrigger refreshes (resize, etc.)
          thresholds = computeThresholds()
        },
      },
    })

    tl
      .to(fill, { scaleY: 1, ease: 'none', duration: 1 }, 0)
      .to(dot,  { y: TRACK_H, ease: 'none', duration: 1 }, 0)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed hidden lg:block"
      style={{
        right: 28,
        top: '22vh',
        height: '56vh',
        width: 36,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      {/* ── Track line (background) ── */}
      <div
        className="absolute"
        style={{
          left: 3,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(184,167,122,0.28) 15%, rgba(184,167,122,0.28) 85%, transparent)',
        }}
      />

      {/* ── Fill line (grows with scroll) ── */}
      <div
        ref={fillRef}
        className="absolute"
        style={{
          left: 3,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(184,167,122,0.65) 15%, rgba(184,167,122,0.65) 85%, transparent)',
          transformOrigin: 'top',
        }}
      />

      {/* ── Dot + icon (travels along the track) ── */}
      <div
        ref={dotRef}
        className="absolute"
        style={{ left: 0, top: 0, width: 36 }}
      >
        {/* Dot — sits on the line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -3.5,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'rgba(184,167,122,0.80)',
            boxShadow: '0 0 6px rgba(184,167,122,0.4)',
          }}
        />

        {/* Icon — stacked, one visible at a time */}
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: -11,
            width: 22,
            height: 22,
            color: 'rgba(184,167,122,0.70)',
          }}
        >
          {ICONS.map((icon, i) => (
            <div
              key={i}
              ref={el => { iconsRef.current[i] = el }}
              style={{ position: 'absolute', inset: 0 }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
