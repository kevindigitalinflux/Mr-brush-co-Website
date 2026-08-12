import { useState } from 'react'
import { HeroCanvas } from './HeroCanvas'
import { SpongeAnimation } from './SpongeAnimation'

/** Hero section — dirty surface reveal: mouse wipes green layer to show clean office */
export function Hero() {
  const [animationDone, setAnimationDone] = useState(false)

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: '#2F4A3D',
      }}
    >
      {/* Canvas reveal: office image beneath + dirty green surface on top */}
      <HeroCanvas />

      {/* Dot-grid texture — floats above canvas, adds branded grain to dirty surface */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(184,167,122,0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          zIndex: 4,
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <div className="relative max-w-[900px]">

          {/* Corner decorations */}
          <div className="absolute -top-[60px] -left-[80px] w-10 h-10 border-t border-l border-brass/35" />
          <div className="absolute -bottom-[60px] -right-[80px] w-10 h-10 border-b border-r border-brass/35" />

          <img
            src="/logo.png"
            className="h-24 md:h-[120px] w-auto mx-auto mb-6"
            alt="Mr Brush & Co."
            width="480"
            height="120"
          />

          <span className="block font-body text-[11px] font-normal tracking-[5px] uppercase text-brass mb-5">
            Commercial Cleaning Services
          </span>

          <h1 className="font-heading font-extrabold text-[clamp(56px,10vw,108px)] leading-[0.92] tracking-[-3px] text-ivory mb-6">
            Mr Brush{' '}
            <span className="block text-brass">&amp; Co.</span>
          </h1>

          <p className="font-body font-light text-[clamp(14px,2vw,19px)] tracking-[0.5px] text-ivory/60 mb-3">
            Managed by tech. Delivered by people.
          </p>
          <p className="font-body text-[clamp(12px,1.4vw,15px)] text-ivory/40 tracking-[0.3px] mb-9">
            Photo proof after every clean. Live dashboard. No chasing.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#quote"
              className="font-heading text-[13px] font-bold tracking-[1.5px] uppercase px-10 py-[15px] bg-brass text-green rounded-sm hover:bg-[#cabb92] transition-colors"
            >
              Get a Free Quote
            </a>
            <a
              href="#how-it-works"
              className="font-heading text-[13px] font-bold tracking-[1.5px] uppercase px-10 py-[14px] bg-transparent text-ivory/70 border border-ivory/25 rounded-sm hover:border-ivory/55 hover:text-ivory transition-colors"
            >
              How It Works
            </a>
          </div>
        </div>
      </div>

      {/* Sponge animation overlay — removed from DOM after completion */}
      {!animationDone && (
        <SpongeAnimation onComplete={() => setAnimationDone(true)} />
      )}
    </section>
  )
}
