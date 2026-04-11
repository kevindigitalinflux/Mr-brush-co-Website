import { Zap, ShieldCheck, FileText, CheckCircle2, Loader2, TrendingUp } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const points = [
  {
    icon: Zap,
    title: 'Tech-powered automation',
    body: 'GPS check-ins, digital task lists, live photo evidence of completed sections, and automated reporting after every visit.',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted, consistent staff',
    body: 'DBS-checked, trained, and assigned to your building long-term.',
  },
  {
    icon: FileText,
    title: 'Transparent billing & reporting',
    body: 'See exactly what was done, when, and by whom. Invoices match reports.',
  },
  {
    icon: TrendingUp,
    title: 'Better pay. Better pricing. Better service.',
    body: 'By leveraging our tech background to eliminate the area manager layer, we pass the savings three ways: higher wages for our cleaners, lower prices for our clients, and investment back into our CRM and service quality.',
  },
]

const dashRows = [
  { Icon: CheckCircle2, iconClass: 'text-emerald-400', label: 'Floor 3 — Cleaned',      time: '09:14 AM', action: null,       shimmer: false },
  { Icon: CheckCircle2, iconClass: 'text-emerald-400', label: 'Reception — Cleaned',    time: '08:47 AM', action: null,       shimmer: false },
  { Icon: Loader2,      iconClass: 'text-brass animate-spin', label: 'Kitchen — In Progress', time: '09:30 AM', action: null, shimmer: true },
  { Icon: FileText,     iconClass: 'text-ivory/50', label: 'Weekly Report Ready', time: '',         action: 'View →',  shimmer: false },
]

export default function MrBrushDifference() {
  const sectionRef = useScrollAnimation<HTMLDivElement>()
  const cardRef    = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="why-us" className="py-24 bg-charcoal/95">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-16">
          The Mr Brush difference
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Feature points — stagger-children handles visibility; no scroll-fade needed */}
          <div ref={sectionRef} className="stagger-children flex flex-col gap-8">
            {points.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="bg-green/20 rounded-lg p-2.5 shrink-0 mt-0.5">
                  <Icon size={20} className="text-brass" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-ivory mb-1">{title}</h3>
                  <p className="font-body text-ivory/70 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard preview card */}
          <div ref={cardRef}
            className="scroll-fade bg-slate border border-brass/20 rounded-xl overflow-hidden">

            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brass/10">
              <span className="font-body text-sm text-ivory/60">Client Dashboard Preview</span>
              <div className="flex items-center gap-2">
                <span
                  className="live-pulse w-2 h-2 rounded-full bg-green inline-block"
                  aria-hidden="true"
                />
                <span className="font-body text-xs text-green font-semibold">Live</span>
              </div>
            </div>

            {/* Status rows */}
            <div className="divide-y divide-brass/10">
              {dashRows.map(({ Icon, iconClass, label, time, action, shimmer }, i) => (
                <div key={i}
                  className={`dash-row flex items-center gap-3 px-5 py-3.5 ${shimmer ? 'row-shimmer' : ''}`}>
                  <Icon size={18} className={`shrink-0 ${iconClass}`} />
                  <span className="font-body text-sm text-ivory flex-1">{label}</span>
                  {action
                    ? <span className="font-body text-xs text-brass cursor-pointer hover:underline">{action}</span>
                    : <span className="font-body text-xs text-ivory/40">{time}</span>
                  }
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
