import { useEffect, useRef, Fragment } from 'react'
import { Users, Camera, ShieldCheck, LayoutDashboard, FileText, MessageSquare } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'Your dedicated team',
    body: 'We assign a consistent, DBS-checked team to your building long-term. You get familiar faces who know your site, not a different stranger every visit.',
  },
  {
    number: '02',
    icon: Camera,
    title: 'Photo proof after every clean',
    body: 'After each zone is completed, your team submits timestamped photo evidence through the Mr Brush app, zone by zone, every single visit.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Supervisor review before it reaches you',
    body: 'Your dedicated supervisor reviews all photo evidence before it lands in your dashboard. Issues are caught and addressed at our end, not escalated to yours.',
  },
  {
    number: '04',
    icon: LayoutDashboard,
    title: 'Live dashboard, full visibility',
    body: 'Live zone status, timestamped photo evidence, supervisor notes, and flagged issues, all visible in your client dashboard the moment each zone is completed.',
  },
  {
    number: '05',
    icon: FileText,
    title: 'Automated weekly reports',
    body: 'Every week, a compiled report lands in your dashboard automatically, visit logs, photo evidence, and resolved flags. No chasing. No calls.',
  },
  {
    number: '06',
    icon: MessageSquare,
    title: 'Quick, seamless complaint resolution',
    body: 'File a complaint straight from the Mr Brush app and watch our team address and resolve it in real time. Full transparency from receipt to resolution, no silence, no guesswork.',
  },
]

/**
 * How It Works — stacking card scroll effect.
 *
 * All cards + spacers live in ONE container div. Because they share a
 * containing block, every card's sticky range extends to the container
 * bottom — so all stacked cards remain pinned simultaneously.
 * Sibling <div> spacers (not margins) create the scroll distance between
 * cards. GSAP scrubs a scale+opacity on each card as the next one arrives.
 */
export function HowItWorks() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i >= cards.length - 1) return
        gsap.to(card, {
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top 85%',
            end: 'top top+=96',
            scrub: true,
          },
          scale: 0.92,
          opacity: 0.45,
          ease: 'none',
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" className="py-24 bg-charcoal">
      <div className="max-w-2xl mx-auto px-6">
        <AnimatedHeading
          text="How it works"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-16"
        />

        <div>
          {steps.map((step, i) => (
            <Fragment key={step.number}>

              {/* Sticky card — top-24 clears the navbar */}
              <div
                ref={(el) => { cardRefs.current[i] = el }}
                className="sticky top-24"
                style={{ zIndex: 20 + i }}
              >
                <div className="bg-slate border-t-2 border-t-brass/60 border-x border-b border-brass/15 rounded-2xl p-8 shadow-[0_28px_72px_rgba(0,0,0,0.6)]">
                  <div className="flex items-start gap-6">

                    <div className="flex flex-col items-center gap-3 shrink-0 w-14">
                      <span className="font-heading font-bold text-brass/25 text-5xl leading-none select-none tabular-nums">
                        {step.number}
                      </span>
                      <div className="bg-green/20 rounded-lg p-3">
                        <step.icon size={20} className="text-brass" />
                      </div>
                    </div>

                    <div className="flex-1 pt-1">
                      <h3 className="font-heading font-semibold text-ivory text-xl leading-snug mb-3">
                        {step.title}
                      </h3>
                      <p className="font-body text-ivory/65 leading-relaxed">
                        {step.body}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Sibling spacer — extends the shared container so the card above stays sticky */}
              {i < steps.length - 1 && (
                <div className="h-[50vh]" aria-hidden="true" />
              )}

            </Fragment>
          ))}
        </div>

      </div>
    </section>
  )
}
