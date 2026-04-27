import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const QUOTE_PROXY_URL = import.meta.env.VITE_QUOTE_PROXY_URL ?? 'https://mr-brush-quote-proxy.kevindigitalinflux.workers.dev'

const inputClass = `
  w-full bg-charcoal border border-ivory/20 rounded-lg px-4 py-3
  font-body text-ivory placeholder:text-ivory/30 text-sm
  focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/40
  transition-all duration-200
`.trim()

const labelClass = 'block font-body text-sm text-ivory/70 mb-1.5'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function GetAQuote() {
  const ref = useScrollAnimation<HTMLDivElement>()
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    name: '',
    company: '',
    service_type: '',
    frequency: '',
    email: '',
    phone: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch(QUOTE_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          company: form.company || null,
          service_type: [form.service_type, form.frequency].filter(Boolean).join(' · ') || null,
          message: null,
        }),
      })

      if (res.status === 429) {
        setErrorMsg('Too many requests — please wait a moment and try again.')
        setState('error')
      } else if (!res.ok) {
        setErrorMsg('Something went wrong — please try again or email us directly.')
        setState('error')
      } else {
        setState('success')
      }
    } catch {
      setErrorMsg('Something went wrong — please try again or email us directly.')
      setState('error')
    }
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
                    <label htmlFor="name" className={labelClass}>Full Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className={labelClass}>Company</label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="service_type" className={labelClass}>Office Size</label>
                      <select
                        id="service_type"
                        name="service_type"
                        value={form.service_type}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        <option value="">Select size…</option>
                        <option>Under 1,000 sq ft</option>
                        <option>1,000–5,000 sq ft</option>
                        <option>5,000–10,000 sq ft</option>
                        <option>10,000+ sq ft</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="frequency" className={labelClass}>Frequency</label>
                      <select
                        id="frequency"
                        name="frequency"
                        value={form.frequency}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
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
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@acme.com"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+44 7700 000000"
                      className={inputClass}
                    />
                  </div>

                  {state === 'error' && (
                    <p className="font-body text-sm text-red-400 text-center">{errorMsg}</p>
                  )}

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
                aria-hidden="true"
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
