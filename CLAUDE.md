# Mr Brush & Co. — Marketing Website

## What This Is
The public-facing marketing website for Mr Brush & Co. Separate project from the internal operations app (`Mr-Brush-App`). Designed to convert B2B prospects (building managers, facilities teams) into quote requests. Brand-forward, interactive hero, and full page with sections covering services, trust signals, and a quote form.

---

## Tech Stack

| Layer | Value |
|---|---|
| Framework | React 18 with TypeScript |
| Build Tool | Vite (latest) |
| Styling | Tailwind CSS v3 — utility classes only |
| Animation | GSAP 3 (SpongeAnimation, scroll effects) |
| Icons | lucide-react |
| Hosting | Cloudflare Pages (auto-deploy from GitHub main) |
| Version Control | GitHub — `kevindigitalinflux/Mr-brush-co-Website` |
| Dev server | `npm run dev` → localhost:5173 |

---

## Project Structure

```
src/
├── components/
│   ├── Hero.tsx                  # Hero section shell — mounts HeroCanvas + SpongeAnimation
│   ├── HeroCanvas.tsx            # Three-layer canvas reveal + wet effect + sponge cursor
│   ├── SpongeAnimation.tsx       # Full-screen intro sponge sweep (GSAP rAF, all devices)
│   ├── Navigation.tsx            # Fixed top nav with scroll transition + mobile overlay
│   ├── AnimatedHeading.tsx       # GSAP stagger heading animation
│   ├── ProblemSolution.tsx       # "Sound familiar?" pain points + solution pairs
│   ├── HowItWorks.tsx            # 3-step process section
│   ├── Services.tsx              # Service cards (office, kitchen, deep clean, add-ons)
│   ├── MrBrushDifference.tsx     # Differentiators (app, proof, complaints, ratings)
│   ├── AppMockup.tsx             # Animated phone mockup of the cleaner app
│   ├── TrustSignals.tsx          # Marquee strip of trust credentials
│   ├── Ratings.tsx               # Review cards + badge pills
│   ├── GetAQuote.tsx             # Quote request form (webhook to n8n)
│   ├── Footer.tsx                # Footer with social links
│   ├── CleaningProgressIndicator.tsx  # Scroll-linked cleaning progress bar
│   ├── SectionRevealEffect.tsx   # Scroll-based dirty→clean section reveal
│   └── SectionCleanEffect.tsx    # Scroll-based clean veil effect
├── lib/
│   └── gsap.ts                   # GSAP instance + plugin registration
├── index.css                     # Tailwind + custom keyframes (wipe, sparkle, stagger, marquee)
└── App.tsx                       # Root — composes all sections in order
public/
├── hero-office.png               # Office photo revealed by hero canvas wipe
├── logo.png                      # Mr Brush & Co. full logo
├── service-*.png                 # Service card images
└── _headers                      # Cloudflare security headers (CSP, HSTS, etc.)
```

---

## Brand Tokens

| Token | Value |
|---|---|
| Primary background | `#F5F4EF` (Soft Ivory) |
| Deep green | `#2F4A3D` (hero bg, CTA bg) |
| Charcoal | `#3D3B3A` (body bg) |
| Brass | `#B8A77A` (accents, highlights) |
| Slate grey | `#434B4D` (secondary text) |
| Card border | `#D0CFCA` |
| Heading font | Poppins (Bold / SemiBold) — Tailwind class `font-heading` |
| Body font | Lato (Regular / Light) — Tailwind class `font-body` |

---

## Hero Canvas Architecture

The hero is the most technically complex component. Three canvas layers stacked in `HeroCanvas.tsx`:

```
z:1  Photo div           — office photo, always visible beneath
z:2  wetCanvas           — mix-blend-mode: screen — wet/soapy sheen, fades ~3s
z:3  dirtyCanvas         — grime layer, erased by mouse/finger on drag
z:4  Dot-grid texture    — branded grain overlay (pointer-events: none)
z:10 Hero content        — logo, headings, CTAs
z:50 SpongeAnimation     — position:fixed, full-screen intro, removed after completion
```

### Dirty layer (`drawDirt`)
- Base: `#2F4A3D` + radial vignette (edges/corners darkened up to 58%)
- 20 grime patches: central blobs, corner accumulations, edge bands, rust/brown stains
- 8 deterministic streak marks (smeared grime lines across the surface)

### Wipe brush (`wipe`)
- `destination-out` composite — erases dirty canvas pixels
- Anisotropic: `scale(0.78, 1.18)` after `rotate(movAngle)` — narrow in movement direction, wide perpendicular (sponge face shape)
- Interpolated every 2px so no gaps at speed

### Wet sheen layer (`paintWet` + `fadeWetLayer`)
- Three overlapping radial gradients per stamp: main blue-white sheen, iridescent soap-film ring, specular hot-spot
- `mix-blend-mode: screen` on the canvas element — adds brightness/reflectivity, not just tint
- rAF decay: `globalAlpha = 0.014` + `destination-out` per frame → multiplicative fade, ~3s to dry (0.986^180 ≈ 8% remaining)

### Sponge cursor (desktop)
- Canvas element, drawn once on mount via `drawSponge()`
- Yellow gradient body with 15 deterministic pores, green scrubby strip with vertical fibers, soap shimmer highlight
- Rotates to face movement direction; no speed-stretching (sponges don't deform)

### Mobile support
- `BRUSH_MOUSE = 88`, `BRUSH_TOUCH = 110` (wider for fingers)
- Touch events registered with `{ passive: true }` — page scroll not blocked
- Cursor canvas stays hidden on touch devices
- `section.style.cursor = 'none'` only applied on `pointer: fine` devices

---

## Sections & Status

| Section | Component | Status |
|---|---|---|
| Navigation | `Navigation.tsx` | ✅ Complete |
| Hero — intro animation | `SpongeAnimation.tsx` | ✅ Complete |
| Hero — interactive wipe | `HeroCanvas.tsx` | ✅ Complete (2026-06-10) |
| Problem / Solution | `ProblemSolution.tsx` | ✅ Complete |
| How It Works | `HowItWorks.tsx` | ✅ Complete |
| Services | `Services.tsx` | ✅ Complete |
| App Mockup | `AppMockup.tsx` | ✅ Complete |
| Mr Brush Difference | `MrBrushDifference.tsx` | ✅ Complete |
| Trust Signals | `TrustSignals.tsx` | ✅ Complete |
| Ratings | `Ratings.tsx` | ✅ Complete |
| Get a Quote | `GetAQuote.tsx` | ✅ Complete |
| Footer | `Footer.tsx` | ✅ Complete |
| Scroll effects | `SectionRevealEffect.tsx`, `SectionCleanEffect.tsx` | ✅ Complete |

---

## Current Status (2026-06-10)

**Working:**
- Full website built and deployed at Cloudflare Pages (auto-deploys from `main`)
- Hero interactive canvas wipe — dirty surface reveals office photo on mouse drag (desktop) and finger swipe (mobile)
- Wet sponge effect — freshly wiped areas show blue-white soap sheen that dries over ~3 seconds
- Canvas-drawn sponge cursor (desktop) — yellow body, green scrubby strip, iridescent soap shimmer
- Intro sponge animation (`SpongeAnimation`) — full-screen sweep before interactive mode activates
- Hero fills full screen edge-to-edge (covering strip removed 2026-06-10)
- All sections complete and wired up
- Quote form posts to n8n webhook

**In progress:** Nothing — website is complete

**Known issues:** None

**Not started:**
- CMS / content management (all copy is hardcoded)
- Analytics integration
- A/B testing on hero CTA copy

---

## Key Decisions

- **No UnicornScene** — Unicorn Studio WebGL was the original hero background but was replaced with the canvas dirty-reveal system. `unicornstudio-react` remains in `package.json` but is not used.
- **`mix-blend-mode: screen` on wet canvas** — gives realistic reflective wetness (brightens the revealed image) rather than a flat colour tint
- **Deterministic dirt** — all grime patches and streak positions are hardcoded arrays (no `Math.random()` in `drawDirt`) so the surface looks consistent on every load and resize
- **`passive: true` on touch events** — preserves native scroll behaviour; wipe and scroll can coexist on mobile

---

## Do Not Touch
- Canvas layer z-index ordering (photo:1 / wet:2 / dirty:3 / dot-grid:4 / content:10) — changing these breaks the reveal compositing
- `mix-blend-mode: screen` on the wet canvas — changing blend mode changes the entire wet effect character
- Brand colour tokens — exact hex values only
