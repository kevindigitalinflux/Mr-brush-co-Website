import { Building2, DoorOpen, Sparkles, Plus } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const services = [
  {
    icon: Building2,
    title: 'Office Cleaning',
    body: 'Daily or weekly cleans tailored to your office layout and hours — consistent, reliable, accountable.',
  },
  {
    icon: DoorOpen,
    title: 'Communal Areas',
    body: 'Reception, kitchens, corridors and shared spaces kept pristine throughout the working day.',
  },
  {
    icon: Sparkles,
    title: 'Deep Cleans',
    body: 'Scheduled or one-off deep cleans for carpets, upholstery, and hard-to-reach areas.',
  },
  {
    icon: Plus,
    title: 'Flexible Add-ons',
    body: 'Waste management, washroom supplies, pest control — added as and when you need them.',
  },
]

export default function Services() {
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="services" className="py-24 bg-charcoal">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-12">
          Our services
        </h2>

        <div ref={ref} className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, title, body }) => (
            <div key={title}
              className="bg-slate border border-brass/15 hover:border-brass/40 rounded-xl p-6 flex flex-col gap-4 transition-colors duration-200">
              <div className="bg-green/20 rounded-lg p-3 w-fit">
                <Icon size={24} className="text-brass" />
              </div>
              <h3 className="font-heading font-semibold text-ivory text-lg">{title}</h3>
              <p className="font-body text-ivory/70 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
