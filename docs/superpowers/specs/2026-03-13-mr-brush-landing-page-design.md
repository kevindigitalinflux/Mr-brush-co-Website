# Mr Brush & Co. — Interactive Landing Page Design Spec
**Date:** 2026-03-13
**Status:** Approved for implementation

---

## Overview

Rebuild the Mr Brush & Co. single-page marketing site as a premium, animated landing page. The site targets office managers and facilities leads at commercial tenants. The core brand proposition — "tech-forward cleaning with accountability" — must be felt through every interaction, not just copy.

**Stack:** React 18 + TypeScript + Tailwind CSS + Lucide React + 21st.dev MCP components (restyled to brand). No new npm packages.

---

## Brand Tokens

| Token | Value |
|---|---|
| `ivory` | `#F5F4EF` |
| `charcoal` | `#3d3b3a` |
| `slate` | `#434b4d` |
| `green` | `#2f4a3d` |
| `brass` | `#B8A77A` |
| Heading font | Poppins (700, 600) |
| Body font | Lato (400, 700) |
| Logo | `LOGO_SRC` from `../logo` — base64 PNG, brass/gold on transparent |

---

## Architecture

### File Structure

```
src/
  logo.ts                        — unchanged
  index.css                      — rebuilt: wipe keyframes, scroll-fade, dashboard animations
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

### Constraints
- No new npm packages
- All components are self-contained (no shared state beyond what's in each component)
- Logo always loaded via `LOGO_SRC` import — never `/logo.png`
- Tailwind custom tokens (`ivory`, `charcoal`, `brass`, etc.) used throughout — no raw hex values in JSX

---

## Section Designs

### Navigation

**Behaviour:**
- Fixed to top, full width, `z-50`
- Default: transparent background
- On scroll > 80px: transitions to `bg-charcoal/90 backdrop-blur-md shadow-lg` over 300ms
- Links: Services, How It Works, Why Us
- CTA button: "Get a Quote" → `#quote`, styled `bg-green text-ivory`

**Mobile:**
- Hamburger icon (Lucide `Menu`) → `X` with 200ms rotation transition
- Full-screen overlay (`bg-charcoal`) slides/fades in
- Nav links stagger in at 60ms intervals
- Body scroll locked while open

**21st.dev usage:** Nav base pattern, restyled to brand tokens.

---

### Hero

**The centrepiece interaction.**

**Layers (bottom → top):**
1. Background image: `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80` — full bleed, `object-cover`
2. Permanent gradient overlay: `linear-gradient(160deg, rgba(47,74,61,0.4), rgba(61,59,58,0.7))` — always present, subtle
3. Dirty overlay: `bg-charcoal/80` + CSS grain texture (`backdrop-blur(2px)` + SVG noise filter) — wiped away
4. Squeegee streak: 80px-wide vertical gradient div (`transparent → brass/30% → white/15% → transparent`) — travels left→right
5. Content layer: logo + headline + tagline + CTA — revealed by wipe

**Wipe mechanics (CSS clip-path):**
- Dirty overlay: `clip-path: inset(0 0 0 0)` → `inset(0 0 0 100%)` — animates away left-to-right
- Content layer: `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)` — reveals in sync
- Both use `cubic-bezier(0.4, 0, 0.2, 1)` easing over 1.5s
- Streak div: `left: -5%` → `left: 105%` over 1.5s, `ease-in-out`

**Timing sequence:**
```
0ms    — page load, dirty overlay covers everything
100ms  — wipe animation begins (all three layers simultaneously)
1600ms — wipe complete
1700ms — headline fades up (0.6s, ease-out)
1900ms — tagline fades up (0.5s)
2100ms — CTA fades up (0.5s)
```

**Content:**
- Logo: `h-16 md:h-20`, centered
- Headline: "Your office, always clean. Always accountable." — Poppins 700, `text-4xl md:text-5xl lg:text-6xl`, ivory
- Tagline: "Managed by tech. Delivered by people." — Lato, ivory/70
- CTA: "Get a Quote →" → `#quote`, `bg-green` pill button

---

### Problem

4 pain-point cards in a 2×2 grid.

**Cards:**
1. No-shows with no warning
2. No way to verify work was done
3. Issues go unreported
4. Rigid contracts, slow responses

**Each card:** Lucide icon (brass, 28px) + heading (Poppins 600) + body (Lato, ivory/70). Dark card background (`bg-charcoal` border `border-brass/15`).

**Animation:** Section fades up on scroll. Cards stagger in at 80ms intervals (cards 1→4).

---

### How It Works

3 numbered steps, full-width stacked layout.

**Steps:**
1. Your dedicated team — consistent vetted team assigned to your building
2. Real-time check-ins — GPS check-in/out via app, real-time notifications
3. Your dashboard, your control — manage schedules, reports, flags from dashboard

**Each step:** Large step number (Poppins 700, brass, `text-6xl opacity-20`), Lucide icon, heading, body. Horizontal rule separator between steps. Staggered scroll entrance (120ms between steps).

---

### Services

4 service cards in a 2×2 grid.

**Services:**
1. Office Cleaning — daily/weekly tailored cleans
2. Communal Areas — reception, kitchens, corridors
3. Deep Cleans — scheduled or one-off, carpets/upholstery
4. Flexible Add-ons — waste, washroom supplies, pest control

**Each card:** Icon in a `bg-green/20` rounded square + heading + body. Hover: `border-brass/40` border lift. Stagger entrance at 80ms.

---

### Mr Brush Difference

4 feature points + dashboard preview card.

**Points:**
1. Tech-powered automation — GPS check-ins, digital task lists, automated reporting
2. Vetted, consistent staff — DBS-checked, trained, assigned to your building
3. Transparent billing & reporting — see what was done, when, by whom
4. No lock-in contracts — flexible terms, cancel with 30 days notice

**Dashboard Preview Card:**
- Dark `bg-charcoal` card, `border border-brass/20`, rounded-xl
- Header: "Client Dashboard Preview" label + "● Live" badge (green dot with 2s pulse glow animation)
- 4 status rows:
  - ✓ Floor 3 — Cleaned · 09:14 AM
  - ✓ Reception — Cleaned · 08:47 AM
  - ⟳ Kitchen — In Progress · 09:30 AM (shimmer animation on this row)
  - 📋 Weekly Report Ready · View →
- Rows stagger in at 120ms intervals on card enter viewport
- "Kitchen" row has a subtle left-to-right shimmer (`bg-gradient-to-r from-transparent via-brass/10 to-transparent`) on 3s loop

---

### Ratings

Review card + 3 badge pills.

**Review card (21st.dev):**
- Avatar initials: "JD" in brass circle
- Name: Jamie D. — Lead Cleaner
- 5 brass stars
- Quote: "Thorough, punctual, and always leaves the kitchen spotless."
- Attribution: "Submitted Tuesday 4 March · Floor 3"

**3 badge pills (below card):**
- ⭐ Staff incentivised by ratings
- 📋 Feedback logged automatically
- 🔄 Poor performance flagged instantly

---

### Trust Signals

4 icon + label tiles in a row (2×2 on mobile).

1. Shield — DBS Checked Staff
2. Lock — Fully Insured
3. BarChart — Real-time Reporting
4. User — Dedicated Supervisor

Icon in `bg-green/15` circle, label in Poppins 600 ivory below. Scroll-triggered fade-up.

---

### Get a Quote

Form with success animation.

**Fields:**
- Full Name (text input)
- Company (text input)
- Office Size (select: Under 1,000 sq ft / 1,000–5,000 sq ft / 5,000–10,000 sq ft / 10,000+ sq ft)
- Frequency (select: Daily / 3× per week / Weekly / Fortnightly / One-off)
- Email (email input)
- Phone (tel input)
- Submit button: "Request Your Quote →"

**Interactions:**
- Focus state: `border-brass` + `ring-1 ring-brass/40` + label lifts (floating label pattern via 21st.dev)
- Submit: button shows spinner (Lucide `Loader2` rotating) for 1.2s
- Success: form fades out, replaced by green checkmark SVG sweep animation + "We'll be in touch shortly." + "Expect a response within 1 business day." — no API call, purely UI

**21st.dev usage:** Form field components and floating label pattern, restyled to brand.

---

### Footer

- Logo (`LOGO_SRC`, `h-10`)
- Tagline: "Managed by tech. Delivered by people."
- Nav links column: Services, How It Works, Why Us, Get a Quote
- Social icons row: LinkedIn, Instagram, Twitter (Lucide)
- Bottom bar: copyright + Privacy Policy + Terms of Service links
- Background: `bg-charcoal`, `border-t border-brass/15`

---

## CSS Architecture (`index.css`)

Key additions beyond existing utilities:

```css
/* Hero wipe */
@keyframes wipeReveal { ... }        /* dirty overlay clip-path animation */
@keyframes wipeContent { ... }       /* content layer clip-path animation */
@keyframes squeegeeStreak { ... }    /* streak div left position animation */

/* Post-wipe content entrance */
@keyframes heroFadeUp { ... }        /* headline / tagline / CTA */

/* Dashboard */
@keyframes livePulse { ... }         /* Live badge glow loop */
@keyframes rowShimmer { ... }        /* Kitchen row shimmer */
@keyframes dashRowIn { ... }         /* staggered row entrance */

/* Form */
@keyframes checkDraw { ... }         /* SVG checkmark stroke-dashoffset draw */
@keyframes formFadeOut { ... }       /* form exit on success */
```

Existing `.scroll-fade` / `.stagger-children` / `.hero-grain` classes are retained.

---

## 21st.dev Component Mappings

| Section | 21st.dev Component | Customisation |
|---|---|---|
| Navigation | Nav with mobile menu | Transparent→charcoal transition, brand tokens |
| Ratings | Testimonial / review card | Brass stars, charcoal card bg |
| Get a Quote | Form with floating labels | Brass focus ring, success state |
| Problem cards | Feature card | Dark bg, brass icon |
| Services cards | Feature card | Green icon bg, hover border |

All 21st.dev components are fetched via the MCP at build time and adapted — not installed as packages.

---

## Non-Goals

- No routing (single page)
- No backend / API calls (form is UI-only)
- No CMS integration
- No cookie consent / analytics
- No new npm packages
