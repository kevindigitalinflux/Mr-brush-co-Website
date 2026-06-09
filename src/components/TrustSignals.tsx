import { useEffect, useRef } from 'react'
import { ShieldCheck, Lock, Camera, UserCheck, Smartphone, FileText } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'

const signals = [
  {
    icon: ShieldCheck,
    label: 'DBS Checked Staff',
    body: 'Every cleaner is background-checked and vetted before their first shift on your site.',
  },
  {
    icon: Lock,
    label: 'Fully Insured',
    body: 'Public liability cover in place. You are protected from day one, no exceptions.',
  },
  {
    icon: Camera,
    label: 'Photo Proof on Every Visit',
    body: 'Timestamped, zone-by-zone photo evidence submitted after every single clean, not just on request.',
  },
  {
    icon: UserCheck,
    label: 'Dedicated Supervisor',
    body: 'One named supervisor reviews all evidence and resolves issues before they reach you.',
  },
  {
    icon: Smartphone,
    label: 'In-House CRM App',
    body: 'Live dashboard, complaint tracking, evidence feed, and weekly reports, all in one place built for your site.',
  },
  {
    icon: FileText,
    label: 'Transparent Monthly Billing',
    body: 'Invoices match visit logs exactly. See what was done, when, and by whom, every time.',
  },
]

/** Trust Signals section — six trust tiles with supporting copy */
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

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {signals.map(({ icon: Icon, label, body }) => (
            <div key={label} className="trust-tile bg-slate border border-brass/10 rounded-2xl p-6 flex flex-col gap-4">
              <div className="bg-green/15 rounded-xl w-12 h-12 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-brass" />
              </div>
              <div>
                <p className="font-heading font-semibold text-ivory text-sm mb-1.5">{label}</p>
                <p className="font-body text-ivory/55 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
