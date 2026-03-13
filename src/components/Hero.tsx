import { LOGO_SRC } from '../logo'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Layer 1: Background photo */}
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
        aria-hidden="true"
      />

      {/* Layer 2: Permanent gradient overlay — always visible */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, rgba(47,74,61,0.4) 0%, rgba(61,59,58,0.7) 100%)' }}
        aria-hidden="true"
      />

      {/* Layer 3: Dirty overlay — wiped away left-to-right */}
      <div
        className="hero-dirty-overlay hero-grain absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Layer 4: Squeegee streak — travels left to right */}
      <div
        className="hero-streak absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: '80px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(184,167,122,0.3) 50%, rgba(255,255,255,0.15) 75%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 5: Content — revealed by wipe */}
      <div className="hero-content-layer absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6 flex flex-col items-center">

          <img
            src={LOGO_SRC}
            className="h-16 md:h-20 w-auto mx-auto mb-6"
            alt="Mr Brush & Co."
          />

          <h1 className="hero-headline font-heading font-bold text-ivory text-4xl md:text-5xl lg:text-6xl leading-tight">
            Your office, always clean.<br className="hidden md:block" /> Always accountable.
          </h1>

          <p className="hero-tagline font-body text-ivory/70 text-lg md:text-xl mt-4">
            Managed by tech. Delivered by people.
          </p>

          <a
            href="#quote"
            className="hero-cta inline-block bg-green hover:brightness-110 hover:scale-[1.02] active:scale-[0.97] text-ivory font-body font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 mt-8"
          >
            Get a Quote →
          </a>
        </div>
      </div>

    </section>
  )
}
