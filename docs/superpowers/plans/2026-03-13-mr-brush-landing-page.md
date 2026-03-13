# Mr Brush & Co. Landing Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all 10 landing page components with the hero wipe-reveal animation, scroll-triggered entrances, animated dashboard card, and form success state — using 21st.dev MCP components restyled to the Mr Brush brand.

**Architecture:** Each of the 10 component files is replaced in full. `index.css` is fully replaced with a new animation system. 21st.dev MCP (`mcp__magic__21st_magic_component_builder`) is called inline during relevant tasks to fetch component patterns, which are then adapted to the brand. No new npm packages are added.

**Tech Stack:** React 18 + TypeScript + Tailwind CSS v3 (custom tokens: ivory/charcoal/slate/green/brass, font-heading/font-body) + Lucide React v0.460.0 + 21st.dev MCP

**Spec:** `docs/superpowers/specs/2026-03-13-mr-brush-landing-page-design.md`

---

## Chunk 1: Foundation — CSS + Navigation

---

### Task 1: Replace index.css

**Files:**
- Replace: `src/index.css`

The existing file contains old Hero animation keyframes that conflict with the new design. Replace it entirely with the new animation system as specified.

- [ ] **Step 1: Replace src/index.css in full**

Write the following as the complete contents of `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Scroll utilities ─────────────────────────────────────── */
.scroll-fade {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.scroll-fade.animate-in { opacity: 1; transform: translateY(0); }

/* 80ms stagger — max 4 children */
.stagger-children > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.stagger-children.animate-in > *:nth-child(1) { opacity:1; transform:none; transition-delay:0ms }
.stagger-children.animate-in > *:nth-child(2) { opacity:1; transform:none; transition-delay:80ms }
.stagger-children.animate-in > *:nth-child(3) { opacity:1; transform:none; transition-delay:160ms }
.stagger-children.animate-in > *:nth-child(4) { opacity:1; transform:none; transition-delay:240ms }

/* 120ms stagger — max 4 children */
.stagger-children-120 > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.stagger-children-120.animate-in > *:nth-child(1) { opacity:1; transform:none; transition-delay:0ms }
.stagger-children-120.animate-in > *:nth-child(2) { opacity:1; transform:none; transition-delay:120ms }
.stagger-children-120.animate-in > *:nth-child(3) { opacity:1; transform:none; transition-delay:240ms }
.stagger-children-120.animate-in > *:nth-child(4) { opacity:1; transform:none; transition-delay:360ms }

/* ── Hero wipe ────────────────────────────────────────────── */
@keyframes wipeReveal {
  0%   { clip-path: inset(0 0 0 0); }
  100% { clip-path: inset(0 0 0 100%); }
}
@keyframes wipeContent {
  0%   { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0% 0 0); }
}
@keyframes squeegeeStreak {
  0%   { left: -5%; }
  100% { left: 105%; }
}
.hero-dirty-overlay {
  animation: wipeReveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}
.hero-content-layer {
  animation: wipeContent 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}
.hero-streak {
  animation: squeegeeStreak 1.5s ease-in-out 0.1s both;
}

/* ── Post-wipe content entrance ──────────────────────────── */
@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-headline { animation: heroFadeUp 0.6s ease-out 1.7s both; }
.hero-tagline  { animation: heroFadeUp 0.5s ease-out 1.9s both; }
.hero-cta      { animation: heroFadeUp 0.5s ease-out 2.1s both; }

/* ── Grain texture ───────────────────────────────────────── */
.hero-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}

/* ── Dashboard ───────────────────────────────────────────── */
/* Live badge: glow pulse */
@keyframes livePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(47, 74, 61, 0); }
  50%       { box-shadow: 0 0 8px 3px rgba(47, 74, 61, 0.6); }
}
.live-pulse { animation: livePulse 2s ease-in-out infinite; }

/* Kitchen row shimmer */
@keyframes rowShimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.row-shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(184,167,122,0.08) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: rowShimmer 3s ease-in-out infinite;
}

/* Dashboard row entrance — gated on .animate-in on the card wrapper */
@keyframes dashRowIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
.dash-row { opacity: 0; }
.animate-in .dash-row { animation: dashRowIn 0.4s ease-out both; }
.animate-in .dash-row:nth-child(1) { animation-delay: 0ms; }
.animate-in .dash-row:nth-child(2) { animation-delay: 120ms; }
.animate-in .dash-row:nth-child(3) { animation-delay: 240ms; }
.animate-in .dash-row:nth-child(4) { animation-delay: 360ms; }

/* ── Form ────────────────────────────────────────────────── */
@keyframes checkDraw {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
}
/* NOTE: pathLength="1" must be set as JSX attribute on <path> — not here */
.check-draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: checkDraw 0.6s ease-out 0.2s both;
}
@keyframes formFadeOut {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.97); }
}
.form-fade-out { animation: formFadeOut 0.3s ease-out both; }

@keyframes successFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.success-fade-in { animation: successFadeIn 0.4s ease-out 0.3s both; }
```

- [ ] **Step 2: Verify dev server compiles**

```bash
cd /c/Users/kevin/mr-brush-website
npm run dev
```

Expected: No build errors in terminal. Browser shows existing page (components not updated yet — that's fine).

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: replace index.css with new animation system for landing page rebuild"
```

---

### Task 2: Rebuild Navigation.tsx

**Files:**
- Replace: `src/components/Navigation.tsx`

Uses 21st.dev for the nav pattern, restyled to brand. Transparent → `bg-charcoal/90 backdrop-blur-md` on scroll > 80px. Mobile full-screen overlay with staggered links.

- [ ] **Step 1: Fetch 21st.dev nav component**

Call `mcp__magic__21st_magic_component_builder` with:
```
prompt: "Sticky navigation bar that starts transparent and transitions to a dark semi-transparent background with backdrop blur on scroll. Includes desktop nav links and a CTA button. Mobile hamburger menu with full-screen overlay and staggered link entrance animation. React + TypeScript + Tailwind CSS."
```

Use the returned code as a structural reference. Adapt it to the brand as described below — do not use it verbatim.

- [ ] **Step 2: Write Navigation.tsx**

Replace `src/components/Navigation.tsx` with:

```tsx
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
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
              <a key={label} href={href}
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
      <div className={`fixed inset-0 z-40 bg-charcoal flex flex-col items-center justify-center gap-8
        transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {links.map(({ label, href }, i) => (
          <a key={label} href={href} onClick={close}
            className="font-body text-2xl text-ivory/80 hover:text-brass"
            style={{
              transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
              transition: 'transform 0.3s ease',
            }}>
            {label}
          </a>
        ))}
        <a href="#quote" onClick={close}
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
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Check:
- Nav is transparent on load, switches to dark with blur when scrolled past 80px
- Desktop: links and green CTA button visible
- Mobile (resize browser < 768px): hamburger visible, tap opens full-screen overlay, links appear with stagger, tap X or a link closes it

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "feat: rebuild Navigation with scroll transition and mobile overlay"
```

---

## Chunk 2: Hero Wipe Animation

---

### Task 3: Rebuild Hero.tsx

**Files:**
- Replace: `src/components/Hero.tsx`

This is the centrepiece. Five layers stacked with `position: absolute`. The dirty overlay and content layer are revealed/hidden via CSS `clip-path` animation. A streak div travels left-to-right as the squeegee edge.

- [ ] **Step 1: Write Hero.tsx**

Replace `src/components/Hero.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify wipe animation in browser**

```bash
npm run dev
```

Open browser at `http://localhost:5173`. On page load, verify:
1. Screen starts fully covered by the dark grimy overlay
2. A bright streak travels left-to-right across the screen (~1.5s)
3. The clean office photo + gradient is revealed behind the wipe
4. After the wipe completes (~1.7s), the headline fades up from below
5. Tagline fades in (~1.9s)
6. CTA button fades in (~2.1s)

If the wipe clips incorrectly (content hidden when it shouldn't be, or overlay still showing):
- Check that `.hero-dirty-overlay` and `.hero-content-layer` CSS classes are present in `index.css`
- Check that all five `<div>` layers have `absolute inset-0` or equivalent positioning
- Confirm the section itself has `overflow-hidden` and `relative`

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: rebuild Hero with squeegee wipe-reveal animation"
```

---

## Chunk 3: Content Sections

---

### Task 4: Rebuild Problem.tsx

**Files:**
- Replace: `src/components/Problem.tsx`

4 pain-point cards in a 2×2 grid. Scroll-triggered via `useScrollAnimation` + `.stagger-children`.

- [ ] **Step 1: Fetch 21st.dev feature card pattern**

Call `mcp__magic__21st_magic_component_builder` with:
```
prompt: "Dark feature card with an icon, heading, and body text. Used in a 2x2 grid. Dark background card with subtle border. React + TypeScript + Tailwind CSS."
```

Use the returned code as a structural reference for a single card. The full component is written below.

- [ ] **Step 2: Write Problem.tsx**

Replace `src/components/Problem.tsx` with:

```tsx
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
    title: 'Rigid contracts, slow responses',
    body: "Locked into terms that don't flex when your needs change.",
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
```

- [ ] **Step 3: Verify in browser**

Scroll down to the Problem section. Verify:
- Cards are invisible before scrolling to them
- Cards stagger in (left-top → right-top → left-bottom → right-bottom) as section enters viewport
- Icons are brass coloured, cards have dark slate background with brass border

- [ ] **Step 4: Commit**

```bash
git add src/components/Problem.tsx
git commit -m "feat: rebuild Problem section with staggered card entrance"
```

---

### Task 5: Rebuild HowItWorks.tsx

**Files:**
- Replace: `src/components/HowItWorks.tsx`

3 numbered steps, stacked full-width. `useScrollAnimation` + `.stagger-children-120`. Built from scratch — no 21st.dev base.

- [ ] **Step 1: Write HowItWorks.tsx**

Replace `src/components/HowItWorks.tsx` with:

```tsx
import { Users, Smartphone, LayoutDashboard } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'Your dedicated team',
    body: 'We assign a consistent, vetted team to your building so you get familiar faces — not strangers every week.',
  },
  {
    number: '02',
    icon: Smartphone,
    title: 'Real-time check-ins',
    body: 'They check in and out via our app — you get real-time notifications every visit, without lifting a finger.',
  },
  {
    number: '03',
    icon: LayoutDashboard,
    title: 'Your dashboard, your control',
    body: 'Manage everything from your client dashboard — schedules, reports, flags, and billing in one place.',
  },
]

export default function HowItWorks() {
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="how-it-works" className="py-24 bg-charcoal/95">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-16">
          How it works
        </h2>

        <div ref={ref} className="stagger-children-120 flex flex-col">
          {steps.map(({ number, icon: Icon, title, body }, i) => (
            <div key={number}>
              <div className="flex gap-6 items-start py-10">
                {/* Step number */}
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

              {i < steps.length - 1 && (
                <hr className="border-brass/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Scroll to How It Works. Verify:
- 3 steps stagger in with 120ms between each
- Large faint brass step numbers on the left
- Horizontal dividers between steps

- [ ] **Step 3: Commit**

```bash
git add src/components/HowItWorks.tsx
git commit -m "feat: rebuild HowItWorks with numbered steps and stagger entrance"
```

---

### Task 6: Rebuild Services.tsx

**Files:**
- Replace: `src/components/Services.tsx`

4 service cards in a 2×2 grid. `useScrollAnimation` + `.stagger-children`. Icon in a `bg-green/20` box. Hover border lift.

- [ ] **Step 1: Write Services.tsx**

Replace `src/components/Services.tsx` with:

```tsx
import { Building2, DoorOpen, Sparkles, Plus } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const services = [
  {
    icon: Building2,
    title: 'Office Cleaning',
    body: 'Daily or weekly cleans tailored to your office layout and hours — consistent, reliable, accountable.',
  },
  {
    icon: DoorOpen,
    title: 'Communal Areas',
    body: 'Reception, kitchens, corridors and shared spaces kept pristine throughout the working day.',
  },
  {
    icon: Sparkles,
    title: 'Deep Cleans',
    body: 'Scheduled or one-off deep cleans for carpets, upholstery, and hard-to-reach areas.',
  },
  {
    icon: Plus,
    title: 'Flexible Add-ons',
    body: 'Waste management, washroom supplies, pest control — added as and when you need them.',
  },
]

export default function Services() {
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="services" className="py-24 bg-charcoal">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-12">
          Our services
        </h2>

        <div ref={ref} className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, title, body }) => (
            <div key={title}
              className="bg-slate border border-brass/15 hover:border-brass/40 rounded-xl p-6 flex flex-col gap-4 transition-colors duration-200">
              <div className="bg-green/20 rounded-lg p-3 w-fit">
                <Icon size={24} className="text-brass" />
              </div>
              <h3 className="font-heading font-semibold text-ivory text-lg">{title}</h3>
              <p className="font-body text-ivory/70 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Services. Verify:
- 4 cards in 2×2 grid (stacks to 1 column on mobile)
- Cards stagger in on scroll
- Hover causes border to brighten to brass

- [ ] **Step 3: Commit**

```bash
git add src/components/Services.tsx
git commit -m "feat: rebuild Services with icon cards and hover border"
```

---

## Chunk 4: Interactive Sections

---

### Task 7: Rebuild MrBrushDifference.tsx

**Files:**
- Replace: `src/components/MrBrushDifference.tsx`

4 feature points (left/top) + animated dashboard preview card. Two separate `useScrollAnimation` hook calls — one on the section, one on the dashboard card. Built from scratch.

- [ ] **Step 1: Write MrBrushDifference.tsx**

Replace `src/components/MrBrushDifference.tsx` with:

```tsx
import { Zap, ShieldCheck, FileText, XCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const points = [
  {
    icon: Zap,
    title: 'Tech-powered automation',
    body: 'GPS check-ins, digital task lists, and automated reporting after every visit.',
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
    icon: XCircle,
    title: 'No lock-in contracts',
    body: 'Flexible terms that work around you. Cancel with 30 days notice.',
  },
]

const dashRows = [
  { Icon: CheckCircle2, iconClass: 'text-green', label: 'Floor 3 — Cleaned',      time: '09:14 AM', action: null,       shimmer: false },
  { Icon: CheckCircle2, iconClass: 'text-green', label: 'Reception — Cleaned',    time: '08:47 AM', action: null,       shimmer: false },
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
```

- [ ] **Step 2: Verify in browser**

Scroll to "The Mr Brush difference". Verify:
- Feature points stagger in from the left
- Dashboard card slides in as section enters viewport
- "● Live" badge has a soft green glow pulse (not a scale bounce)
- "Kitchen — In Progress" row has a subtle shimmer sweeping left-to-right on a 3s loop
- Dashboard rows animate in left-to-right with stagger when the card enters the viewport

- [ ] **Step 3: Commit**

```bash
git add src/components/MrBrushDifference.tsx
git commit -m "feat: rebuild MrBrushDifference with animated dashboard preview card"
```

---

### Task 8: Rebuild Ratings.tsx

**Files:**
- Replace: `src/components/Ratings.tsx`

Review card (client rating a staff member) + 3 badge pills. `useScrollAnimation` + `.scroll-fade`.

- [ ] **Step 1: Fetch 21st.dev testimonial card pattern**

Call `mcp__magic__21st_magic_component_builder` with:
```
prompt: "Testimonial review card with avatar initials, reviewer name and role, star rating, quote text, and attribution line. Dark background. React + TypeScript + Tailwind CSS."
```

Use the returned code as structural reference for the card layout. Adapt using the full component below.

- [ ] **Step 2: Write Ratings.tsx**

Replace `src/components/Ratings.tsx` with:

```tsx
import { Star } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const badges = [
  '⭐ Staff incentivised by ratings',
  '📋 Feedback logged automatically',
  '🔄 Poor performance flagged instantly',
]

export default function Ratings() {
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section id="ratings" className="py-24 bg-charcoal">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-heading font-bold text-ivory text-3xl md:text-4xl mb-4">
          Your team, rated by you
        </h2>
        <p className="font-body text-ivory/60 mb-12 leading-relaxed">
          After every clean, you rate your team. That feedback directly shapes their
          performance reviews — keeping standards high, automatically.
        </p>

        {/* Review card */}
        <div ref={ref}
          className="scroll-fade bg-slate border border-brass/20 rounded-2xl p-8 text-left mb-8">
          {/* Reviewer */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-brass flex items-center justify-center shrink-0">
              <span className="font-heading font-bold text-charcoal text-sm">JD</span>
            </div>
            <div>
              <p className="font-heading font-semibold text-ivory text-sm">Jamie D.</p>
              <p className="font-body text-ivory/50 text-xs">Lead Cleaner</p>
            </div>
          </div>

          {/* Stars */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} className="fill-brass text-brass" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="font-body text-ivory/80 leading-relaxed mb-4">
            "Thorough, punctual, and always leaves the kitchen spotless. Best cleaner
            we've had in years."
          </blockquote>

          {/* Attribution */}
          <p className="font-body text-ivory/40 text-xs">
            Submitted Tuesday 4 March · Floor 3
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map(badge => (
            <span key={badge}
              className="bg-charcoal border border-brass/20 rounded-full px-4 py-2 font-body text-sm text-ivory/80">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify in browser**

Scroll to Ratings. Verify:
- Card fades up on scroll
- Gold avatar circle, 5 brass stars, quote text, attribution
- 3 badge pills below

- [ ] **Step 4: Commit**

```bash
git add src/components/Ratings.tsx
git commit -m "feat: rebuild Ratings with review card and badge pills"
```

---

### Task 9: Rebuild TrustSignals.tsx

**Files:**
- Replace: `src/components/TrustSignals.tsx`

4 icon + label tiles. `useScrollAnimation` + `.stagger-children`. Built from scratch.

- [ ] **Step 1: Write TrustSignals.tsx**

Replace `src/components/TrustSignals.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify in browser**

Scroll to Trust Signals. Verify:
- 4 tiles in a row (2×2 on mobile)
- Green circle backgrounds, brass icons
- Labels in Poppins semibold

- [ ] **Step 3: Commit**

```bash
git add src/components/TrustSignals.tsx
git commit -m "feat: rebuild TrustSignals with icon tiles and stagger entrance"
```

---

## Chunk 5: Form + Footer

---

### Task 10: Rebuild GetAQuote.tsx

**Files:**
- Replace: `src/components/GetAQuote.tsx`

Form with 6 fields + submit. Brass focus rings. Submit spinner → form fade out → success checkmark draw animation. `useScrollAnimation` + `.scroll-fade`.

- [ ] **Step 1: Fetch 21st.dev form pattern**

Call `mcp__magic__21st_magic_component_builder` with:
```
prompt: "Contact form with labeled input fields, select dropdowns, email and phone inputs, and a full-width submit button. Clean, dark theme. Smooth focus states with a colored border and ring. React + TypeScript + Tailwind CSS."
```

Use the returned code as a structural reference for field/label layout. The full component is written below.

- [ ] **Step 2: Write GetAQuote.tsx**

Replace `src/components/GetAQuote.tsx` with:

```tsx
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const inputClass = `
  w-full bg-charcoal border border-ivory/20 rounded-lg px-4 py-3
  font-body text-ivory placeholder:text-ivory/30 text-sm
  focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/40
  transition-all duration-200
`.trim()

const labelClass = 'block font-body text-sm text-ivory/70 mb-1.5'

type State = 'idle' | 'loading' | 'success'

export default function GetAQuote() {
  const ref = useScrollAnimation<HTMLDivElement>()
  const [state, setState] = useState<State>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setTimeout(() => setState('success'), 1200)
  }

  return (
    <section id="quote" className="py-24 bg-charcoal">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="font-heading font-bold text-ivory text-3xl md:text-4xl text-center mb-3">
          Get a quote
        </h2>
        <p className="font-body text-ivory/60 text-center mb-10">
          Tell us about your space and we'll get back to you within 1 business day.
        </p>

        <div ref={ref} className="scroll-fade relative min-h-[480px]">

          {/* Form wrapper — gets form-fade-out when loading begins (fades over 0.3s before success renders) */}
          {state !== 'success' && (
            <div className={state === 'loading' ? 'form-fade-out pointer-events-none' : ''}>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">

                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input type="text" placeholder="John Smith" required className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Company</label>
                    <input type="text" placeholder="Acme Corp" required className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Office Size</label>
                      <select required className={inputClass}>
                        <option value="">Select size…</option>
                        <option>Under 1,000 sq ft</option>
                        <option>1,000–5,000 sq ft</option>
                        <option>5,000–10,000 sq ft</option>
                        <option>10,000+ sq ft</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Frequency</label>
                      <select required className={inputClass}>
                        <option value="">Select frequency…</option>
                        <option>Daily</option>
                        <option>3× per week</option>
                        <option>Weekly</option>
                        <option>Fortnightly</option>
                        <option>One-off</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" placeholder="john@acme.com" required className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" placeholder="+44 7700 000000" className={inputClass} />
                  </div>

                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="w-full bg-green hover:brightness-110 disabled:opacity-70 text-ivory font-body font-bold py-4 rounded-xl text-base transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                  >
                    {state === 'loading'
                      ? <><Loader2 size={20} className="animate-spin" /> Sending…</>
                      : 'Request Your Quote →'
                    }
                  </button>

                </div>
              </form>
            </div>
          )}

          {/* Success state — success-fade-in has 0.3s delay matching form-fade-out duration */}
          {state === 'success' && (
            <div className="success-fade-in flex flex-col items-center justify-center gap-6 py-20 text-center">
              <svg viewBox="0 0 52 52" className="w-20 h-20" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="24"
                  stroke="#2f4a3d" strokeWidth="2" fill="none" />
                {/* pathLength="1" is load-bearing — do not remove */}
                <path d="M14 27 L22 35 L38 19"
                  stroke="#2f4a3d" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"
                  pathLength="1"
                  className="check-draw"
                />
              </svg>
              <div>
                <p className="font-heading font-bold text-ivory text-2xl mb-2">
                  We'll be in touch shortly.
                </p>
                <p className="font-body text-ivory/60">
                  Expect a response within 1 business day.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify form interactions in browser**

Scroll to Get a Quote. Verify:
1. All fields have brass-coloured border + ring on focus
2. Click "Request Your Quote →" — button shows spinner + "Sending…" for ~1.2s
3. After 1.2s — form fades out, success state fades in
4. Success: circular checkmark animates (stroke draws in), "We'll be in touch shortly." text appears
5. If checkmark does not draw: ensure `pathLength="1"` is on the `<path>` element (not removed), and `.check-draw` class is in `index.css`

- [ ] **Step 4: Commit**

```bash
git add src/components/GetAQuote.tsx
git commit -m "feat: rebuild GetAQuote with brass focus states and checkmark success animation"
```

---

### Task 11: Rebuild Footer.tsx

**Files:**
- Replace: `src/components/Footer.tsx`

Logo + tagline, nav links column, social icons, bottom legal bar. Built from scratch.

- [ ] **Step 1: Write Footer.tsx**

Replace `src/components/Footer.tsx` with:

```tsx
import { Linkedin, Instagram, Twitter } from 'lucide-react'
import { LOGO_SRC } from '../logo'

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

export default function Footer() {
  return (
    <footer id="footer" className="bg-charcoal border-t border-brass/15 py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        {/* Main row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <img src={LOGO_SRC} className="h-10 w-auto" alt="Mr Brush & Co." />
            <p className="font-body text-ivory/50 text-sm">
              Managed by tech. Delivered by people.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-3">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href}
                className="font-body text-ivory/70 hover:text-brass text-sm transition-colors duration-200">
                {label}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a key={label} href="#" aria-label={label}
                className="bg-ivory/10 rounded-full w-10 h-10 flex items-center justify-center hover:bg-brass/20 hover:text-brass transition-all duration-200 text-ivory/60">
                <Icon size={18} />
              </a>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-ivory/10 mt-10 pt-6 flex flex-col md:flex-row justify-between gap-2">
          <p className="font-body text-ivory/30 text-xs">
            © {new Date().getFullYear()} Mr Brush & Co. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="font-body text-ivory/30 hover:text-ivory/60 text-xs transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-ivory/30 hover:text-ivory/60 text-xs transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Footer. Verify:
- Logo renders (from LOGO_SRC, not a broken image)
- 3-column layout on desktop: brand, nav links, social icons
- Social icon circles have hover glow
- Bottom bar has copyright and legal links

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: rebuild Footer with logo, nav links, and social icons"
```

---

### Task 12: Integration Verification

**Files:**
- Read-only verification — no file changes

Final check that the complete page works end-to-end.

- [ ] **Step 1: Run dev server and full page review**

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. Walk through this checklist top-to-bottom:

**On load:**
- [ ] Dirty overlay covers the entire screen
- [ ] Wipe animation runs left-to-right (~1.5s), squeegee streak visible
- [ ] Logo, headline, tagline, CTA appear after wipe with staggered fade-up
- [ ] Navigation is transparent over the hero

**On scroll:**
- [ ] Nav switches to dark+blur after scrolling ~80px
- [ ] Each section (Problem, HowItWorks, Services, etc.) is invisible before entering viewport
- [ ] Problem: 4 cards stagger in at 80ms intervals
- [ ] HowItWorks: 3 steps stagger in at 120ms intervals
- [ ] Services: 4 cards stagger in at 80ms intervals
- [ ] MrBrushDifference: feature points stagger; dashboard card appears and rows animate in
- [ ] Live badge pulses with glow; Kitchen row shimmers
- [ ] Ratings card fades up; 3 badge pills visible below
- [ ] TrustSignals: 4 icon tiles stagger in
- [ ] GetAQuote section scrolls into view cleanly

**Form:**
- [ ] Focus any field → brass border + ring appears
- [ ] Fill form and submit → spinner → success checkmark draws in → message appears

**Mobile (resize to < 768px):**
- [ ] Hamburger visible in nav
- [ ] Tap hamburger → full-screen overlay slides in
- [ ] Nav links stagger in
- [ ] Tap a link → overlay closes, page scrolls to section
- [ ] Problem/Services grid collapses to 1 column
- [ ] TrustSignals tiles in 2×2 grid

- [ ] **Step 2: TypeScript check**

```bash
cd /c/Users/kevin/mr-brush-website
npx tsc --noEmit
```

Expected: No errors. If errors appear:
- `Module not found '../hooks/useScrollAnimation'` → confirm file is at `src/hooks/useScrollAnimation.ts`
- `Twitter` not found in lucide-react → replace with `ExternalLink` in Footer.tsx
- Any `LOGO_SRC` errors → confirm `src/logo.ts` exports `export const LOGO_SRC = "data:image/..."`

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Mr Brush & Co. landing page rebuild

All 10 components rebuilt with hero wipe-reveal animation, scroll-triggered
entrances, animated dashboard card, and form success state."
```
