import { useEffect, useRef } from 'react'
import { Zap, ShieldCheck, FileText, CheckCircle2, Loader2, TrendingUp } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'

const points = [
  {
    icon: Zap,
    title: 'Photo proof after every clean',
    body: 'Every zone, every visit — timestamped photos reviewed by your dedicated supervisor before issues have a chance to reach you.',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted, consistent staff',
    body: 'DBS-checked, trained, and assigned to your building long-term.',
  },
  {
    icon: FileText,
    title: 'Transparent billing & reporting',
    body: 'See exactly what was done, when, and by whom. Invoices match reports.',
  },
  {
    icon: TrendingUp,
    title: 'Better pay. Better pricing. Better service.',
    body: 'By leveraging our tech background to eliminate the area manager layer, we pass the savings three ways: higher wages for our cleaners, lower prices for our clients, and investment back into our CRM and service quality.',
  },
]

const dashRows = [
  { Icon: CheckCircle2, iconClass: 'text-emerald-400', label: 'Floor 3 — Cleaned',      time: '09:14 AM', action: null,       shimmer: false },
  { Icon: CheckCircle2, iconClass: 'text-emerald-400', label: 'Reception — Cleaned',    time: '08:47 AM', action: null,       shimmer: false },
  { Icon: Loader2,      iconClass: 'text-brass animate-spin', label: 'Kitchen — In Progress', time: '09:30 AM', action: null, shimmer: true },
  { Icon: FileText,     iconClass: 'text-ivory/50', label: 'Weekly Report Ready', time: '',         action: 'View →',  shimmer: false },
]

/** Mr Brush Difference section — differentiators with animated dashboard preview card */
export function MrBrushDifference() {
  const pointsRef = useRef<HTMLDivElement>(null)
  const cardRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pointsEl = pointsRef.current
    const cardEl   = cardRef.current

    const ctx = gsap.context(() => {
      if (pointsEl) {
        const items = pointsEl.querySelectorAll<HTMLElement>('.point-item')
        items.forEach((el, i) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%' },
            x: -50,
            y: 20,
            opacity: 0,
            duration: 1.0,
            delay: i * 0.1,
            ease: 'power4.out',
          })
        })
      }

      if (cardEl) {
        gsap.from(cardEl, {
          scrollTrigger: {
            trigger: cardEl,
            start: 'top 82%',
            onEnter: () => cardEl.classList.add('animate-in'),
          },
          scale: 0.93,
          y: 55,
          opacity: 0,
          duration: 1.3,
          ease: 'power4.out',
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

          {/* Feature points */}
          <div ref={pointsRef} className="flex flex-col gap-8">
            {points.map(({ icon: Icon, title, body }) => (
              <div key={title} className="point-item flex gap-4 items-start">
                <div className="bg-green/20 rounded-lg p-2.5 shrink-0 mt-0.5">
                  <Icon size={20} className="text-brass" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-ivory mb-1">{title}</h3>
                  <p className="font-body text-ivory/70 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard preview card */}
          <div ref={cardRef}
            className="bg-slate border border-brass/20 rounded-xl overflow-hidden">

            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brass/10">
              <span className="font-body text-sm text-ivory/60">Client Dashboard Preview</span>
              <div className="flex items-center gap-2">
                <span
                  className="live-pulse w-2 h-2 rounded-full bg-green inline-block"
                  aria-hidden="true"
                />
                <span className="font-body text-xs text-green font-semibold">Live</span>
              </div>
            </div>

            {/* Status rows */}
            <div className="divide-y divide-brass/10">
              {dashRows.map(({ Icon, iconClass, label, time, action, shimmer }, i) => (
                <div key={i}
                  className={`dash-row flex items-center gap-3 px-5 py-3.5 ${shimmer ? 'row-shimmer' : ''}`}>
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
      </div>
    </section>
  )
}
