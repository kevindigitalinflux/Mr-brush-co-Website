import { ShieldCheck, Lock, Camera, UserCheck, Smartphone, FileText } from 'lucide-react'
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

// Duplicate for seamless loop. Each card is w-[280px] + mr-6 (24px) = 304px.
// translateX(-50%) shifts by exactly 6 × 304 = 1824px → back to start.
const loopedSignals = [...signals, ...signals]

/** Trust signals — infinite marquee on deep green background with alpha edge masks */
export function TrustSignals() {
  return (
    <section id="trust" className="py-24 bg-green">
      <div className="max-w-4xl mx-auto px-6 mb-14">
        <AnimatedHeading
          text="Why clients trust us"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center"
        />
      </div>

      {/* Marquee track — overflow clipped, alpha mask on edges */}
      <div className="overflow-hidden marquee-mask">
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
    </section>
  )
}
