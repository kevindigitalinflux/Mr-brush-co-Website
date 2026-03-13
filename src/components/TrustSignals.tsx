import { ShieldCheck, Lock, BarChart2, UserCheck } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const signals = [
  { icon: ShieldCheck, label: 'DBS Checked Staff' },
  { icon: Lock,        label: 'Fully Insured'      },
  { icon: BarChart2,   label: 'Real-time Reporting' },
  { icon: UserCheck,   label: 'Dedicated Supervisor'},
]

export default function TrustSignals() {
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="trust" className="py-24 bg-charcoal/95">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-12">
          Why clients trust us
        </h2>

        <div ref={ref} className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-6">
          {signals.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-4">
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
