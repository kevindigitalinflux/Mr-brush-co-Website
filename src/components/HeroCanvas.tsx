import { useEffect, useRef } from 'react'

const DIRTY = '#2F4A3D'
const BRUSH_MOUSE = 88  // base radius for mouse wipe
const BRUSH_TOUCH = 52  // smaller radius on mobile — forces real scrubbing
const FEATHER = 0.52

const CW = 80  // cursor canvas width
const CH = 52  // cursor canvas height

// Deterministic pore positions for sponge cursor [relX, relY, radius]
const CURSOR_PORES: [number, number, number][] = [
  [0.10, 0.18, 3.0], [0.24, 0.52, 2.6], [0.16, 0.78, 2.2],
  [0.38, 0.28, 3.2], [0.52, 0.62, 2.5], [0.32, 0.72, 2.0],
  [0.68, 0.20, 2.8], [0.80, 0.55, 2.4], [0.62, 0.40, 2.6],
  [0.46, 0.14, 2.2], [0.86, 0.32, 2.0], [0.54, 0.80, 2.8],
  [0.74, 0.68, 2.2], [0.28, 0.36, 2.0], [0.88, 0.72, 2.4],
]

// Deterministic grime streak marks [x1, y1, x2, y2, alpha, lineWidth]
const STREAKS: [number, number, number, number, number, number][] = [
  [0.10, 0.25, 0.55, 0.27, 0.18,  9],
  [0.35, 0.60, 0.80, 0.62, 0.15, 13],
  [0.20, 0.80, 0.60, 0.78, 0.17,  8],
  [0.60, 0.15, 0.90, 0.18, 0.13, 10],
  [0.05, 0.45, 0.25, 0.47, 0.21, 11],
  [0.70, 0.85, 0.95, 0.83, 0.16,  9],
  [0.40, 0.35, 0.70, 0.38, 0.12,  7],
  [0.15, 0.65, 0.45, 0.63, 0.14, 12],
]

/** Draws the sponge graphic onto the cursor canvas once on mount */
function drawSponge(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  const r = 9
  const stripH = Math.round(CH * 0.24)

  ctx.clearRect(0, 0, CW, CH)

  ctx.shadowColor = 'rgba(0,0,0,0.50)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 5

  ctx.beginPath()
  ctx.roundRect(0, 0, CW, CH, r)
  const body = ctx.createLinearGradient(0, 0, 0, CH)
  body.addColorStop(0,    '#fce878')
  body.addColorStop(0.40, '#d4a020')
  body.addColorStop(1,    '#966e0e')
  ctx.fillStyle = body
  ctx.fill()

  ctx.shadowColor = 'transparent'

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(0, 0, CW, CH, r)
  ctx.clip()

  for (const [bx, by, brad] of CURSOR_PORES) {
    const px = CW * bx
    const py = (CH - stripH) * by
    const pg = ctx.createRadialGradient(px, py, 0, px, py, brad)
    pg.addColorStop(0,    'rgba(0,0,0,0.36)')
    pg.addColorStop(0.65, 'rgba(0,0,0,0.12)')
    pg.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.fillStyle = pg
    ctx.beginPath()
    ctx.arc(px, py, brad, 0, Math.PI * 2)
    ctx.fill()
  }

  const strip = ctx.createLinearGradient(0, CH - stripH, 0, CH)
  strip.addColorStop(0, '#3c9462')
  strip.addColorStop(1, '#1c4e30')
  ctx.fillStyle = strip
  ctx.fillRect(0, CH - stripH, CW, stripH)

  ctx.strokeStyle = 'rgba(0,0,0,0.20)'
  ctx.lineWidth = 0.8
  for (let sx = 3; sx < CW - 3; sx += 5) {
    ctx.beginPath()
    ctx.moveTo(sx, CH - stripH)
    ctx.lineTo(sx, CH)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(180,240,210,0.28)'
  ctx.fillRect(0, CH - stripH, CW, stripH * 0.45)

  ctx.restore()

  const spec = ctx.createLinearGradient(0, 0, 0, 18)
  spec.addColorStop(0, 'rgba(255,255,255,0.52)')
  spec.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = spec
  ctx.beginPath()
  ctx.roundRect(2, 1, CW - 4, 18, [r, r, 0, 0])
  ctx.fill()

  const shim = ctx.createRadialGradient(CW * 0.32, CH * 0.26, 0, CW * 0.32, CH * 0.26, CW * 0.52)
  shim.addColorStop(0,    'rgba(200,235,255,0.32)')
  shim.addColorStop(0.55, 'rgba(215,255,230,0.12)')
  shim.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.fillStyle = shim
  ctx.beginPath()
  ctx.roundRect(0, 0, CW, CH, r)
  ctx.fill()

  ctx.strokeStyle = 'rgba(0,0,0,0.28)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(0.5, 0.5, CW - 1, CH - 1, r)
  ctx.stroke()
}

/** Paints the initial dirty grime surface onto the canvas */
function drawDirt(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h)

  ctx.fillStyle = DIRTY
  ctx.fillRect(0, 0, w, h)

  const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.hypot(w, h) * 0.68)
  vig.addColorStop(0,   'rgba(0,0,0,0.06)')
  vig.addColorStop(0.6, 'rgba(0,0,0,0.22)')
  vig.addColorStop(1,   'rgba(0,0,0,0.58)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, w, h)

  const patches: [number, number, number, number, number, number, number, number, number][] = [
    [0.08, 0.15, 0.34, 0.22, 0.48,  0.3,  0,  0,  0],
    [0.82, 0.08, 0.28, 0.30, 0.44, -0.2,  0,  0,  0],
    [0.48, 0.70, 0.40, 0.26, 0.40,  0.1,  0,  0,  0],
    [0.18, 0.84, 0.24, 0.20, 0.50,  0.5,  0,  0,  0],
    [0.88, 0.72, 0.22, 0.28, 0.46, -0.3,  0,  0,  0],
    [0.55, 0.24, 0.20, 0.16, 0.38,  0.2,  0,  0,  0],
    [0.28, 0.50, 0.30, 0.22, 0.34, -0.1,  0,  0,  0],
    [0.70, 0.42, 0.26, 0.18, 0.40,  0.4,  0,  0,  0],
    [0.01, 0.01, 0.20, 0.16, 0.62,  0.0,  0,  0,  0],
    [0.99, 0.01, 0.20, 0.16, 0.60,  0.0,  0,  0,  0],
    [0.01, 0.99, 0.20, 0.16, 0.64,  0.0,  0,  0,  0],
    [0.99, 0.99, 0.20, 0.16, 0.62,  0.0,  0,  0,  0],
    [0.00, 0.50, 0.13, 0.55, 0.54,  0.0,  0,  0,  0],
    [1.00, 0.50, 0.13, 0.55, 0.54,  0.0,  0,  0,  0],
    [0.50, 0.00, 0.55, 0.10, 0.50,  0.0,  0,  0,  0],
    [0.50, 1.00, 0.55, 0.10, 0.54,  0.0,  0,  0,  0],
    [0.15, 0.35, 0.18, 0.12, 0.28,  0.2, 58, 28,  6],
    [0.75, 0.60, 0.22, 0.14, 0.32, -0.1, 45, 22,  5],
    [0.45, 0.45, 0.16, 0.10, 0.24,  0.6, 68, 34,  8],
    [0.62, 0.82, 0.14, 0.10, 0.20, -0.3, 52, 26,  4],
  ]

  for (const [px, py, rx, ry, alpha, rot, cr, cg, cb] of patches) {
    const cx = px * w
    const cy = py * h
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx * w, ry * h))
    grad.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`)
    grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx * w, ry * h, rot, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.lineCap = 'round'
  for (const [x1, y1, x2, y2, alpha, lineW] of STREAKS) {
    const grad = ctx.createLinearGradient(x1 * w, y1 * h, x2 * w, y2 * h)
    grad.addColorStop(0,    'rgba(0,0,0,0)')
    grad.addColorStop(0.15, `rgba(0,0,0,${alpha})`)
    grad.addColorStop(0.85, `rgba(0,0,0,${alpha * 0.6})`)
    grad.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.strokeStyle = grad
    ctx.lineWidth = lineW
    ctx.beginPath()
    ctx.moveTo(x1 * w, y1 * h)
    ctx.lineTo(x2 * w, y2 * h)
    ctx.stroke()
  }
}

/**
 * Erases the dirty layer — anisotropic brush shaped like a sponge face.
 * r is passed in so mouse and touch can use different base sizes.
 */
function wipe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  px: number,
  py: number,
  r: number,
  vx: number,
  vy: number,
) {
  const hardR = r * (1 - FEATHER)
  const speed = Math.hypot(vx, vy)

  ctx.globalCompositeOperation = 'destination-out'

  const dist = Math.hypot(x - px, y - py)
  const steps = Math.max(1, Math.ceil(dist / 2))
  const movAngle = speed > 1 ? Math.atan2(vy, vx) : 0

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const cx = px + (x - px) * t
    const cy = py + (y - py) * t

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(movAngle)
    ctx.scale(0.78, 1.18)

    const g = ctx.createRadialGradient(0, 0, hardR * 0.72, 0, 0, r)
    g.addColorStop(0,    'rgba(0,0,0,1)')
    g.addColorStop(0.52, 'rgba(0,0,0,0.96)')
    g.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.globalCompositeOperation = 'source-over'
}

/**
 * Paints a fresh wet/soapy mark onto the wet layer canvas.
 * Three overlapping gradients: main sheen + iridescent soap edge + specular dot.
 */
function paintWet(
  wetCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  px: number,
  py: number,
  r: number,
  movAngle: number,
) {
  const dist = Math.hypot(x - px, y - py)
  const steps = Math.max(1, Math.ceil(dist / 5))

  wetCtx.globalCompositeOperation = 'source-over'

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const cx = px + (x - px) * t
    const cy = py + (y - py) * t

    wetCtx.save()
    wetCtx.translate(cx, cy)
    wetCtx.rotate(movAngle)
    wetCtx.scale(0.78, 1.18)

    // Main sheen — blue-white water surface
    const r1 = r * 1.05
    const g1 = wetCtx.createRadialGradient(0, 0, 0, 0, 0, r1)
    g1.addColorStop(0,    'rgba(240,252,255,0.52)')
    g1.addColorStop(0.28, 'rgba(210,240,255,0.40)')
    g1.addColorStop(0.58, 'rgba(185,225,242,0.22)')
    g1.addColorStop(0.84, 'rgba(170,215,238,0.08)')
    g1.addColorStop(1,    'rgba(160,210,235,0)')
    wetCtx.fillStyle = g1
    wetCtx.beginPath()
    wetCtx.arc(0, 0, r1, 0, Math.PI * 2)
    wetCtx.fill()

    // Soap film edge — iridescent ring (thin film interference colours)
    const r2 = r * 0.78
    const g2 = wetCtx.createRadialGradient(0, 0, r2 * 0.62, 0, 0, r2)
    g2.addColorStop(0,    'rgba(200,240,220,0)')
    g2.addColorStop(0.38, 'rgba(200,240,210,0.14)')
    g2.addColorStop(0.65, 'rgba(220,195,245,0.11)')
    g2.addColorStop(0.88, 'rgba(195,218,255,0.08)')
    g2.addColorStop(1,    'rgba(200,220,255,0)')
    wetCtx.fillStyle = g2
    wetCtx.beginPath()
    wetCtx.arc(0, 0, r2, 0, Math.PI * 2)
    wetCtx.fill()

    // Specular dot — bright hot-spot of a wet surface
    const r3 = r * 0.26
    const g3 = wetCtx.createRadialGradient(-r * 0.08, -r * 0.09, 0, 0, 0, r3)
    g3.addColorStop(0,   'rgba(255,255,255,0.78)')
    g3.addColorStop(0.5, 'rgba(240,250,255,0.34)')
    g3.addColorStop(1,   'rgba(220,240,255,0)')
    wetCtx.fillStyle = g3
    wetCtx.beginPath()
    wetCtx.arc(0, 0, r3, 0, Math.PI * 2)
    wetCtx.fill()

    wetCtx.restore()
  }
}

/**
 * Called every rAF frame — multiplicatively decays all wet marks so they
 * fade out over ~3 seconds (0.986^180 ≈ 0.08 remaining).
 */
function fadeWetLayer(wetCtx: CanvasRenderingContext2D, w: number, h: number) {
  wetCtx.globalAlpha = 0.014
  wetCtx.globalCompositeOperation = 'destination-out'
  wetCtx.fillStyle = 'rgba(0,0,0,1)'
  wetCtx.fillRect(0, 0, w, h)
  wetCtx.globalCompositeOperation = 'source-over'
  wetCtx.globalAlpha = 1
}

/**
 * Hero canvas reveal — dirty grime surface wiped away to reveal a clean scene,
 * with a wet/soapy sheen on freshly cleaned areas that dries over ~3 seconds.
 *
 * Desktop: sponge cursor + mouse wipe (88px base brush).
 * Mobile:  finger wipe (110px base brush, no cursor).
 */
export function HeroCanvas() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const wetCanvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef    = useRef<HTMLCanvasElement>(null)
  const posRef       = useRef({ x: 0, y: 0, started: false })

  useEffect(() => {
    const canvas    = canvasRef.current
    const wetCanvas = wetCanvasRef.current
    const cursor    = cursorRef.current
    const section   = document.getElementById('hero')
    if (!canvas || !wetCanvas || !cursor || !section) return

    const isFinePointer = window.matchMedia('(pointer: fine)').matches

    drawSponge(cursor)

    const ctx    = canvas.getContext('2d')!
    const wetCtx = wetCanvas.getContext('2d')!

    if (isFinePointer) section.style.cursor = 'none'

    const resize = () => {
      const w = section.offsetWidth
      const h = section.offsetHeight
      canvas.width     = w
      canvas.height    = h
      wetCanvas.width  = w
      wetCanvas.height = h
      posRef.current.started = false
      drawDirt(ctx, w, h)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(section)

    let rafId = 0
    const fadeLoop = () => {
      fadeWetLayer(wetCtx, wetCanvas.width, wetCanvas.height)
      rafId = requestAnimationFrame(fadeLoop)
    }
    rafId = requestAnimationFrame(fadeLoop)

    const p = posRef.current

    // ── Mouse (desktop) ───────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (!p.started) { p.x = x; p.y = y; p.started = true }

      const vx = x - p.x
      const vy = y - p.y
      const speed = Math.hypot(vx, vy)
      const movAngle = speed > 1 ? Math.atan2(vy, vx) : 0
      const r = BRUSH_MOUSE + Math.min(speed * 0.30, 24)

      wipe(ctx, x, y, p.x, p.y, r, vx, vy)
      paintWet(wetCtx, x, y, p.x, p.y, r, movAngle)

      p.x = x
      p.y = y

      const angle = Math.atan2(vy, vx) * (180 / Math.PI)
      cursor.style.left      = `${e.clientX}px`
      cursor.style.top       = `${e.clientY}px`
      cursor.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`
      cursor.style.opacity   = '1'
    }

    const onMouseEnter = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      p.x = e.clientX - rect.left
      p.y = e.clientY - rect.top
      p.started = true
      cursor.style.left    = `${e.clientX}px`
      cursor.style.top     = `${e.clientY}px`
      cursor.style.opacity = '1'
    }

    const onMouseLeave = () => {
      cursor.style.opacity = '0'
      p.started = false
    }

    // ── Touch (mobile) ────────────────────────────────────────────────
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      p.x = touch.clientX - rect.left
      p.y = touch.clientY - rect.top
      p.started = true
    }

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      if (!p.started) { p.x = x; p.y = y; p.started = true }

      const vx = x - p.x
      const vy = y - p.y
      const speed = Math.hypot(vx, vy)
      const movAngle = speed > 1 ? Math.atan2(vy, vx) : 0
      const r = BRUSH_TOUCH + Math.min(speed * 0.30, 24)

      wipe(ctx, x, y, p.x, p.y, r, vx, vy)
      paintWet(wetCtx, x, y, p.x, p.y, r, movAngle)

      p.x = x
      p.y = y
    }

    const onTouchEnd = () => { p.started = false }

    // Register listeners
    if (isFinePointer) {
      section.addEventListener('mousemove',  onMouseMove)
      section.addEventListener('mouseenter', onMouseEnter)
      section.addEventListener('mouseleave', onMouseLeave)
    }

    section.addEventListener('touchstart', onTouchStart, { passive: true })
    section.addEventListener('touchmove',  onTouchMove,  { passive: true })
    section.addEventListener('touchend',   onTouchEnd)

    return () => {
      cancelAnimationFrame(rafId)
      section.removeEventListener('mousemove',  onMouseMove)
      section.removeEventListener('mouseenter', onMouseEnter)
      section.removeEventListener('mouseleave', onMouseLeave)
      section.removeEventListener('touchstart', onTouchStart)
      section.removeEventListener('touchmove',  onTouchMove)
      section.removeEventListener('touchend',   onTouchEnd)
      section.style.cursor = ''
      ro.disconnect()
    }
  }, [])

  return (
    <>
      {/* Clean office image — revealed through wiped areas */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/hero-office.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          zIndex: 1,
        }}
      />

      {/* Wet sheen layer — screen-blends with the photo to add reflective wetness */}
      <canvas
        ref={wetCanvasRef}
        className="absolute inset-0 block pointer-events-none"
        style={{ zIndex: 2, mixBlendMode: 'screen' }}
      />

      {/* Dirty grime canvas — erased by sponge/finger as the user wipes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block"
        style={{ zIndex: 3 }}
      />

      {/* Sponge cursor — desktop only, fixed canvas that tracks the mouse */}
      <canvas
        ref={cursorRef}
        width={CW}
        height={CH}
        className="pointer-events-none"
        style={{
          position: 'fixed',
          zIndex: 99999,
          opacity: 0,
          transition: 'opacity 0.18s ease',
        }}
      />
    </>
  )
}
