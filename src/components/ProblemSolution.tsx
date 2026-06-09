import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'

/**
 * Reference images — replace with commissioned photography before launch.
 * Current: free-tier Unsplash via picsum.photos (seeded for consistency).
 */
const pairs = [
  {
    numeric: 47,
    suffix: '%+',
    statLabel: 'of building complaints are toilet-related',
    problem: 'Problems surface after the damage is done',
    body: 'By the time a client escalates, trust is already damaged.',
    colSpan: 'md:col-span-4',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=70',
    imgAlt: 'Modern office corridor',
  },
  {
    numeric: 49,
    suffix: '%',
    statLabel: 'fewer complaints with visible cleaning records',
    problem: "You're paying for a service you can't verify",
    body: "Most clients take their provider's word for it — every single visit.",
    colSpan: 'md:col-span-2',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=70',
    imgAlt: 'Person reviewing records on tablet',
  },
  {
    numeric: 58,
    suffix: '%',
    statLabel: 'cite paper stock as their biggest complaint',
    problem: 'Missed consumables create embarrassing failures',
    body: '51% also flag bin collection. Small misses, outsized impressions.',
    colSpan: 'md:col-span-2',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=70',
    imgAlt: 'Cleaning supplies',
  },
  {
    numeric: 40,
    suffix: '%',
    statLabel: 'of complaints avoidable with faster response',
    problem: 'Slow responses turn small issues into lost contracts',
    body: "It's the silence after the problem — not the problem itself — that breaks trust.",
    colSpan: 'md:col-span-4',
    img: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=900&q=70',
    imgAlt: 'Professional meeting in office',
  },
]

type Pair = typeof pairs[0]

/** Animates a number from 0 → target when the card scrolls into view */
function CountUp({
  target,
  suffix,
  triggerRef,
}: {
  target: number
  suffix: string
  triggerRef: React.RefObject<HTMLDivElement>
}) {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = spanRef.current
    const trigger = triggerRef.current
    if (!el || !trigger) return

    const ctx = gsap.context(() => {
      const obj = { val: 0 }
      gsap.to(obj, {
        scrollTrigger: { trigger, start: 'top 84%' },
        val: target,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = Math.round(obj.val) + suffix
        },
      })
    })

    return () => ctx.revert()
  }, [target, suffix, triggerRef])

  return <span ref={spanRef}>0{suffix}</span>
}

/** Single bento card — reference image + count-up stat + problem copy */
function PairCard({ pair, index }: { pair: Pair; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 87%' },
        y: 50,
        opacity: 0,
        duration: 1.0,
        delay: (index % 2) * 0.14,
        ease: 'power4.out',
      })
    })

    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl border border-brass/15 bg-slate flex flex-col ${pair.colSpan}`}
    >
      {/* Reference image — replace with actual photography before launch */}
      <div className="relative overflow-hidden h-48 md:h-52 shrink-0">
        <img
          src={pair.img}
          alt={pair.imgAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient so text below reads clearly against any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate/80 via-slate/20 to-transparent" />
      </div>

      {/* Card body */}
      <div className="px-6 pt-5 pb-6 flex flex-col flex-1">
        {/* Count-up stat */}
        <div className="mb-4">
          <p
            className="font-heading font-extrabold text-brass leading-none"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
          >
            <CountUp target={pair.numeric} suffix={pair.suffix} triggerRef={ref as React.RefObject<HTMLDivElement>} />
          </p>
          <p className="font-body text-brass/55 text-[11px] uppercase tracking-widest mt-1.5 leading-snug">
            {pair.statLabel}
          </p>
        </div>

        {/* Problem */}
        <h3 className="font-heading font-semibold text-ivory text-[1rem] leading-snug mb-2">
          {pair.problem}
        </h3>
        <p className="font-body text-ivory/55 text-sm leading-relaxed">
          {pair.body}
        </p>
      </div>
    </div>
  )
}

/** Problem/Solution section — bento grid with count-up stats and reference photography */
export function ProblemSolution() {
  return (
    <section id="problem" className="py-24 bg-charcoal">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedHeading
          text="Sound familiar?"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-4"
        />
        <p className="font-body text-ivory/50 text-sm text-center mb-14 max-w-xl mx-auto leading-relaxed">
          These aren't edge cases — they're industry-wide problems. Here's the data.
        </p>

        {/* Bento grid — mirrors features-6: 6-col desktop ([4+2] and [2+4] rows), 2-col tablet, stacked mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          {pairs.map((pair, i) => (
            <PairCard key={i} pair={pair} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
