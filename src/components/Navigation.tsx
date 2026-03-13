import { useState, useEffect } from 'react'
import { LOGO_SRC } from '../logo'

const links = [
  { label: 'Services',     href: '#services'   },
  { label: 'How It Works', href: '#how-it-works'},
  { label: 'Why Us',       href: '#why-us'      },
]

export default function Navigation() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-charcoal/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="#hero" aria-label="Mr Brush & Co." onClick={close}>
            <img src={LOGO_SRC} className="h-10 w-auto" alt="Mr Brush & Co." />
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ label, href }) => (
              <a key={label} href={href} onClick={close}
                className="font-body text-sm text-ivory/80 hover:text-brass transition-colors duration-200">
                {label}
              </a>
            ))}
            <a href="#quote"
              className="font-body font-bold text-sm text-ivory bg-green rounded-lg px-4 py-2 hover:brightness-110 transition-all duration-200">
              Get a Quote
            </a>
          </div>

          {/* Hamburger — single persistent div rotated 45° to form an X */}
          <button className="md:hidden text-ivory p-1 w-8 h-8 relative flex items-center justify-center"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <span className={`absolute block w-5 h-0.5 bg-ivory transition-all duration-200
              ${menuOpen ? 'rotate-45' : 'rotate-0 -translate-y-1.5'}`} />
            <span className={`absolute block w-5 h-0.5 bg-ivory transition-all duration-200
              ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute block w-5 h-0.5 bg-ivory transition-all duration-200
              ${menuOpen ? '-rotate-45' : 'rotate-0 translate-y-1.5'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay — parent fades in/out; children stagger via transform only */}
      <div aria-hidden={!menuOpen} className={`fixed inset-0 z-40 bg-charcoal flex flex-col items-center justify-center gap-8
        transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {links.map(({ label, href }, i) => (
          <a key={label} href={href} onClick={close} tabIndex={menuOpen ? 0 : -1}
            className="font-body text-2xl text-ivory/80 hover:text-brass"
            style={{
              transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
              transition: 'transform 0.3s ease',
            }}>
            {label}
          </a>
        ))}
        <a href="#quote" onClick={close} tabIndex={menuOpen ? 0 : -1}
          className="font-body font-bold text-lg text-ivory bg-green rounded-xl px-6 py-3 hover:brightness-110 transition-all duration-200"
          style={{
            transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
            transitionDelay: menuOpen ? `${links.length * 60}ms` : '0ms',
            transition: 'transform 0.3s ease',
          }}>
          Get a Quote
        </a>
      </div>
    </>
  )
}
