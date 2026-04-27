import { useState } from 'react'
import UnicornScene from 'unicornstudio-react'
import { SpongeAnimation } from './SpongeAnimation'

/** Hero section — full-screen WebGL background with sponge wipe reveal animation */
export function Hero() {
  const [animationDone, setAnimationDone] = useState(false)

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% 55%, #2f4a3d 0%, #1a2e23 70%, #111e17 100%)',
      }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(184,167,122,0.07) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Unicorn Studio WebGL background — mounted immediately so it loads during sponge animation */}
      <div className="absolute inset-0 z-0">
        <UnicornScene
          projectId="3BoR9Fa4znWkp3wRkghw"
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js"
          width="100%"
          height="100%"
        />
      </div>

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
            Mr Brush
            <span className="block text-brass">&amp; Co.</span>
          </h1>

          <p className="font-body font-light text-[clamp(14px,2vw,19px)] tracking-[0.5px] text-ivory/60 mb-9">
            Managed by tech. Delivered by people.
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

      {/* Scroll hint — appears after animation completes */}
      {animationDone && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
          <span className="font-body text-[10px] tracking-[3px] uppercase text-brass/60">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-brass/60" />
        </div>
      )}

      {/* Sponge animation overlay — removed from DOM after completion */}
      {!animationDone && (
        <SpongeAnimation onComplete={() => setAnimationDone(true)} />
      )}
    </section>
  )
}
