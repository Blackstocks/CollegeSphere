"use client"

import { useEffect, useRef } from "react"

interface Point {
  x: number
  y: number
  vx: number
  vy: number
}

interface Connection {
  from: Point
  to: Point
  age: number
  originalDistance: number
}

export function NetworkCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const points = useRef<Point[]>([])
  const connections = useRef<Connection[]>([])
  const animationFrameId = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Initialize points
    const initPoints = () => {
      points.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }))
    }
    initPoints()

    // Update mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update points
      points.current.forEach((point) => {
        point.x += point.vx
        point.y += point.vy

        // Bounce off walls
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1

        // Draw point
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(100, 100, 100, 0.5)"
        ctx.fill()
      })

      // Update connections
      connections.current = connections.current.filter((conn) => conn.age > 0)
      connections.current.forEach((conn) => {
        conn.age--
        const distance = Math.hypot(conn.from.x - conn.to.x, conn.from.y - conn.to.y)
        const opacity = Math.min(1, (conn.age / 50) * (1 - distance / conn.originalDistance))

        ctx.beginPath()
        ctx.moveTo(conn.from.x, conn.from.y)
        ctx.lineTo(conn.to.x, conn.to.y)
        ctx.strokeStyle = `rgba(100, 100, 100, ${opacity})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Create new connections near mouse
      points.current.forEach((point) => {
        const distToMouse = Math.hypot(point.x - mousePosition.current.x, point.y - mousePosition.current.y)
        if (distToMouse < 100) {
          points.current.forEach((otherPoint) => {
            if (point === otherPoint) return
            const dist = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y)
            if (dist < 100) {
              connections.current.push({
                from: point,
                to: otherPoint,
                age: 50,
                originalDistance: dist,
              })
            }
          })
        }
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" style={{ mixBlendMode: "difference" }} />
  )
}
