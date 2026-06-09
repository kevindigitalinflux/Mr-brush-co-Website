import { useEffect, useRef } from 'react'
import { ShieldCheck, Lock, BarChart2, UserCheck } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'

const signals = [
  { icon: ShieldCheck, label: 'DBS Checked Staff' },
  { icon: Lock,        label: 'Fully Insured'      },
  { icon: BarChart2,   label: 'Real-time Reporting' },
  { icon: UserCheck,   label: 'Dedicated Supervisor'},
]

/** Trust Signals section — icon tiles reinforcing reliability and security */
export function TrustSignals() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const tiles = grid.querySelectorAll<HTMLElement>('.trust-tile')
    const ctx = gsap.context(() => {
      gsap.from(tiles, {
        scrollTrigger: { trigger: grid, start: 'top 84%' },
        y: 55,
        scale: 0.92,
        opacity: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: 'power4.out',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="trust" className="py-24 bg-charcoal/95">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedHeading
          text="Why clients trust us"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-12"
        />

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {signals.map(({ icon: Icon, label }) => (
            <div key={label} className="trust-tile flex flex-col items-center gap-4">
              <div className="bg-green/15 rounded-full w-16 h-16 flex items-center justify-center">
                <Icon size={26} className="text-brass" />
              </div>
              <p className="font-heading font-semibold text-ivory text-sm text-center">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
