import { useEffect, useRef } from 'react'
import { Star } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'

const badges = [
  '⭐ Staff incentivised by ratings',
  '📋 Feedback logged automatically',
  '🔄 Poor performance flagged instantly',
]

/** Ratings section — review cards and badge pills showing social proof */
export function Ratings() {
  const cardRef   = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card      = cardRef.current
    const container = badgesRef.current

    const ctx = gsap.context(() => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 84%' },
          scale: 0.96,
          y: 50,
          opacity: 0,
          duration: 1.1,
          ease: 'power4.out',
        })
      }

      if (container) {
        const items = container.querySelectorAll<HTMLElement>('span')
        gsap.from(items, {
          scrollTrigger: { trigger: container, start: 'top 88%' },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="ratings" className="py-24 bg-charcoal">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <AnimatedHeading
          text="Your team, rated by you"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl mb-4"
        />
        <p className="font-body text-ivory/60 mb-12 leading-relaxed">
          After every clean, you rate your team. That feedback directly shapes their
          performance reviews — keeping standards high, automatically.
        </p>

        {/* Review card */}
        <div ref={cardRef}
          className="bg-slate border border-brass/20 rounded-2xl p-8 text-left mb-8">
          {/* Reviewer */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-brass flex items-center justify-center shrink-0">
              <span className="font-heading font-bold text-charcoal text-sm">JD</span>
            </div>
            <div>
              <p className="font-heading font-semibold text-ivory text-sm">Jamie D.</p>
              <p className="font-body text-ivory/50 text-xs">Lead Cleaner</p>
            </div>
          </div>

          {/* Stars */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} className="fill-brass text-brass" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="font-body text-ivory/80 leading-relaxed mb-4">
            "Thorough, punctual, and always leaves the kitchen spotless. Best cleaner
            we've had in years."
          </blockquote>

          {/* Attribution */}
          <p className="font-body text-ivory/40 text-xs">
            Submitted Tuesday 4 March · Floor 3
          </p>
        </div>

        {/* Badges */}
        <div ref={badgesRef} className="flex flex-wrap justify-center gap-3">
          {badges.map(badge => (
            <span key={badge}
              className="bg-charcoal border border-brass/20 rounded-full px-4 py-2 font-body text-sm text-ivory/80">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
