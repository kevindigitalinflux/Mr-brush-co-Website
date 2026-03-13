import { Users, Smartphone, LayoutDashboard } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'Your dedicated team',
    body: 'We assign a consistent, vetted team to your building so you get familiar faces — not strangers every week.',
  },
  {
    number: '02',
    icon: Smartphone,
    title: 'Real-time check-ins',
    body: 'They check in and out via our app — you get real-time notifications every visit, without lifting a finger.',
  },
  {
    number: '03',
    icon: LayoutDashboard,
    title: 'Your dashboard, your control',
    body: 'Manage everything from your client dashboard — schedules, reports, flags, and billing in one place.',
  },
]

export default function HowItWorks() {
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="how-it-works" className="py-24 bg-charcoal/95">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-16">
          How it works
        </h2>

        <div ref={ref} className="stagger-children-120 flex flex-col">
          {steps.map(({ number, icon: Icon, title, body }, i) => (
            <div key={number}>
              <div className="flex gap-6 items-start py-10">
                {/* Step number */}
                <span className="font-heading font-bold text-brass text-5xl md:text-6xl opacity-25 leading-none select-none w-16 shrink-0 text-right">
                  {number}
                </span>

                <div className="flex flex-col gap-4 flex-1">
                  <div className="bg-green/20 rounded-lg p-3 w-fit">
                    <Icon size={24} className="text-brass" />
                  </div>
                  <h3 className="font-heading font-semibold text-ivory text-xl">{title}</h3>
                  <p className="font-body text-ivory/70 leading-relaxed">{body}</p>
                </div>
              </div>

              {i < steps.length - 1 && (
                <hr className="border-brass/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
