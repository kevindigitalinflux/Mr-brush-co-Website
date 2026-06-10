import { useEffect, useRef } from 'react'
import { trustSignals as signals } from '../lib/trustSignals'

const CARD_W = 280
const CARD_GAP = 16
const CARD_STRIDE = CARD_W + CARD_GAP   // 296px per step
const AUTO_SPEED = 0.7                   // px/frame — ~42s per full loop at 60fps
const SNAP_PAUSE = 900                   // ms to pause auto-play after a user swipe
const EASE = 0.09

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/**
 * Auto-scrolling swipe carousel for trust signals — mobile only.
 * Continuously scrolls like the desktop marquee; touch swipes override then snap,
 * then auto-play resumes.
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
  // Timestamp until which auto-play is paused (0 = not paused)
  const snapUntilRef = useRef(0)

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
      const isDragging = dragRef.current.isDown
      const isSnapping = performance.now() < snapUntilRef.current

      if (!isDragging && !isSnapping) {
        // Auto-play: advance both together so lerp stays in sync (constant speed)
        s.target += AUTO_SPEED
        s.current += AUTO_SPEED
      }

      // Lerp toward target — does the work during and after a swipe snap
      s.current = lerp(s.current, s.target, EASE)

      // Infinite wrap — keep viewport inside the middle card set
      if (s.current >= setWidth * 1.5) { s.current -= setWidth; s.target -= setWidth }
      if (s.current < setWidth * 0.5) { s.current += setWidth; s.target += setWidth }

      const padLeft = (container.offsetWidth - CARD_W) / 2
      track.style.transform = `translateX(${padLeft - s.current}px)`

      // Per-card arc: edges drop and fade slightly
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
    // Require dt > 8ms to avoid near-zero divisions producing extreme velocity
    if (dt > 8 && dt < 100) {
      const rawV = (velRef.current.lastX - t.clientX) / dt
      velRef.current.v = Math.max(-4, Math.min(4, rawV))  // clamp ±4 px/ms
    }
    velRef.current.lastX = t.clientX
    velRef.current.lastTime = now

    scrollRef.current.target = d.startScroll + (d.startX - t.clientX) * 1.1
  }

  const onTouchEnd = () => {
    const d = dragRef.current
    if (!d.isDown) return
    d.isDown = false
    if (!d.isHorizontal) return

    const s = scrollRef.current
    // Project momentum forward then clamp to ±2 cards — prevents erratic long jumps
    const projected = s.target + velRef.current.v * 160
    const baseCard = Math.round(s.target / CARD_STRIDE)
    const clamped = Math.max((baseCard - 2) * CARD_STRIDE, Math.min((baseCard + 2) * CARD_STRIDE, projected))
    s.target = Math.round(clamped / CARD_STRIDE) * CARD_STRIDE
    snapUntilRef.current = performance.now() + SNAP_PAUSE
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
