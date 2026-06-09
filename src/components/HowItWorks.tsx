import { useEffect, useRef } from 'react'
import { Users, Smartphone, LayoutDashboard, Camera } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { AnimatedHeading } from './AnimatedHeading'

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'Your dedicated team',
    body: 'We assign a consistent, vetted team to your building so you get familiar faces — not strangers every week.',
  },
  {
    number: '02',
    icon: Camera,
    title: 'Photo evidence, every visit',
    body: 'After each zone is cleaned, your team submits timestamped photos through our app. Your supervisor reviews the evidence — before you start your day.',
  },
  {
    number: '03',
    icon: LayoutDashboard,
    title: 'Your dashboard, your control',
    body: 'Live zone status, photo evidence, supervisor notes, and flagged issues — all visible in your client dashboard in real time.',
  },
  {
    number: '04',
    icon: Smartphone,
    title: 'Automated weekly reports',
    body: 'Every week, a compiled report is generated automatically — visit logs, evidence, and any flags resolved. No chasing. No calls.',
  },
]

/** How It Works section — numbered steps with alternating left/right GSAP entrance */
export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const stepEls = container.querySelectorAll<HTMLElement>('.step-item')
    const ctx = gsap.context(() => {
      stepEls.forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 83%' },
          x: i % 2 === 0 ? 70 : -70,
          y: 25,
          opacity: 0,
          duration: 1.2,
          ease: 'power4.out',
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" className="py-24 bg-charcoal/95">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedHeading
          text="How it works"
          className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-16"
        />

        <div ref={containerRef} className="flex flex-col">
          {steps.map(({ number, icon: Icon, title, body }, i) => (
            <div key={number}>
              <div className="step-item flex gap-6 items-start py-10">
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
              {i < steps.length - 1 && <hr className="border-brass/10" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
