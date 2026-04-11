import { AlertCircle, EyeOff, MessageSquare, Lock } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const problems = [
  {
    icon: AlertCircle,
    title: 'No-shows with no warning',
    body: "Cleaners don't turn up — and nobody tells you until it's too late.",
  },
  {
    icon: EyeOff,
    title: 'No way to verify work was done',
    body: "You're paying for a service you can't confirm actually happened.",
  },
  {
    icon: MessageSquare,
    title: 'Issues go unreported',
    body: "Problems pile up because there's no easy way to flag them.",
  },
  {
    icon: Lock,
    title: 'Overpriced and subpar services with slow responses',
    body: "Paying premium rates for inconsistent work and a provider that takes days to respond.",
  },
]

export default function Problem() {
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="problem" className="py-24 bg-charcoal">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-12">
          Sound familiar?
        </h2>

        <div ref={ref} className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map(({ icon: Icon, title, body }) => (
            <div key={title}
              className="bg-slate border border-brass/15 rounded-xl p-6 flex flex-col gap-4">
              <Icon size={28} className="text-brass shrink-0" />
              <h3 className="font-heading font-semibold text-ivory text-lg">{title}</h3>
              <p className="font-body text-ivory/70 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
