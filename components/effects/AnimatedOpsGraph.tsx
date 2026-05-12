'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Node {
  x: number
  y: number
  label: string
  radius: number
  phase: number
  speed: number
  isCore: boolean
}

interface Pulse {
  t: number
  speed: number
  opacity: number
}

interface Edge {
  from: number
  to: number
  pulses: Pulse[]
  lastPulse: number
  interval: number
}

const NODE_DEFS: [number, number, string, boolean][] = [
  [0.50, 0.10, 'AI Stack',    false],
  [0.88, 0.28, 'Health',      false],
  [0.92, 0.62, 'Training',    false],
  [0.68, 0.90, 'Real Estate', false],
  [0.32, 0.90, 'Advisory',    false],
  [0.08, 0.62, 'Water',       false],
  [0.12, 0.28, 'Operations',  false],
  [0.50, 0.50, 'Core',        true ],
]

const EDGE_PAIRS: [number, number][] = [
  [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],
  [0,3],[1,4],[2,5],
]

export default function AnimatedOpsGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
    }
    resize()

    const getWH = () => ({
      W: canvas.offsetWidth,
      H: canvas.offsetHeight,
    })

    let nodes: Node[] = []
    let edges: Edge[] = []

    const buildGraph = () => {
      const { W, H } = getWH()
      nodes = NODE_DEFS.map(([px, py, label, isCore]) => ({
        x: px * W,
        y: py * H,
        label,
        isCore,
        radius: isCore ? 7 : 4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.4,
      }))
      edges = EDGE_PAIRS.map(([from, to]) => ({
        from,
        to,
        pulses: [],
        lastPulse: -(Math.random() * 3000),
        interval: 2500 + Math.random() * 2500,
      }))
    }
    buildGraph()

    let raf: number
    let prevTime = 0

    const draw = (time: number) => {
      const dt = Math.min(time - prevTime, 50)
      prevTime = time
      const { W, H } = getWH()
      ctx.clearRect(0, 0, W, H)

      // Edges + pulses
      for (const edge of edges) {
        const a = nodes[edge.from]
        const b = nodes[edge.to]

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = 'rgba(201,168,76,0.10)'
        ctx.lineWidth = 1
        ctx.stroke()

        if (!shouldReduce && time - edge.lastPulse > edge.interval) {
          edge.pulses.push({
            t: 0,
            speed: 0.00045 + Math.random() * 0.00025,
            opacity: 1,
          })
          edge.lastPulse = time
          edge.interval = 2500 + Math.random() * 2500
        }

        for (const p of edge.pulses) {
          const px = a.x + (b.x - a.x) * p.t
          const py = a.y + (b.y - a.y) * p.t
          const fade = Math.min(p.t, 1 - p.t) * 8
          ctx.beginPath()
          ctx.arc(px, py, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(201,168,76,${Math.min(1, fade) * 0.85})`
          ctx.fill()
          p.t += p.speed * dt
        }
        edge.pulses = edge.pulses.filter((p) => p.t < 1)
      }

      // Nodes
      const t = time / 1000
      for (const node of nodes) {
        const breathe = shouldReduce ? 0 : Math.sin(t * node.speed + node.phase) * 1.2
        const r = node.radius + breathe

        // Outer glow
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 5)
        grad.addColorStop(0, node.isCore ? 'rgba(201,168,76,0.35)' : 'rgba(201,168,76,0.22)')
        grad.addColorStop(1, 'rgba(201,168,76,0)')
        ctx.beginPath()
        ctx.arc(node.x, node.y, r * 5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Node body
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = node.isCore ? 'rgba(201,168,76,0.95)' : 'rgba(201,168,76,0.65)'
        ctx.fill()

        // Label
        ctx.font = `${node.isCore ? 9 : 8}px system-ui`
        ctx.fillStyle = node.isCore ? 'rgba(201,168,76,0.55)' : 'rgba(201,168,76,0.35)'
        ctx.textAlign = 'center'
        ctx.fillText(node.label.toUpperCase(), node.x, node.y + r + 11)
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    const handleResize = () => {
      resize()
      buildGraph()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
    }
  }, [shouldReduce])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-hidden="true"
    />
  )
}
