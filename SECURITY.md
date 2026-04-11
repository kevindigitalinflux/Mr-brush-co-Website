# Security Documentation — Mr Brush & Co

Last updated: 2026-04-11

---

## Project Overview

This is a **pure frontend** React/Vite/TypeScript marketing website deployed on Vercel, connected to Supabase for a single public quote-request form. There is no backend, no custom API server, and no user authentication at this time.

---

## What Was Implemented

### 1. Environment Variables

| Variable | File | Purpose | Safe to expose? |
|---|---|---|---|
| `VITE_SUPABASE_URL` | `.env.local` | Supabase project URL | Yes — public identifier |
| `VITE_SUPABASE_ANON_KEY` | `.env.local` | Supabase public/anon client key | Yes — RLS is the guard |

- All client-side env vars use the `VITE_` prefix (Vite requirement).
- Both values are intentionally bundled into the client JS at build time — this is expected Supabase architecture. The anon key is a **public key**; Row Level Security is the security layer, not key secrecy.
- `.env.local` is listed in `.gitignore` and has **never been committed**.
- `.env.example` was created with placeholder values for team reference.

**Important:** `SUPABASE_SERVICE_ROLE_KEY` and `API_SECRET_KEY` are **not present** in this project because there is no server-side code. If Edge Functions or a backend are added in future, these must be stored as Vercel Environment Variables (server-side only), never prefixed with `VITE_`, and never committed to source.

---

### 2. Security Headers (Vercel)

Added to `vercel.json` — applied to all responses:

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS; HSTS preload eligible |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `X-Frame-Options` | `DENY` | Blocks clickjacking via iframes |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |
| `Content-Security-Policy` | See `vercel.json` | Restricts resource origins |

The CSP allows:
- `'unsafe-inline'` and `'unsafe-eval'` on scripts — required by GSAP and Vite's runtime. Review and tighten if a nonce-based approach becomes feasible.
- `images.unsplash.com` — background images used in section effects
- `*.supabase.co` — API and WebSocket connections for the quote form

---

### 3. Database Security (Supabase)

The `quote_requests` table receives public form submissions.

**Action required — run `supabase-rls.sql` in Supabase SQL Editor:**

- Enables Row Level Security on `quote_requests`
- Grants `INSERT` to the `anon` role (public form submissions)
- Grants `SELECT` to `authenticated` role (future admin)
- All other operations (UPDATE, DELETE) are implicitly denied

Until this SQL is run, the table **may be publicly readable and writable without restriction**. Run it immediately.

---

### 4. Access Control — Key Rules

| Key | Where used | Correct? |
|---|---|---|
| `VITE_SUPABASE_ANON_KEY` | `src/lib/supabaseClient.ts` | ✅ Client-side only |
| `SUPABASE_SERVICE_ROLE_KEY` | Nowhere | ✅ Not present — no server code yet |

- The service role key bypasses RLS entirely. It must **never** appear in any `VITE_*` variable, any file committed to git, or any client-side bundle.
- If a service role key is ever needed (e.g. for admin functions), it must live exclusively in Vercel's server-side environment variables and only be accessed from Edge Functions.

---

### 5. Data Collection & GDPR

The quote form collects: **name, email, phone (optional), company (optional), service type, frequency**.

This constitutes personal data under GDPR. Required actions:

- [ ] Add a **Privacy Policy** page and link it from the quote form
- [ ] Add a consent checkbox to the quote form ("I agree to be contacted...")
- [ ] Implement a **data deletion route** (email request or admin UI)
- [ ] Confirm your Supabase project's data region (EU vs US) matches your compliance requirements
- [ ] If sending transactional email to enquirers, ensure your email provider is GDPR-compliant

---

## Manual Actions Required

These cannot be done in code — they require browser/dashboard access.

### GitHub (do after this session)

- [ ] Protect the `main` branch: Settings → Branches → Add rule → `main`
- [ ] Require pull request approvals before merging (at least 1 reviewer)
- [ ] Disable direct pushes to `main`
- [ ] Enable "Require status checks to pass before merging" once CI is set up
- [ ] Enable Dependabot security alerts: Settings → Security → Dependabot

### Supabase (do now)

- [ ] Run `supabase-rls.sql` in SQL Editor to enable RLS on `quote_requests`
- [ ] Verify no other tables exist that lack RLS: Dashboard → Database → Tables → check the RLS column
- [ ] Confirm your Supabase project's Auth settings have email confirmation enabled (for when you add user auth)
- [ ] Review Storage buckets — ensure none are set to public unless explicitly required

### Cloudflare (if DNS/proxy is through Cloudflare)

- [ ] Ensure SSL/TLS mode is set to **Full (Strict)** — not Flexible
- [ ] Enable **Bot Fight Mode** to reduce form spam
- [ ] Consider adding a **WAF rate-limiting rule** on the Supabase API endpoint (e.g. max 10 requests/minute per IP to `https://*.supabase.co/rest/v1/quote_requests`) to prevent form flooding
- [ ] Enable **DDoS protection** (enabled by default on all plans)

---

## Risks and Gaps

| Risk | Severity | Status |
|---|---|---|
| RLS not confirmed as enabled on `quote_requests` | **High** | SQL provided — run immediately |
| No rate limiting on quote form submission | Medium | Cloudflare WAF rule recommended (see above) |
| CSP uses `unsafe-inline` / `unsafe-eval` | Low | Required by GSAP; acceptable for a marketing site |
| No GDPR consent mechanism on quote form | Medium | Manual action required |
| No admin authentication system | Low | Not needed for current scope; add before building admin views |
| Vercel OIDC token in `.vercel/.env.development.local` | Low | This file is in `.gitignore` ✅; token is short-lived and auto-rotated by Vercel CLI |

---

## Role Access Matrix

| Role | Route/Resource | Access |
|---|---|---|
| `anon` (public) | `quote_requests` INSERT | ✅ Allowed (quote form) |
| `anon` (public) | `quote_requests` SELECT/UPDATE/DELETE | ❌ Denied by RLS |
| `authenticated` | `quote_requests` SELECT | ✅ Allowed (future admin) |
| `authenticated` | `quote_requests` UPDATE/DELETE | ❌ Denied (not yet defined) |
| Service role | All tables | Full access — server-side only, key not in project |
