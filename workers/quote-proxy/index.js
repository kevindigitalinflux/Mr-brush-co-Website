/**
 * Mr Brush & Co — Quote Proxy Worker
 *
 * Sits between the frontend and Supabase so rate limiting is enforced
 * at the Cloudflare edge before requests ever reach Supabase.
 *
 * Rate limit: 5 POST requests per IP per 60 seconds
 * Route:      POST /api/quote  →  Supabase REST API
 */

const SUPABASE_URL   = 'https://evbhucoaxcudjtlrhjfw.supabase.co'
const SUPABASE_TABLE = 'quote_requests'

export default {
  async fetch(request, env) {
    // ── CORS preflight ────────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) })
    }

    // ── Only accept POST ──────────────────────────────────────────────────────
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      })
    }

    // ── Rate limiting — 5 requests / IP / 60 s ────────────────────────────────
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const { success } = await env.RATE_LIMITER.limit({ key: ip })
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Too many requests — please wait a moment and try again.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            ...corsHeaders(request),
          },
        }
      )
    }

    // ── Parse and validate body ───────────────────────────────────────────────
    let body
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      })
    }

    const { name, email, phone, company, service_type, message } = body

    if (!name || typeof name !== 'string' || name.trim().length < 1) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      })
    }
    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      })
    }

    // Sanitise — only pass known fields, hard-truncate lengths
    const payload = {
      name:         String(name).trim().slice(0, 200),
      email:        String(email).trim().slice(0, 254),
      phone:        phone        ? String(phone).trim().slice(0, 30)    : null,
      company:      company      ? String(company).trim().slice(0, 200)  : null,
      service_type: service_type ? String(service_type).trim().slice(0, 200) : null,
      message:      message      ? String(message).trim().slice(0, 2000) : null,
    }

    // ── Forward to Supabase ───────────────────────────────────────────────────
    const supabaseRes = await fetch(
      `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!supabaseRes.ok) {
      console.error('Supabase error:', supabaseRes.status, await supabaseRes.text())
      return new Response(
        JSON.stringify({ error: 'Submission failed — please try again.' }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
        }
      )
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
    })
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || ''
  const allowed = [
    'https://mr-brush-co.pages.dev',
    'http://localhost:5173',
    'http://localhost:4173',
  ]
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0]
  return {
    'Access-Control-Allow-Origin':  allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}
