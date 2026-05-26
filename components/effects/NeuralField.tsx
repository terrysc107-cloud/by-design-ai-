'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Node { x: number; y: number; vx: number; vy: number }

const COUNT = 55
const MAX_DIST = 140
const GOLD = 'rgba(201,168,76,'

export default function NeuralField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const mouse = { x: -999, y: -999 }

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = W() * dpr
      canvas.height = H() * dpr
      ctx.scale(dpr, dpr)
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => { mouse.x = -999; mouse.y = -999 }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    resize()

    const nodes: Node[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W(), H())

      for (const n of nodes) {
        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 180 && d > 0) { n.vx += (dx / d) * 0.015; n.vy += (dy / d) * 0.015 }

        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (spd > 1.0) { n.vx = (n.vx / spd); n.vy = (n.vy / spd) }

        n.x += n.vx; n.y += n.vy
        if (n.x < 0) { n.x = 0; n.vx *= -1 }
        if (n.x > W()) { n.x = W(); n.vx *= -1 }
        if (n.y < 0) { n.y = 0; n.vy *= -1 }
        if (n.y > H()) { n.y = H(); n.vy *= -1 }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.35
            ctx.beginPath()
            ctx.strokeStyle = `${GOLD}${a})`
            ctx.lineWidth = 0.7
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = `${GOLD}0.65)`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [shouldReduce])

  if (shouldReduce) return null

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
