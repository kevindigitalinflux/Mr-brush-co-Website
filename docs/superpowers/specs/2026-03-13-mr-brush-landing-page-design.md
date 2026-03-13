# Mr Brush & Co. — Interactive Landing Page Design Spec
**Date:** 2026-03-13
**Status:** Approved for implementation

---

## Overview

Rebuild the Mr Brush & Co. single-page marketing site as a premium, animated landing page. The site targets office managers and facilities leads at commercial tenants. The core brand proposition — "tech-forward cleaning with accountability" — must be felt through every interaction, not just copy.

**Stack:** React 18 + TypeScript + Tailwind CSS + Lucide React + 21st.dev MCP components (restyled to brand). No new npm packages.

---

## Brand Tokens

| Token | Value | Tailwind utility |
|---|---|---|
| `ivory` | `#F5F4EF` | `text-ivory`, `bg-ivory` |
| `charcoal` | `#3d3b3a` | `text-charcoal`, `bg-charcoal` |
| `slate` | `#434b4d` | `text-slate`, `bg-slate` |
| `green` | `#2f4a3d` | `text-green`, `bg-green` |
| `brass` | `#B8A77A` | `text-brass`, `bg-brass` |
| Heading font (Poppins) | — | `font-heading` |
| Body font (Lato) | — | `font-body` |
| Logo | `LOGO_SRC` from `../logo` — base64 PNG, brass/gold on transparent | — |

**Rule:** Use `font-heading` for all Poppins text and `font-body` for all Lato text. Use Tailwind token classes (e.g. `bg-charcoal`, `text-brass`) in JSX wherever possible. Exception: raw `rgba()` values are acceptable inside CSS `@keyframes` blocks and `style` prop gradients where Tailwind utilities cannot express multi-stop gradients with opacity — but never use raw hex in Tailwind class strings.

---

## Architecture

### File Structure

```
src/
  logo.ts                        — unchanged
  index.css                      — FULLY REPLACED (see CSS Architecture section)
  App.tsx                        — unchanged structure
  hooks/
    useScrollAnimation.ts        — unchanged
  components/
    Navigation.tsx               — rebuilt
    Hero.tsx                     — rebuilt (centrepiece)
    Problem.tsx                  — rebuilt
    HowItWorks.tsx               — rebuilt
    Services.tsx                 — rebuilt
    MrBrushDifference.tsx        — rebuilt
    Ratings.tsx                  — rebuilt
    TrustSignals.tsx             — rebuilt
    GetAQuote.tsx                — rebuilt
    Footer.tsx                   — rebuilt
```

### Section Anchor IDs

Each section wrapper `<section>` must carry the following `id`:

| Component | `id` |
|---|---|
| Hero | `hero` |
| Problem | `problem` |
| HowItWorks | `how-it-works` |
| Services | `services` |
| MrBrushDifference | `why-us` |
| Ratings | `ratings` |
| TrustSignals | `trust` |
| GetAQuote | `quote` |
| Footer | `footer` |

Navigation links: Services → `#services`, How It Works → `#how-it-works`, Why Us → `#why-us`. CTA everywhere → `#quote`.

### Constraints
- No new npm packages
- All components are self-contained (no shared state beyond what's in each component)
- Logo always loaded via `LOGO_SRC` import — never `/logo.png`
- Tailwind custom tokens used throughout — no raw hex values in JSX
- Use `font-heading` (Poppins) and `font-body` (Lato) utility classes everywhere

### Scroll Animation Boundary

Use `useScrollAnimation` hook + CSS classes for all sections **except** Hero:

| Section | Animation driver |
|---|---|
| Hero | CSS-only, time-based (`animation-delay`) — no hook |
| Navigation | React state (`scrollY > 80`) — no hook |
| Problem | `useScrollAnimation` + `.stagger-children` (80ms) |
| HowItWorks | `useScrollAnimation` + `.stagger-children-120` (120ms) |
| Services | `useScrollAnimation` + `.stagger-children` (80ms) |
| MrBrushDifference | `useScrollAnimation` on section + separate hook instance on dashboard card |
| Ratings | `useScrollAnimation` + `.scroll-fade` |
| TrustSignals | `useScrollAnimation` + `.stagger-children` (80ms) |
| GetAQuote | `useScrollAnimation` + `.scroll-fade` |
| Footer | No animation |

---

## CSS Architecture (`index.css`)

`index.css` is **fully replaced**. The following existing keyframes and classes are **deleted**:
- `@keyframes heroLogoReveal` — deleted
- `@keyframes brushWipe` — deleted
- `@keyframes brushGlow` — deleted
- `@keyframes sweepBar` — deleted
- `@keyframes heroFadeUp` — **redefined** with new delays (see below)
- `@keyframes livePulse` — **redefined** as glow pulse (not scale)
- `.hero-logo`, `.hero-logo-sweep`, `.hero-text`, `.hero-sub`, `.hero-cta` — deleted (Hero rebuilt from scratch)

### Full keyframe definitions

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Scroll utilities (retained) ─────────────────────────── */
.scroll-fade {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.scroll-fade.animate-in { opacity: 1; transform: translateY(0); }

/* 80ms stagger — 4 children */
.stagger-children > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.stagger-children.animate-in > *:nth-child(1) { opacity:1; transform:none; transition-delay:0ms }
.stagger-children.animate-in > *:nth-child(2) { opacity:1; transform:none; transition-delay:80ms }
.stagger-children.animate-in > *:nth-child(3) { opacity:1; transform:none; transition-delay:160ms }
.stagger-children.animate-in > *:nth-child(4) { opacity:1; transform:none; transition-delay:240ms }

/* 120ms stagger — 4 children */
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
/* Dirty overlay: wipes away left-to-right */
@keyframes wipeReveal {
  0%   { clip-path: inset(0 0 0 0); }
  100% { clip-path: inset(0 0 0 100%); }
}
/* Content layer: reveals left-to-right in sync */
@keyframes wipeContent {
  0%   { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0% 0 0); }
}
/* Squeegee streak: travels left to right */
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
/* Fired after wipe completes at ~1600ms */
@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-headline { animation: heroFadeUp 0.6s ease-out 1.7s both; }
.hero-tagline  { animation: heroFadeUp 0.5s ease-out 1.9s both; }
.hero-cta      { animation: heroFadeUp 0.5s ease-out 2.1s both; }

/* ── Grain texture overlay ───────────────────────────────── */
.hero-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}

/* ── Dashboard ───────────────────────────────────────────── */
/* Live badge: glow pulse (not scale) */
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

/* Dashboard row entrance — gated on .animate-in being added to the card wrapper by useScrollAnimation */
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
/* NOTE: pathLength="1" must be set as a JSX attribute on the <path> element — NOT here.
   stroke-dasharray/offset of 1 only works relative to pathLength="1" on the SVG element. */
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

---

## Section Designs

### Navigation

**Behaviour:**
- Fixed to top, full width, `z-50`
- Default: transparent background
- On scroll > 80px: transitions to `bg-charcoal/90 backdrop-blur-md shadow-lg` over 300ms
- Links: Services (`#services`), How It Works (`#how-it-works`), Why Us (`#why-us`)
- CTA button: "Get a Quote" → `#quote`, `bg-green text-ivory font-body font-bold`

**Mobile:**
- Hamburger icon (Lucide `Menu`) → `X` with 200ms rotation transition
- Full-screen overlay (`bg-charcoal`) fades in
- Nav links stagger in at 60ms intervals using inline `transition-delay`
- Body scroll locked while open (`document.body.style.overflow = 'hidden'`)

**21st.dev usage:** Nav base pattern, restyled to brand tokens. Built from scratch if 21st.dev pattern doesn't fit cleanly.

---

### Hero

**The centrepiece interaction. Driven entirely by CSS `animation` — no scroll hook.**

**Layers (bottom → top, all `position: absolute inset-0`):**
1. `<img>` background: Unsplash office image, `object-cover w-full h-full`
2. Permanent gradient div: `linear-gradient(160deg, rgba(47,74,61,0.4), rgba(61,59,58,0.7))` — always visible
3. Dirty overlay div: `bg-charcoal/80` + `.hero-grain` + `backdrop-blur-sm` — carries `.hero-dirty-overlay` class
4. Streak div: `position: absolute`, `top: 0`, `bottom: 0`, `width: 80px`, gradient `transparent → rgba(184,167,122,0.3) → rgba(255,255,255,0.15) → transparent` — carries `.hero-streak` class
5. Content layer div: `relative z-10`, carries `.hero-content-layer` class — contains logo, headline, tagline, CTA

**Content (inside content layer):**
- Logo: `<img src={LOGO_SRC} className="h-16 md:h-20 w-auto mx-auto" />`
- Headline: `.hero-headline` class — "Your office, always clean. Always accountable." — `font-heading font-bold text-ivory text-4xl md:text-5xl lg:text-6xl`
- Tagline: `.hero-tagline` class — "Managed by tech. Delivered by people." — `font-body text-ivory/70 text-lg md:text-xl`
- CTA: `.hero-cta` class — "Get a Quote →" → `#quote`, `bg-green text-ivory font-body font-bold px-8 py-4 rounded-xl`

**Timing:**
```
0ms    — page load, dirty overlay covers everything
100ms  — wipe begins (wipeReveal, wipeContent, squeegeeStreak all fire simultaneously)
1600ms — wipe complete
1700ms — headline fades up (.hero-headline, 0.6s)
1900ms — tagline fades up (.hero-tagline, 0.5s)
2100ms — CTA fades up (.hero-cta, 0.5s)
```

---

### Problem

Section heading: "Sound familiar?" (centred, `font-heading font-bold`).

4 pain-point cards in a 2×2 grid. Driven by `useScrollAnimation` + `.stagger-children` (80ms).

**Cards:**
1. AlertCircle icon — "No-shows with no warning" — "Cleaners don't turn up — and nobody tells you until it's too late."
2. EyeOff icon — "No way to verify work was done" — "You're paying for a service you can't confirm actually happened."
3. MessageSquare icon — "Issues go unreported" — "Problems pile up because there's no easy way to flag them."
4. Lock icon — "Rigid contracts, slow responses" — "Locked into terms that don't flex when your needs change."

Each card: `bg-charcoal border border-brass/15 rounded-xl p-6`. Icon: brass, 28px. Heading: `font-heading font-semibold text-ivory`. Body: `font-body text-ivory/70 text-sm`.

**21st.dev usage:** Feature card pattern, dark variant.

---

### How It Works

Section heading: "How it works".

3 numbered steps, full-width stacked layout. Driven by `useScrollAnimation` + `.stagger-children-120` (120ms).

**Steps:**
1. Users icon — "Your dedicated team" — "We assign a consistent, vetted team to your building so you get familiar faces, not strangers."
2. Smartphone icon — "Real-time check-ins" — "They check in and out via our app — you get real-time notifications every visit."
3. LayoutDashboard icon — "Your dashboard, your control" — "Manage everything from your dashboard — schedules, reports, and flagged issues in one place."

Each step: Large step number (`font-heading font-bold text-brass text-6xl opacity-20`), icon in `bg-green/20` circle, `font-heading font-semibold text-ivory`, `font-body text-ivory/70`. Horizontal `<hr className="border-brass/10">` between steps.

**Built from scratch** — no 21st.dev base.

---

### Services

Section heading: "Our services".

4 service cards in a 2×2 grid. Driven by `useScrollAnimation` + `.stagger-children` (80ms).

**Cards:**
1. Building2 icon — "Office Cleaning" — "Daily or weekly cleans tailored to your office layout and hours."
2. DoorOpen icon — "Communal Areas" — "Reception, kitchens, corridors and shared spaces kept pristine."
3. Sparkles icon — "Deep Cleans" — "Scheduled or one-off deep cleans for carpets, upholstery, and hard-to-reach areas."
4. Plus icon — "Flexible Add-ons" — "Waste management, washroom supplies, pest control — added as needed."

Each card: `bg-charcoal border border-brass/15 rounded-xl p-6`. Icon in `bg-green/20 rounded-lg p-3`. Hover: `hover:border-brass/40 transition-colors duration-200`.

**21st.dev usage:** Feature card pattern, icon variant.

---

### Mr Brush Difference

Section heading: "The Mr Brush difference". Driven by `useScrollAnimation` + `.scroll-fade` on section.

**4 feature points (left column or stacked):**
1. Zap icon — "Tech-powered automation" — "GPS check-ins, digital task lists, and automated reporting after every visit."
2. ShieldCheck icon — "Vetted, consistent staff" — "DBS-checked, trained, and assigned to your building long-term."
3. FileText icon — "Transparent billing & reporting" — "See exactly what was done, when, and by whom. Invoices match reports."
4. XCircle icon — "No lock-in contracts" — "Flexible terms that work around you. Cancel with 30 days notice."

**Dashboard Preview Card** (separate `useScrollAnimation` instance on the card element):
- `bg-slate border border-brass/20 rounded-xl overflow-hidden`
- Header bar: "Client Dashboard Preview" (`font-body text-sm text-ivory/60`) + "● Live" badge
  - Live badge: `bg-green/20 text-green text-xs px-2 py-0.5 rounded-full` + `.live-pulse` class on the green dot
- 4 rows with `.dash-row` class (auto-staggered via CSS nth-child):
  - Row 1: CheckCircle2 (green) — "Floor 3 — Cleaned" — "09:14 AM"
  - Row 2: CheckCircle2 (green) — "Reception — Cleaned" — "08:47 AM"
  - Row 3: Loader2 (brass, rotating) — "Kitchen — In Progress" — "09:30 AM" + `.row-shimmer` on this row
  - Row 4: FileText (ivory/60) — "Weekly Report Ready" — "View →" (brass link)
- Rows are only animated when the card enters viewport (use the second `useScrollAnimation` hook ref on the card's `<div>`)

**Built from scratch** — no 21st.dev base.

---

### Ratings

Section heading: "Your team, rated by you". Subheading: "After every clean, you rate your team. That feedback directly shapes their performance reviews and pay."

**Important context:** This section shows a client reviewing a *cleaning staff member* — not a client testimonial about Mr Brush. Jamie D. is a Lead Cleaner being rated by an office manager. This is the product differentiator (accountability through ratings).

**Review card (21st.dev testimonial pattern):**
- Avatar: "JD" initials in `bg-brass text-charcoal rounded-full`
- Name: "Jamie D." | Role: "Lead Cleaner"
- 5 stars: Star icons, `fill-brass text-brass`
- Quote: "Thorough, punctual, and always leaves the kitchen spotless. Best cleaner we've had in years."
- Attribution: "Submitted Tuesday 4 March · Floor 3"

**3 badge pills (below card, centred):**
- `bg-charcoal border border-brass/20 rounded-full px-4 py-2 font-body text-sm text-ivory/80`
- ⭐ Staff incentivised by ratings
- 📋 Feedback logged automatically
- 🔄 Poor performance flagged instantly

Driven by `useScrollAnimation` + `.scroll-fade`.

---

### Trust Signals

Section heading: "Why clients trust us".

4 icon tiles in a row (2×2 on mobile). Driven by `useScrollAnimation` + `.stagger-children` (80ms).

1. ShieldCheck — "DBS Checked Staff"
2. Lock — "Fully Insured"
3. BarChart2 — "Real-time Reporting"
4. UserCheck — "Dedicated Supervisor"

Each tile: `flex flex-col items-center gap-3`. Icon in `bg-green/15 rounded-full w-16 h-16 flex items-center justify-center`. Label: `font-heading font-semibold text-ivory text-sm text-center`.

**Built from scratch** — no 21st.dev base.

---

### Get a Quote

Section heading: "Get a quote". Subheading: "Tell us about your space and we'll get back to you within 1 business day."

**Form fields:**
- Full Name (text, `placeholder="John Smith"`)
- Company (text, `placeholder="Acme Corp"`)
- Office Size (select): Under 1,000 sq ft / 1,000–5,000 sq ft / 5,000–10,000 sq ft / 10,000+ sq ft
- Frequency (select): Daily / 3× per week / Weekly / Fortnightly / One-off
- Email (email, `placeholder="john@acme.com"`)
- Phone (tel, `placeholder="+44 7700 000000"`)
- Submit: "Request Your Quote →" — `bg-green text-ivory font-body font-bold w-full py-4 rounded-xl`

**Field styling:**
- Base: `bg-charcoal border border-ivory/20 rounded-lg px-4 py-3 text-ivory font-body`
- Focus: `border-brass ring-1 ring-brass/40 outline-none`
- Labels: `font-body text-sm text-ivory/70 mb-1`

**Submit interaction:**
1. Click: button disables, shows `<Loader2 className="animate-spin" />` for 1.2s (simulated)
2. After 1.2s: form div fades out via `.form-fade-out` class
3. Success div fades in via `.success-fade-in` class, containing:
   - SVG checkmark (inline): `<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="none" stroke="#2f4a3d" strokeWidth="2"/><path d="M14 27 L22 35 L38 19" fill="none" stroke="#2f4a3d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="check-draw"/></svg>` — **`pathLength="1"` on the `<path>` is load-bearing for the dash animation; do not remove it**
   - "We'll be in touch shortly." — `font-heading font-bold text-ivory text-2xl`
   - "Expect a response within 1 business day." — `font-body text-ivory/70`

**21st.dev usage:** Form field components and floating label pattern, restyled to brand.

---

### Footer

Background: `bg-charcoal border-t border-brass/15 py-16`.

**Layout (desktop: 3-column flex row; mobile: stacked):**
- Col 1: Logo (`LOGO_SRC`, `h-10 w-auto`) + tagline `font-body text-ivory/50 text-sm`
- Col 2: Nav links — Services, How It Works, Why Us, Get a Quote — `font-body text-ivory/70 hover:text-brass text-sm`
- Col 3: Social icons row — LinkedIn, Instagram, Twitter (use Lucide `Twitter`; if not found in installed version, use `ExternalLink` as fallback with aria-label)

**Bottom bar:** `border-t border-ivory/10 mt-8 pt-6 flex justify-between`
- Left: `© {new Date().getFullYear()} Mr Brush & Co. All rights reserved.` — `font-body text-ivory/30 text-xs`
- Right: Privacy Policy + Terms of Service links — `font-body text-ivory/30 hover:text-ivory/60 text-xs`

**Built from scratch** — no 21st.dev base.

---

## 21st.dev Component Mappings

| Section | 21st.dev | Customisation | Notes |
|---|---|---|---|
| Navigation | Nav with mobile menu | Transparent→charcoal transition, brand tokens | Fall back to scratch if pattern too opinionated |
| Problem | Feature card (dark) | Brass icon, charcoal bg | |
| Services | Feature card (icon variant) | Green icon bg, hover border | |
| Ratings | Testimonial / review card | Brass stars, charcoal card bg | Staff rating card, not client testimonial |
| Get a Quote | Form with floating labels | Brass focus ring, success state | |
| HowItWorks | — | Built from scratch | |
| MrBrushDifference | — | Built from scratch | |
| TrustSignals | — | Built from scratch | |
| Footer | — | Built from scratch | |

All 21st.dev components are fetched via the MCP during implementation and adapted inline — not installed as packages.

---

## Non-Goals

- No routing (single page)
- No backend / API calls (form is UI-only)
- No CMS integration
- No cookie consent / analytics
- No new npm packages
