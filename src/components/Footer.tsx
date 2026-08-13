import { Linkedin, Instagram, Twitter, Phone, MessageCircle } from 'lucide-react'
import { LOGO_SRC } from '../logo'
import { WHATSAPP_URL, PHONE_DISPLAY, PHONE_HREF } from '../lib/contact'

// Note: Twitter is deprecated in Lucide but remains available in v0.460.0.
// If a future Lucide upgrade removes it, replace with ExternalLink.

const navLinks = [
  { label: 'Services',     href: '#services'    },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Why Us',       href: '#why-us'       },
  { label: 'Get a Quote',  href: '#quote'        },
]

const socials = [
  { icon: Linkedin,  label: 'LinkedIn'  },
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter,   label: 'Twitter'   },
]

/** Site footer with logo, navigation links, and social icons */
export function Footer() {
  return (
    <footer id="footer" className="bg-charcoal border-t border-brass/15 py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        {/* Main row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <img src={LOGO_SRC} className="h-[120px] w-auto object-contain" alt="Mr Brush & Co." />
            <p className="font-body text-ivory/50 text-sm">
              Managed by tech. Delivered by people.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer" className="flex flex-col gap-3">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href}
                className="font-body text-ivory/70 hover:text-brass text-sm transition-colors duration-200">
                {label}
              </a>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <a href={PHONE_HREF}
              className="flex items-center gap-2 font-body text-ivory/70 hover:text-brass text-sm transition-colors duration-200">
              <Phone size={16} />
              {PHONE_DISPLAY}
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-ivory/70 hover:text-brass text-sm transition-colors duration-200">
              <MessageCircle size={16} />
              WhatsApp us
            </a>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="bg-ivory/10 rounded-full w-10 h-10 flex items-center justify-center hover:bg-brass/20 hover:text-brass transition-all duration-200 text-ivory/60">
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="font-body text-ivory/25 text-[10px] tracking-[2px] uppercase">Coming soon</p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-ivory/10 mt-10 pt-6 flex flex-col md:flex-row justify-between gap-2">
          <p className="font-body text-ivory/30 text-xs">
            © {new Date().getFullYear()} Mr Brush & Co. All rights reserved.
          </p>
          <div className="flex gap-4 items-center">
            <a href="#" className="font-body text-ivory/30 hover:text-ivory/60 text-xs transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-ivory/30 hover:text-ivory/60 text-xs transition-colors duration-200">
              Terms of Service
            </a>
            <span className="text-ivory/15 text-xs">|</span>
            <a href="https://didreamlabs.com" target="_blank" rel="noopener noreferrer"
              className="font-body text-ivory/30 hover:text-brass text-xs transition-colors duration-200">
              Built by DI Dreamlabs
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
