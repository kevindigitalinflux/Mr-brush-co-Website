import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Camera, ShieldCheck, Eye, LayoutDashboard, MessageSquare, FileText, Star, TrendingUp } from 'lucide-react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'
import { AppMockup, type ScreenKey } from './AppMockup'

type Point = { icon: LucideIcon; title: string; body: string; ratings?: true }

const points: Point[] = [
  {
    icon: Camera,
    title: 'Photo proof after every clean',
    body: 'Every zone, every visit — timestamped photos reviewed by your supervisor before issues ever reach you.',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted, consistent staff',
    body: 'DBS-checked, trained, and assigned to your building long-term. A team that knows your site.',
  },
  {
    icon: Eye,
    title: 'Supervisor sign-off, every visit',
    body: 'Issues are caught and resolved at our end before being escalated to yours.',
  },
  {
    icon: LayoutDashboard,
    title: 'Live dashboard, full visibility',
    body: 'Live zone status, evidence, and supervisor notes visible the moment each clean is completed.',
  },
  {
    icon: MessageSquare,
    title: 'Complaints resolved, not just logged',
    body: 'File a complaint directly from the Mr Brush app. Track exactly how it is resolved, in real time.',
  },
  {
    icon: FileText,
    title: 'Transparent billing and reporting',
    body: 'Invoices match reports every time. No surprises, no disputes. See what was done and when.',
  },
  {
    icon: Star,
    title: 'Your team, rated by you',
    body: 'Rate your team after every clean. That feedback shapes performance and keeps standards high.',
    ratings: true,
  },
  {
    icon: TrendingUp,
    title: 'Better pay. Better pricing. Better service.',
    body: 'Tech replaces the area manager layer. Savings go to cleaners, clients, and service quality.',
  },
]

const CARD_SCREENS: ScreenKey[] = [
  'evidence',   // Photo proof
  'overview',   // Vetted staff
  'overview',   // Supervisor sign-off
  'overview',   // Live dashboard
  'complaints', // Complaints resolved
  'history',    // Transparent billing
  'overview',   // Your team, rated
  'overview',   // Better pay
]

function swapLabel(el: HTMLElement, text: string) {
  gsap.to(el, {
    opacity: 0, y: -5, duration: 0.14, ease: 'power2.in',
    onComplete: () => {
      el.textContent = text
      gsap.fromTo(el, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' })
    },
  })
}

/**
 * Mr Brush Difference section.
 * Desktop: sticky phone left, scrolling portrait cards right.
 * Mobile : full-viewport pinned section — heading + phone (flex-1) + short card strip.
 *          Section title stays on screen throughout the horizontal card scroll.
 */
export function MrBrushDifference() {
  // Desktop
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])
  const labelRef  = useRef<HTMLSpanElement>(null)
  const mockupRef = useRef<HTMLDivElement>(null)
  // Mobile
  const mobileSectionRef = useRef<HTMLDivElement>(null)
  const mobileTrackRef   = useRef<HTMLDivElement>(null)
  const lastActiveRef    = useRef(-1)

  const [activeScreen, setActiveScreen] = useState<ScreenKey>('evidence')

  useEffect(() => {
    const cards     = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    const isDesktop = mockupRef.current?.offsetParent !== null

    const ctx = gsap.context(() => {

      // ── Desktop ──────────────────────────────────────────────────
      if (isDesktop) {
        if (mockupRef.current) {
          gsap.from(mockupRef.current, {
            scrollTrigger: { trigger: mockupRef.current, start: 'top 82%' },
            y: 50, opacity: 0, duration: 1.2, ease: 'power4.out',
          })
        }
        cards.forEach((card) => {
          gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 86%' },
            x: 60, y: 20, opacity: 0, duration: 1.0, ease: 'power4.out',
          })
        })
        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card, start: 'top center', end: 'bottom center',
            onEnter:     () => { if (labelRef.current) swapLabel(labelRef.current, points[i].title); setActiveScreen(CARD_SCREENS[i]) },
            onEnterBack: () => { if (labelRef.current) swapLabel(labelRef.current, points[i].title); setActiveScreen(CARD_SCREENS[i]) },
          })
        })
        return
      }

      // ── Mobile ───────────────────────────────────────────────────
      const section = mobileSectionRef.current
      const track   = mobileTrackRef.current
      if (!section || !track) return

      // Fill the viewport below the nav bar
      const navH = 80
      section.style.height = `${window.innerHeight - navH}px`

      // Measure after layout has settled
      ScrollTrigger.refresh()
      const trackW     = track.scrollWidth
      const viewW      = section.offsetWidth
      const scrollDist = Math.max(0, trackW - viewW)

      gsap.to(track, {
        x: -scrollDist,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: `top top+=${navH}`,
          end: `+=${Math.round(scrollDist * 0.6)}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.7,
          onUpdate: (self) => {
            const idx = Math.min(Math.floor(self.progress * points.length), points.length - 1)
            if (idx === lastActiveRef.current) return
            lastActiveRef.current = idx
            setActiveScreen(CARD_SCREENS[idx])
          },
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="why-us" className="bg-charcoal">

      {/* Heading — desktop only, sits above the desktop card grid */}
      <div className="hidden lg:block max-w-5xl mx-auto px-6 pt-24">
        <AnimatedHeading
          text="The Mr Brush difference"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center"
        />
      </div>

      {/* ── Mobile: full-viewport pinned section ─────────────────── */}
      {/* No overflow-hidden — GSAP pin + overflow-hidden causes clipping */}
      <div ref={mobileSectionRef} className="lg:hidden flex flex-col">

        {/* Heading — pinned with the section, always visible */}
        <div className="flex-none text-center px-6 pt-6 pb-3">
          <h2 className="font-heading font-bold text-ivory text-2xl leading-tight">
            The Mr Brush difference
          </h2>
        </div>

        {/* Phone zone — plain flex container, section bg shows directly behind the phone */}
        <div className="flex-1 flex items-center justify-center">
          {/* Full phone at 82% scale: 485px natural × 0.82 ≈ 398px tall, 248 × 0.82 = 203px wide */}
          <div style={{ width: 203, height: 398, overflow: 'visible' }}>
            <div style={{ transform: 'scale(0.82)', transformOrigin: 'top left' }}>
              <AppMockup activeScreen={activeScreen} onScreenChange={setActiveScreen} />
            </div>
          </div>
        </div>

        {/* Card ticker-tape — fixed height, no background (inherits section bg) */}
        <div className="flex-none h-[224px] overflow-hidden flex items-stretch py-3">
          <div
            ref={mobileTrackRef}
            className="flex gap-3 pl-4 items-stretch"
            style={{ willChange: 'transform' }}
          >
            {points.map((point, i) => (
              <div
                key={point.title}
                className="w-[74vw] flex-none flex flex-col gap-2 p-4 justify-between bg-slate border border-brass/15 rounded-2xl"
              >
                <div className="flex flex-col gap-2">
                  <div className="bg-green/20 rounded-lg p-2.5 w-fit">
                    <point.icon size={15} className="text-brass" />
                  </div>
                  <h3 className="font-heading font-semibold text-ivory text-[13px] leading-snug">
                    {point.title}
                  </h3>
                  <p className="font-body text-ivory/70 text-xs leading-relaxed line-clamp-3">
                    {point.body}
                  </p>
                </div>
                <span className="font-heading font-bold text-brass/10 text-4xl leading-none select-none self-end tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
            {/* Trailing space so last card doesn't sit flush at edge */}
            <div className="flex-none w-4" aria-hidden="true" />
          </div>
        </div>

      </div>

      {/* ── Desktop: sticky left phone + scrolling portrait cards ─── */}
      <div className="hidden lg:block py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 items-start">

            {/* LEFT — sticky phone + live label */}
            <div className="flex flex-col gap-5 sticky top-24">
              <div>
                <p className="font-body text-[11px] text-ivory/35 uppercase tracking-widest mb-1.5">Currently covering</p>
                <span ref={labelRef} className="font-heading font-semibold text-brass text-lg leading-snug block">
                  {points[0].title}
                </span>
              </div>
              <div ref={mockupRef}>
                <AppMockup activeScreen={activeScreen} onScreenChange={setActiveScreen} />
              </div>
            </div>

            {/* RIGHT — portrait cards */}
            <div className="flex flex-col gap-5">
              {points.map((point, i) => (
                <div
                  key={point.title}
                  ref={(el) => { cardRefs.current[i] = el }}
                  className="bg-slate border border-brass/15 rounded-2xl p-7 flex flex-col gap-4 min-h-[480px] justify-between"
                >
                  <div className="flex flex-col gap-4">
                    <div className="bg-green/20 rounded-lg p-3 w-fit">
                      <point.icon size={22} className="text-brass" />
                    </div>
                    <h3 className="font-heading font-semibold text-ivory text-xl leading-snug">{point.title}</h3>
                    <p className="font-body text-ivory/70 leading-relaxed">{point.body}</p>

                    {'ratings' in point && (
                      <div className="mt-2 bg-charcoal/50 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-brass flex items-center justify-center shrink-0">
                            <span className="font-heading font-bold text-charcoal text-xs">JD</span>
                          </div>
                          <div>
                            <p className="font-heading font-semibold text-ivory text-sm">Jamie D.</p>
                            <div className="flex gap-0.5 mt-0.5">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star key={j} size={11} className="fill-brass text-brass" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <blockquote className="font-body text-ivory/70 text-sm leading-relaxed">
                          "Thorough, punctual, and always leaves the kitchen spotless. Best cleaner we've had in years."
                        </blockquote>
                      </div>
                    )}
                  </div>

                  <span className="font-heading font-bold text-brass/10 text-8xl leading-none select-none self-end tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
