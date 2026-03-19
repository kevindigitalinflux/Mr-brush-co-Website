import { useEffect, useRef } from 'react'

interface Props {
  onComplete: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  type: 'star4' | 'star6' | 'circle'
  color: string
  rotation: number
  rotationSpeed: number
  decay: number
  alpha: number
}

export default function SpongeAnimation({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Offscreen dirt canvas
    const dirtCanvas = document.createElement('canvas')
    const dirtCtx = dirtCanvas.getContext('2d')!

    const SPONGE_W = 310
    const SPONGE_H = 105
    const ROW_H = 82
    const SPEED = 2190 // px/s (1.25× original)
    const WOBBLE_FREQ = 14
    const WOBBLE_AMP = 4.5
    const BRASS = '#B8A77A'
    const IVORY = '#F5F4EF'

    let W = 0, H = 0
    let numRows = 0
    let rafId = 0
    let lastTime = 0
    let canvasAlpha = 1
    let fading = false
    let done = false

    const particles: Particle[] = []
    let particleTimer = 0

    const sponge = { x: 0, y: 0, row: 0, dir: 1 as 1 | -1 }

    function buildDirt() {
      dirtCanvas.width = W
      dirtCanvas.height = H
      // Base dark fill
      dirtCtx.fillStyle = '#0b1810'
      dirtCtx.fillRect(0, 0, W, H)
      // Grime splotches
      for (let i = 0; i < 320; i++) {
        const gx = Math.random() * W
        const gy = Math.random() * H
        const r = 20 + Math.random() * 120
        const g = dirtCtx.createRadialGradient(gx, gy, 0, gx, gy, r)
        const a = 0.06 + Math.random() * 0.18
        g.addColorStop(0, `rgba(0,0,0,${a})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        dirtCtx.fillStyle = g
        dirtCtx.fillRect(gx - r, gy - r, r * 2, r * 2)
      }
      // Warm tint streaks
      for (let i = 0; i < 6; i++) {
        const sy = Math.random() * H
        const g = dirtCtx.createLinearGradient(0, sy, W, sy + 40)
        g.addColorStop(0, 'rgba(80,50,10,0)')
        g.addColorStop(0.5, 'rgba(80,50,10,0.07)')
        g.addColorStop(1, 'rgba(80,50,10,0)')
        dirtCtx.fillStyle = g
        dirtCtx.fillRect(0, sy, W, 40)
      }
    }

    function resetSponge() {
      sponge.row = 0
      sponge.dir = 1
      sponge.x = -SPONGE_W
      sponge.y = ROW_H / 2 - SPONGE_H / 2
      particles.length = 0
      particleTimer = 0
      fading = false
      done = false
      canvasAlpha = 1
    }

    function init() {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
      numRows = Math.ceil(H / ROW_H) + 1
      buildDirt()
      resetSponge()
    }

    function eraseDirt(cx: number, cy: number) {
      dirtCtx.save()
      dirtCtx.globalCompositeOperation = 'destination-out'
      const rx = SPONGE_W * 0.55
      const ry = SPONGE_H * 0.6
      const g = dirtCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry))
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(0.6, 'rgba(0,0,0,0.85)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      dirtCtx.fillStyle = g
      dirtCtx.beginPath()
      dirtCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      dirtCtx.fill()
      dirtCtx.restore()
    }

    function spawnParticles(x: number, y: number) {
      if (particles.length >= 180) return
      const colors = [BRASS, BRASS, IVORY, '#d4c29c']
      const types: Particle['type'][] = ['star4', 'star6', 'circle']
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.4 + Math.random() * 1.6
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: 3 + Math.random() * 6,
          type: types[Math.floor(Math.random() * types.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          decay: 0.016 + Math.random() * 0.012,
          alpha: 1,
        })
      }
    }

    function drawStar(pCtx: CanvasRenderingContext2D, points: number, cx: number, cy: number, r: number) {
      const step = Math.PI / points
      pCtx.beginPath()
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? r : r * 0.4
        const a = i * step - Math.PI / 2
        i === 0 ? pCtx.moveTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius)
                : pCtx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius)
      }
      pCtx.closePath()
    }

    function drawParticles() {
      for (const p of particles) {
        if (p.alpha <= 0) continue
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        if (p.type === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          drawStar(ctx, p.type === 'star4' ? 4 : 6, 0, 0, p.size / 2)
          ctx.fill()
          // specular
          ctx.globalAlpha = p.alpha * 0.4
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          ctx.arc(-p.size * 0.1, -p.size * 0.15, p.size * 0.15, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
    }

    function drawSponge(x: number, y: number, dir: 1 | -1) {
      const r = 14
      ctx.save()

      // Drop shadow
      ctx.shadowColor = 'rgba(0,0,0,0.55)'
      ctx.shadowBlur = 28
      ctx.shadowOffsetY = 12

      // Body gradient
      const bodyGrad = ctx.createLinearGradient(x, y, x, y + SPONGE_H)
      bodyGrad.addColorStop(0, '#72c490')
      bodyGrad.addColorStop(1, '#283d32')

      ctx.fillStyle = bodyGrad
      ctx.beginPath()
      ctx.roundRect(x, y, SPONGE_W, SPONGE_H, r)
      ctx.fill()

      ctx.shadowColor = 'transparent'

      // Scrub lines
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'
      ctx.lineWidth = 1.5
      for (let i = 1; i <= 6; i++) {
        const ly = y + (SPONGE_H / 7) * i
        ctx.beginPath()
        ctx.moveTo(x + r, ly)
        ctx.lineTo(x + SPONGE_W - r, ly)
        ctx.stroke()
      }

      // Soap bubbles
      const bubblePositions = [
        [0.15, 0.25], [0.35, 0.6], [0.55, 0.3], [0.72, 0.65], [0.88, 0.2],
        [0.25, 0.75], [0.62, 0.8], [0.45, 0.45], [0.82, 0.5],
      ]
      for (const [bx, by] of bubblePositions) {
        const cx2 = x + SPONGE_W * bx
        const cy2 = y + SPONGE_H * by
        const br = 4 + Math.random() * 3
        ctx.beginPath()
        ctx.arc(cx2, cy2, br, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.18)'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(cx2 - br * 0.3, cy2 - br * 0.3, br * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.fill()
      }

      // Top specular
      const specGrad = ctx.createLinearGradient(x, y, x, y + 18)
      specGrad.addColorStop(0, 'rgba(255,255,255,0.28)')
      specGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = specGrad
      ctx.beginPath()
      ctx.roundRect(x + 2, y + 2, SPONGE_W - 4, 18, [r, r, 0, 0])
      ctx.fill()

      // Brass leading-edge trim
      const trimX = dir === 1 ? x + SPONGE_W - 11 : x
      const trimGrad = ctx.createLinearGradient(trimX, y, trimX + 11, y)
      trimGrad.addColorStop(0, '#9a8855')
      trimGrad.addColorStop(0.5, '#d4c29c')
      trimGrad.addColorStop(1, '#9a8855')
      ctx.fillStyle = trimGrad
      const trimR = dir === 1 ? [0, r, r, 0] : [r, 0, 0, r]
      ctx.beginPath()
      ctx.roundRect(trimX, y, 11, SPONGE_H, trimR)
      ctx.fill()

      // Bottom edge shadow
      const bottomGrad = ctx.createLinearGradient(x, y + SPONGE_H - 8, x, y + SPONGE_H)
      bottomGrad.addColorStop(0, 'rgba(0,0,0,0)')
      bottomGrad.addColorStop(1, 'rgba(0,0,0,0.3)')
      ctx.fillStyle = bottomGrad
      ctx.beginPath()
      ctx.roundRect(x, y + SPONGE_H - 8, SPONGE_W, 8, [0, 0, r, r])
      ctx.fill()

      ctx.restore()
    }

    function frame(ts: number) {
      if (done) return
      const dt = Math.min((ts - lastTime) / 1000, 0.05)
      lastTime = ts

      ctx.clearRect(0, 0, W, H)

      if (fading) {
        canvasAlpha -= 0.018
        if (canvasAlpha <= 0) {
          canvas.style.opacity = '0'
          done = true
          onCompleteRef.current()
          return
        }
        canvas.style.opacity = String(canvasAlpha)
        ctx.drawImage(dirtCanvas, 0, 0)
        rafId = requestAnimationFrame(frame)
        return
      }

      // Move sponge
      const rowY = sponge.row * ROW_H + ROW_H / 2 - SPONGE_H / 2
      const wobble = Math.sin(sponge.x * WOBBLE_FREQ * 0.01) * WOBBLE_AMP
      sponge.y = rowY + wobble
      sponge.x += sponge.dir * SPEED * dt

      // Erase dirt at sponge centre
      eraseDirt(sponge.x + SPONGE_W / 2, sponge.y + SPONGE_H / 2)

      // Spawn sparkles at trailing edge
      particleTimer += dt
      if (particleTimer >= 0.011) {
        particleTimer = 0
        const trailX = sponge.dir === 1 ? sponge.x : sponge.x + SPONGE_W
        spawnParticles(trailX, sponge.y + SPONGE_H / 2)
      }

      // Update particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.065
        p.rotation += p.rotationSpeed
        p.alpha -= p.decay
      }

      // Check row complete
      const rowDone = sponge.dir === 1 ? sponge.x > W + 10 : sponge.x < -SPONGE_W - 10
      if (rowDone) {
        sponge.row++
        if (sponge.row >= numRows) {
          fading = true
        } else {
          sponge.dir = sponge.row % 2 === 0 ? 1 : -1
          sponge.x = sponge.dir === 1 ? -SPONGE_W : W + 10
        }
      }

      // Draw dirt overlay
      ctx.drawImage(dirtCanvas, 0, 0)

      // Draw particles (behind sponge)
      drawParticles()

      // Draw sponge
      drawSponge(sponge.x, sponge.y, sponge.dir)

      rafId = requestAnimationFrame(frame)
    }

    function handleResize() {
      cancelAnimationFrame(rafId)
      init()
      lastTime = performance.now()
      rafId = requestAnimationFrame(frame)
    }

    init()
    lastTime = performance.now()
    rafId = requestAnimationFrame(frame)
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'block' }}
    />
  )
}
