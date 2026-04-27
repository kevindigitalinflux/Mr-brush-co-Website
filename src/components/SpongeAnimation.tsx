import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  onComplete: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  isBubble: boolean
  color: string
  rotation: number
  rotationSpeed: number
  decay: number
  alpha: number
}

// Deterministic pore positions [relX, relY, radius, angleRad] — no per-frame Math.random flicker
const PORES: [number, number, number, number][] = [
  [0.06, 0.15, 4.2, 0.0], [0.14, 0.55, 3.4, 0.5], [0.09, 0.80, 5.0, 0.2],
  [0.20, 0.30, 3.8, 0.8], [0.28, 0.68, 4.5, 0.3], [0.18, 0.90, 3.2, 1.0],
  [0.38, 0.20, 5.2, 0.1], [0.44, 0.52, 3.6, 0.6], [0.40, 0.82, 4.0, 0.4],
  [0.55, 0.35, 3.2, 0.9], [0.62, 0.72, 5.0, 0.2], [0.50, 0.90, 3.8, 0.7],
  [0.70, 0.22, 4.2, 0.5], [0.78, 0.58, 3.0, 0.1], [0.74, 0.85, 4.8, 0.8],
  [0.88, 0.40, 3.6, 0.3], [0.85, 0.75, 4.0, 0.6], [0.95, 0.18, 3.4, 0.4],
  [0.32, 0.42, 2.8, 0.9], [0.65, 0.48, 2.6, 0.2], [0.52, 0.62, 3.2, 0.5],
  [0.12, 0.45, 2.8, 0.7], [0.82, 0.28, 3.0, 0.3], [0.22, 0.85, 3.6, 0.1],
  [0.48, 0.12, 3.8, 0.6], [0.72, 0.12, 3.2, 0.4], [0.58, 0.38, 2.5, 0.8],
  [0.92, 0.62, 3.4, 0.2], [0.36, 0.75, 2.8, 0.9], [0.68, 0.90, 3.0, 0.5],
]

/** Canvas-based sponge wipe intro animation — calls onComplete when finished */
export function SpongeAnimation({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const dirtCanvas = document.createElement('canvas')
    const dirtCtx = dirtCanvas.getContext('2d')!

    const SPONGE_W = 310
    const SPONGE_H = 100
    const ROW_H = 115         // taller rows → fewer passes
    const SPEED = 3800        // px/s — significantly faster
    const WOBBLE_FREQ = 11
    const WOBBLE_AMP = 5
    // 3D cabinet-oblique depth vector
    const DEPTH_X = 26
    const DEPTH_Y = -13

    let W = 0, H = 0
    let numRows = 0
    let done = false

    const particles: Particle[] = []
    let particleTimer = 0

    const sponge = { x: 0, y: 0, row: 0, dir: 1 as 1 | -1 }

    function buildDirt() {
      dirtCanvas.width = W
      dirtCanvas.height = H
      dirtCtx.fillStyle = '#0b1810'
      dirtCtx.fillRect(0, 0, W, H)
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
      done = false
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
      const ry = SPONGE_H * 0.62
      const g = dirtCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry))
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(0.6, 'rgba(0,0,0,0.88)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      dirtCtx.fillStyle = g
      dirtCtx.beginPath()
      dirtCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      dirtCtx.fill()
      dirtCtx.restore()
    }

    function spawnParticles(x: number, y: number) {
      if (particles.length >= 220) return
      const soapColors = [
        'rgba(180,220,255,0.9)', 'rgba(220,240,255,0.85)',
        'rgba(200,235,210,0.85)', 'rgba(255,235,180,0.85)',
      ]
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.5 + Math.random() * 2.2
        particles.push({
          x: x + (Math.random() - 0.5) * 22,
          y: y + (Math.random() - 0.5) * 16,
          vx: Math.cos(angle) * speed * 0.75,
          vy: Math.sin(angle) * speed - 1.6,
          size: 4 + Math.random() * 9,
          isBubble: Math.random() > 0.35,
          color: soapColors[Math.floor(Math.random() * soapColors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.14,
          decay: 0.013 + Math.random() * 0.013,
          alpha: 0.75 + Math.random() * 0.25,
        })
      }
    }

    function drawParticles() {
      for (const p of particles) {
        if (p.alpha <= 0) continue
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        const r = p.size / 2
        if (p.isBubble) {
          // Iridescent soap bubble
          const bg = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r)
          bg.addColorStop(0, 'rgba(240,248,255,0.45)')
          bg.addColorStop(0.75, 'rgba(160,210,255,0.1)')
          bg.addColorStop(1, 'rgba(180,220,255,0.38)')
          ctx.beginPath()
          ctx.arc(0, 0, r, 0, Math.PI * 2)
          ctx.fillStyle = bg
          ctx.fill()
          ctx.strokeStyle = 'rgba(200,230,255,0.55)'
          ctx.lineWidth = 0.8
          ctx.stroke()
          // Specular dot
          ctx.beginPath()
          ctx.arc(-r * 0.32, -r * 0.38, r * 0.26, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.85)'
          ctx.fill()
        } else {
          // 4-point sparkle
          ctx.beginPath()
          for (let j = 0; j < 8; j++) {
            const rad = j % 2 === 0 ? r : r * 0.35
            const a = j * (Math.PI / 4) - Math.PI / 2
            j === 0
              ? ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad)
              : ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad)
          }
          ctx.closePath()
          ctx.fillStyle = p.color
          ctx.fill()
          ctx.beginPath()
          ctx.arc(-r * 0.2, -r * 0.25, r * 0.22, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.85)'
          ctx.fill()
        }
        ctx.restore()
      }
    }

    function drawSponge(x: number, y: number, dir: 1 | -1) {
      const W = SPONGE_W
      const H = SPONGE_H
      const DX = DEPTH_X
      const DY = DEPTH_Y
      const r = 11

      ctx.save()

      // --- TOP FACE (lightest — receives direct light) ---
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + W, y)
      ctx.lineTo(x + W + DX, y + DY)
      ctx.lineTo(x + DX, y + DY)
      ctx.closePath()
      const topGrad = ctx.createLinearGradient(x, y + DY, x, y)
      topGrad.addColorStop(0, '#fce878')
      topGrad.addColorStop(1, '#ddb025')
      ctx.fillStyle = topGrad
      ctx.fill()
      // Top face sheen strip
      ctx.beginPath()
      ctx.moveTo(x + W * 0.06, y)
      ctx.lineTo(x + W * 0.88, y)
      ctx.lineTo(x + W * 0.88 + DX * 0.55, y + DY * 0.55)
      ctx.lineTo(x + W * 0.06 + DX * 0.55, y + DY * 0.55)
      ctx.closePath()
      ctx.fillStyle = 'rgba(255,255,255,0.13)'
      ctx.fill()
      // Pore marks on top face
      ctx.save()
      ctx.globalAlpha = 0.22
      for (let i = 0; i < 8; i++) {
        const [bx,, brad, ang] = PORES[i * 3]
        const px = x + DX * 0.5 + W * bx
        const py = y + DY * 0.5
        ctx.beginPath()
        ctx.ellipse(px, py, brad * 0.7, brad * 0.4, ang, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,0,0,1)'
        ctx.fill()
      }
      ctx.restore()

      // --- LEADING SIDE FACE (green scrubby pad) ---
      if (dir === 1) {
        ctx.beginPath()
        ctx.moveTo(x + W, y)
        ctx.lineTo(x + W + DX, y + DY)
        ctx.lineTo(x + W + DX, y + H + DY)
        ctx.lineTo(x + W, y + H)
        ctx.closePath()
        const rg = ctx.createLinearGradient(x + W, 0, x + W + DX, 0)
        rg.addColorStop(0, '#38945f')
        rg.addColorStop(1, '#1c5236')
        ctx.fillStyle = rg
        ctx.fill()
        ctx.strokeStyle = 'rgba(0,0,0,0.18)'
        ctx.lineWidth = 1
        for (let i = 1; i <= 5; i++) {
          const t = i / 6
          ctx.beginPath()
          ctx.moveTo(x + W, y + H * t)
          ctx.lineTo(x + W + DX, y + DY + H * t)
          ctx.stroke()
        }
      } else {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + DX, y + DY)
        ctx.lineTo(x + DX, y + H + DY)
        ctx.lineTo(x, y + H)
        ctx.closePath()
        const lg = ctx.createLinearGradient(x + DX, 0, x, 0)
        lg.addColorStop(0, '#38945f')
        lg.addColorStop(1, '#1c5236')
        ctx.fillStyle = lg
        ctx.fill()
        ctx.strokeStyle = 'rgba(0,0,0,0.18)'
        ctx.lineWidth = 1
        for (let i = 1; i <= 5; i++) {
          const t = i / 6
          ctx.beginPath()
          ctx.moveTo(x, y + H * t)
          ctx.lineTo(x + DX, y + DY + H * t)
          ctx.stroke()
        }
      }

      // Drop shadow (rendered before front face so it sits underneath)
      ctx.shadowColor = 'rgba(0,0,0,0.52)'
      ctx.shadowBlur = 34
      ctx.shadowOffsetX = dir * 5
      ctx.shadowOffsetY = 18

      // --- FRONT FACE (yellow sponge foam) ---
      ctx.beginPath()
      ctx.roundRect(x, y, W, H, r)
      const frontGrad = ctx.createLinearGradient(x, y, x, y + H)
      frontGrad.addColorStop(0, '#f8cc44')
      frontGrad.addColorStop(0.42, '#d4a020')
      frontGrad.addColorStop(1, '#966e0e')
      ctx.fillStyle = frontGrad
      ctx.fill()

      ctx.shadowColor = 'transparent'

      // Pore texture + scrubby bottom strip (clipped to front face)
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(x, y, W, H, r)
      ctx.clip()

      for (const [bx, by, brad, ang] of PORES) {
        const px = x + W * bx
        const py = y + H * by
        const pg = ctx.createRadialGradient(px, py, 0, px, py, brad)
        pg.addColorStop(0, 'rgba(0,0,0,0.38)')
        pg.addColorStop(0.65, 'rgba(0,0,0,0.14)')
        pg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = pg
        ctx.beginPath()
        ctx.ellipse(px, py, brad, brad * 0.72, ang, 0, Math.PI * 2)
        ctx.fill()
      }

      // Green scrubby strip along the bottom
      const stripH = 22
      const stripGrad = ctx.createLinearGradient(x, y + H - stripH, x, y + H)
      stripGrad.addColorStop(0, '#3c9462')
      stripGrad.addColorStop(1, '#1c4e30')
      ctx.fillStyle = stripGrad
      ctx.fillRect(x, y + H - stripH, W, stripH)
      // Scrubby vertical fibres
      ctx.strokeStyle = 'rgba(0,0,0,0.14)'
      ctx.lineWidth = 1
      for (let sx = x + 4; sx < x + W - 4; sx += 7) {
        ctx.beginPath()
        ctx.moveTo(sx, y + H - stripH)
        ctx.lineTo(sx, y + H)
        ctx.stroke()
      }
      // Scrubby highlight
      ctx.fillStyle = 'rgba(255,255,255,0.07)'
      ctx.fillRect(x, y + H - stripH, W, stripH * 0.4)

      ctx.restore()

      // Top-edge specular on front face
      const specGrad = ctx.createLinearGradient(x, y, x, y + 24)
      specGrad.addColorStop(0, 'rgba(255,255,255,0.32)')
      specGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = specGrad
      ctx.beginPath()
      ctx.roundRect(x + 3, y + 2, W - 6, 24, [r, r, 0, 0])
      ctx.fill()

      // Trailing-edge ambient occlusion (soft darkening on opposite side from leading)
      const aoX = dir === 1 ? x : x + W - 12
      const aoDir = dir === 1 ? 1 : -1
      const aoGrad = ctx.createLinearGradient(aoX, 0, aoX + aoDir * 12, 0)
      aoGrad.addColorStop(0, 'rgba(0,0,0,0.16)')
      aoGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = aoGrad
      ctx.beginPath()
      ctx.roundRect(x, y, W, H, r)
      ctx.fill()

      ctx.restore()
    }

    function tick(_time: number, deltaTime: number) {
      if (done) return
      const dt = Math.min(deltaTime / 1000, 0.05)

      ctx.clearRect(0, 0, W, H)

      // Move sponge
      sponge.y = sponge.row * ROW_H + ROW_H / 2 - SPONGE_H / 2
               + Math.sin(sponge.x * WOBBLE_FREQ * 0.01) * WOBBLE_AMP
      sponge.x += sponge.dir * SPEED * dt

      eraseDirt(sponge.x + SPONGE_W / 2, sponge.y + SPONGE_H / 2)

      particleTimer += dt
      if (particleTimer >= 0.009) {
        particleTimer = 0
        const trailX = sponge.dir === 1 ? sponge.x : sponge.x + SPONGE_W
        spawnParticles(trailX, sponge.y + SPONGE_H / 2)
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.062
        p.rotation += p.rotationSpeed
        p.alpha -= p.decay
      }

      const rowDone = sponge.dir === 1
        ? sponge.x > W + 10
        : sponge.x < -SPONGE_W - 10

      // Render
      ctx.drawImage(dirtCanvas, 0, 0)
      drawParticles()
      if (!rowDone) drawSponge(sponge.x, sponge.y, sponge.dir)

      if (rowDone) {
        sponge.row++
        if (sponge.row >= numRows) {
          done = true
          gsap.to(canvas, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => onCompleteRef.current(),
          })
        } else {
          sponge.dir = sponge.row % 2 === 0 ? 1 : -1
          sponge.x = sponge.dir === 1 ? -SPONGE_W : W + 10
        }
      }
    }

    function handleResize() {
      gsap.ticker.remove(tick)
      gsap.killTweensOf(canvas)
      init()
      gsap.ticker.add(tick)
    }

    init()
    gsap.ticker.add(tick)
    window.addEventListener('resize', handleResize)

    return () => {
      gsap.ticker.remove(tick)
      gsap.killTweensOf(canvas)
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
