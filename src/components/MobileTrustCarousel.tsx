import { useEffect, useRef } from 'react'
import { trustSignals as signals } from '../lib/trustSignals'

const CARD_W = 280
const CARD_GAP = 16
const CARD_STRIDE = CARD_W + CARD_GAP  // 296px per step

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/**
 * Swipeable inertia carousel for trust signals — mobile only.
 * Triple-duplicates cards for seamless infinite looping; snaps to nearest card on release.
 */
export function MobileTrustCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef(0)
  const scrollRef = useRef({ current: 0, target: 0 })
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    startScroll: 0,
    intentDetermined: false,
    isHorizontal: false,
  })
  const velRef = useRef({ v: 0, lastX: 0, lastTime: 0 })

  const cards = [...signals, ...signals, ...signals]
  const setWidth = CARD_STRIDE * signals.length  // 296 × 6 = 1776

  useEffect(() => {
    scrollRef.current.current = setWidth
    scrollRef.current.target = setWidth

    const tick = () => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track || container.offsetWidth === 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const s = scrollRef.current
      s.current = lerp(s.current, s.target, 0.09)

      // Infinite wrap — keep viewport inside the middle card set
      if (s.current >= setWidth * 1.5) { s.current -= setWidth; s.target -= setWidth }
      if (s.current < setWidth * 0.5) { s.current += setWidth; s.target += setWidth }

      // Centre the first visible card in the viewport
      const padLeft = (container.offsetWidth - CARD_W) / 2
      track.style.transform = `translateX(${padLeft - s.current}px)`

      // Per-card arc: cards at edges drop down and fade slightly
      const centerX = container.offsetWidth / 2
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const cx = padLeft - s.current + i * CARD_STRIDE + CARD_W / 2
        const d = Math.max(-1, Math.min(1, (cx - centerX) / (container.offsetWidth * 0.65)))
        el.style.transform = `translateY(${d * d * 16}px) scale(${1 - Math.abs(d) * 0.05})`
        el.style.opacity = String(Math.max(0.3, 1 - Math.abs(d) * 0.4))
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [setWidth])

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    const d = dragRef.current
    d.isDown = true
    d.startX = t.clientX
    d.startY = t.clientY
    d.startScroll = scrollRef.current.target
    d.intentDetermined = false
    d.isHorizontal = false
    velRef.current = { v: 0, lastX: t.clientX, lastTime: performance.now() }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const d = dragRef.current
    if (!d.isDown) return
    const t = e.touches[0]

    // Determine horizontal vs vertical intent on first movement > 6px
    if (!d.intentDetermined) {
      const dx = Math.abs(t.clientX - d.startX)
      const dy = Math.abs(t.clientY - d.startY)
      if (dx < 6 && dy < 6) return
      d.intentDetermined = true
      d.isHorizontal = dx > dy * 0.9
    }
    if (!d.isHorizontal) return

    const now = performance.now()
    const dt = now - velRef.current.lastTime
    if (dt > 0 && dt < 100) velRef.current.v = (velRef.current.lastX - t.clientX) / dt
    velRef.current.lastX = t.clientX
    velRef.current.lastTime = now

    scrollRef.current.target = d.startScroll + (d.startX - t.clientX) * 1.1
  }

  const onTouchEnd = () => {
    const d = dragRef.current
    if (!d.isDown) return
    d.isDown = false
    if (!d.isHorizontal) return
    // Project velocity forward ~160ms, then snap to nearest card
    const projected = scrollRef.current.target + velRef.current.v * 160
    scrollRef.current.target = Math.round(projected / CARD_STRIDE) * CARD_STRIDE
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden py-6"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div ref={trackRef} className="flex" style={{ willChange: 'transform' }}>
        {cards.map((signal, i) => (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el }}
            aria-hidden={i < signals.length || i >= signals.length * 2}
            className="w-[280px] shrink-0 mr-4 bg-charcoal/50 border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="bg-white/10 rounded-xl w-12 h-12 flex items-center justify-center shrink-0">
              <signal.icon size={22} className="text-brass" />
            </div>
            <div>
              <p className="font-heading font-semibold text-ivory text-sm mb-1.5">{signal.label}</p>
              <p className="font-body text-ivory/55 text-sm leading-relaxed">{signal.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
