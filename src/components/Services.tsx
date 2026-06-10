import { useEffect, useRef } from 'react'
import { Building2, DoorOpen, Sparkles, Plus } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'

const services = [
  {
    icon: Building2,
    title: 'Office Cleaning',
    body: 'Daily or weekly cleans tailored to your office layout and hours, consistent, reliable, accountable.',
    img: '/service-office-cleaning.png',
  },
  {
    icon: DoorOpen,
    title: 'Communal Areas',
    body: 'Reception, kitchens, corridors and shared spaces kept pristine throughout the working day.',
    img: '/service-kitchen-cleaning.png',
  },
  {
    icon: Sparkles,
    title: 'Deep Cleans',
    body: 'Scheduled or one-off deep cleans for carpets, upholstery, and hard-to-reach areas.',
    img: '/service-deep-cleaning.png',
  },
  {
    icon: Plus,
    title: 'Flexible Add-ons',
    body: 'Waste management, washroom supplies, pest control, added as and when you need them.',
    img: '/service-flexible-addons.png',
  },
]

/** Services section — image cards listing available cleaning service types */
export function Services() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const cards = grid.querySelectorAll<HTMLElement>('.service-card')
    const ctx = gsap.context(() => {
      cards.forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 86%' },
          y: 60,
          scale: 0.96,
          opacity: 0,
          duration: 1.0,
          delay: i * 0.08,
          ease: 'power4.out',
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="services" className="py-24 bg-charcoal">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedHeading
          text="Our services"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-12"
        />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, title, body, img }) => (
            <div key={title}
              className="service-card group bg-slate border border-brass/15 hover:border-brass/40 rounded-xl overflow-hidden flex flex-col transition-colors duration-200">

              {/* Image — same overlay treatment as Sound Familiar cards */}
              <div className="relative overflow-hidden h-52 shrink-0">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate/80 via-slate/20 to-transparent" />
                <div className="absolute inset-0 bg-[#2F4A3D]/15" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="bg-green/20 rounded-lg p-3 w-fit">
                  <Icon size={24} className="text-brass" />
                </div>
                <h3 className="font-heading font-semibold text-ivory text-lg">{title}</h3>
                <p className="font-body text-ivory/70 text-sm leading-relaxed">{body}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
