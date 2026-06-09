import { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Camera, ShieldCheck, Eye, LayoutDashboard, MessageSquare,
  FileText, Star, TrendingUp, CheckCircle2, Loader2,
} from 'lucide-react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'

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

const dashRows = [
  { Icon: CheckCircle2, iconClass: 'text-emerald-400', label: 'Floor 3 — Cleaned',       time: '09:14 AM', action: null,      shimmer: false },
  { Icon: CheckCircle2, iconClass: 'text-emerald-400', label: 'Reception — Cleaned',     time: '08:47 AM', action: null,      shimmer: false },
  { Icon: Loader2,      iconClass: 'text-brass animate-spin', label: 'Kitchen — In Progress', time: '09:30 AM', action: null, shimmer: true  },
  { Icon: FileText,     iconClass: 'text-ivory/50',    label: 'Weekly Report Ready',      time: '',         action: 'View →', shimmer: false },
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

/** Mr Brush Difference — sticky dashboard left, scrolling portrait cards right.
 *  Heading updates as each card reaches center viewport (Sticky Content Switch). */
export function MrBrushDifference() {
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])
  const labelRef  = useRef<HTMLSpanElement>(null)
  const dashRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    const label = labelRef.current
    const dash  = dashRef.current

    const ctx = gsap.context(() => {
      // Dashboard entrance from left
      if (dash) {
        gsap.from(dash, {
          scrollTrigger: { trigger: dash, start: 'top 82%', onEnter: () => dash.classList.add('animate-in') },
          x: -50, opacity: 0, duration: 1.2, ease: 'power4.out',
        })
      }

      // Portrait cards entrance from right
      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 86%' },
          x: 60, y: 20, opacity: 0, duration: 1.0, ease: 'power4.out',
        })
      })

      // Sticky Content Switch — swap label as each card reaches viewport centre
      if (label) {
        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top center',
            end: 'bottom center',
            onEnter:     () => swapLabel(label, points[i].title),
            onEnterBack: () => swapLabel(label, points[i].title),
          })
        })
      }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — sticky dashboard + live label */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-5">
            <div>
              <p className="font-body text-[11px] text-ivory/35 uppercase tracking-widest mb-1.5">Currently covering</p>
              <span ref={labelRef} className="font-heading font-semibold text-brass text-lg leading-snug block">
                {points[0].title}
              </span>
            </div>

            <div ref={dashRef} className="bg-slate border border-brass/20 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-brass/10">
                <span className="font-body text-sm text-ivory/60">Client Dashboard Preview</span>
                <div className="flex items-center gap-2">
                  <span className="live-pulse w-2 h-2 rounded-full bg-green inline-block" aria-hidden="true" />
                  <span className="font-body text-xs text-green font-semibold">Live</span>
                </div>
              </div>
              <div className="divide-y divide-brass/10">
                {dashRows.map(({ Icon, iconClass, label, time, action, shimmer }, i) => (
                  <div key={i} className={`dash-row flex items-center gap-3 px-5 py-3.5 ${shimmer ? 'row-shimmer' : ''}`}>
                    <Icon size={18} className={`shrink-0 ${iconClass}`} />
                    <span className="font-body text-sm text-ivory flex-1">{label}</span>
                    {action
                      ? <span className="font-body text-xs text-brass cursor-pointer hover:underline">{action}</span>
                      : <span className="font-body text-xs text-ivory/40">{time}</span>
                    }
                  </div>
                ))}
              </div>
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
    </section>
  )
}
