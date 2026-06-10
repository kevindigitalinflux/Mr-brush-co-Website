import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Camera, ShieldCheck, Eye, LayoutDashboard, MessageSquare, FileText, Star, TrendingUp } from 'lucide-react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'
import { AppMockup, type ScreenKey } from './AppMockup'

type Point = {
  icon: LucideIcon
  title: string
  body: string
  ratings?: true
}

const points: Point[] = [
  {
    icon: Camera,
    title: 'Photo proof after every clean',
    body: 'Every zone, every visit, timestamped photos submitted through our app and reviewed by your supervisor before issues have a chance to reach you.',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted, consistent staff',
    body: 'DBS-checked, trained, and assigned to your building long-term. A team that knows your site, not a rotating roster of strangers.',
  },
  {
    icon: Eye,
    title: 'Supervisor sign-off, every visit',
    body: 'Your dedicated supervisor reviews all evidence before it reaches you. Issues are caught and resolved at our end, not escalated to yours.',
  },
  {
    icon: LayoutDashboard,
    title: 'Live dashboard, full visibility',
    body: 'Live zone status, timestamped evidence, and supervisor notes visible the moment each clean is completed. Nothing hidden, nothing delayed.',
  },
  {
    icon: MessageSquare,
    title: 'Complaints resolved, not just logged',
    body: 'File a complaint directly from the Mr Brush app. Track exactly how and when our team resolves it, in real time.',
  },
  {
    icon: FileText,
    title: 'Transparent billing and reporting',
    body: 'See exactly what was done, when, and by whom. Invoices match reports every time. No surprises, no disputes.',
  },
  {
    icon: Star,
    title: 'Your team, rated by you',
    body: 'After every clean, rate your team directly. That feedback shapes performance reviews and keeps standards consistently high, automatically.',
    ratings: true,
  },
  {
    icon: TrendingUp,
    title: 'Better pay. Better pricing. Better service.',
    body: 'By cutting out the area manager layer with technology, we pass the savings three ways: higher cleaner wages, lower client prices, and reinvestment in service quality.',
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

/** Mr Brush Difference section.
 *  Desktop: sticky phone left, scrolling portrait cards right.
 *  Mobile: sticky scaled phone top, compact cards below — screen switches on scroll. */
export function MrBrushDifference() {
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([])
  const labelRef      = useRef<HTMLSpanElement>(null)
  const mobileLabelRef = useRef<HTMLSpanElement>(null)
  const mockupRef     = useRef<HTMLDivElement>(null)
  const [activeScreen, setActiveScreen] = useState<ScreenKey>('evidence')

  useEffect(() => {
    const cards    = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    const isDesktop = mockupRef.current?.offsetParent !== null

    const ctx = gsap.context(() => {
      // Desktop phone entrance
      if (isDesktop && mockupRef.current) {
        gsap.from(mockupRef.current, {
          scrollTrigger: { trigger: mockupRef.current, start: 'top 82%' },
          y: 50, opacity: 0, duration: 1.2, ease: 'power4.out',
        })
      }

      // Card entrance animations — all screen sizes
      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 86%' },
          x: 60, y: 20, opacity: 0, duration: 1.0, ease: 'power4.out',
        })
      })

      // Screen-switch triggers — drive both the desktop sticky panel and mobile sticky phone
      cards.forEach((card, i) => {
        // On mobile the phone sits in a sticky top panel; trigger earlier to match the
        // visible area below it. Desktop keeps the center-viewport trigger.
        const start = isDesktop ? 'top center' : 'top 78%'
        const end   = isDesktop ? 'bottom center' : 'bottom 22%'
        ScrollTrigger.create({
          trigger: card, start, end,
          onEnter: () => {
            if (labelRef.current) swapLabel(labelRef.current, points[i].title)
            if (mobileLabelRef.current) swapLabel(mobileLabelRef.current, points[i].title)
            setActiveScreen(CARD_SCREENS[i])
          },
          onEnterBack: () => {
            if (labelRef.current) swapLabel(labelRef.current, points[i].title)
            if (mobileLabelRef.current) swapLabel(mobileLabelRef.current, points[i].title)
            setActiveScreen(CARD_SCREENS[i])
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="why-us" className="py-24 bg-charcoal/95">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedHeading
          text="The Mr Brush difference"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-16"
        />

        {/* ── Mobile sticky phone (below lg) ─────────────────────────────── */}
        {/* Phone scaled to 72% — visual 179×349 px, nav clears top-20 (80px) */}
        <div className="lg:hidden sticky top-20 z-10 bg-charcoal flex flex-col items-center pt-2 pb-5 -mx-6 px-6 mb-6">
          <div style={{ width: 179, height: 349, overflow: 'visible' }}>
            <div style={{ transform: 'scale(0.72)', transformOrigin: 'top left' }}>
              <AppMockup activeScreen={activeScreen} onScreenChange={setActiveScreen} />
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="font-body text-[10px] text-ivory/35 uppercase tracking-widest mb-1">Currently showing</p>
            <span ref={mobileLabelRef} className="font-heading font-semibold text-brass text-sm leading-snug block">
              {points[0].title}
            </span>
          </div>
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — sticky app mockup + live label (desktop only) */}
          <div className="hidden lg:flex flex-col gap-5 lg:sticky lg:top-24">
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

          {/* RIGHT — portrait cards (all screen sizes) */}
          <div className="flex flex-col gap-5">
            {points.map((point, i) => (
              <div
                key={point.title}
                ref={(el) => { cardRefs.current[i] = el }}
                className="bg-slate border border-brass/15 rounded-2xl p-6 md:p-7 flex flex-col gap-4 min-h-[200px] md:min-h-[480px] justify-between"
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

                <span className="font-heading font-bold text-brass/10 text-6xl md:text-8xl leading-none select-none self-end tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
