import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'
import { MobileTrustCarousel } from './MobileTrustCarousel'
import { trustSignals } from '../lib/trustSignals'

const signals = trustSignals

// Duplicate for seamless loop. Each card is w-[280px] + mr-6 (24px) = 304px.
// translateX(-50%) shifts by exactly 6 × 304 = 1824px → back to start.
const loopedSignals = [...signals, ...signals]

/** Trust signals — infinite marquee with scroll-triggered background reveal and entrance animation */
export function TrustSignals() {
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (carouselRef.current) {
        gsap.from(carouselRef.current, {
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 82%',
          },
          opacity: 0,
          y: 40,
          duration: 1.0,
          ease: 'power3.out',
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="trust" className="py-24 bg-charcoal">
      <div className="max-w-4xl mx-auto px-6 mb-14">
        <AnimatedHeading
          text="Why clients trust us"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center"
        />
      </div>

      {/* Desktop: infinite marquee — hidden on mobile */}
      <div ref={carouselRef} className="hidden md:block overflow-hidden marquee-mask">
        <div className="flex marquee-track">
          {loopedSignals.map((signal, i) => (
            <div
              key={i}
              aria-hidden={i >= signals.length}
              className="w-[280px] shrink-0 mr-6 bg-charcoal/50 border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="bg-white/10 rounded-xl w-12 h-12 flex items-center justify-center shrink-0">
                <signal.icon size={22} className="text-brass" />
              </div>
              <div>
                <p className="font-heading font-semibold text-ivory text-sm mb-1.5">{signal.label}</p>
                <p className="font-body text-ivory/55 text-sm leading-relaxed">{signal.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: swipe carousel — hidden on desktop */}
      <div className="md:hidden">
        <MobileTrustCarousel />
      </div>
    </section>
  )
}
