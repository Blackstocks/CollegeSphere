"use client"

import { useEffect, useState } from "react"

export function MousePointerEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener("mousemove", updateMousePosition)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  // Don't render on mobile devices
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
    return null
  }

  return (
    <>
      {/* Main cursor */}
      <div
        className={`pointer-events-none fixed z-50 h-6 w-6 -ml-3 -mt-3 rounded-full border-2 border-purple-500 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: "transform 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out",
        }}
      ></div>

      {/* Trailing effect */}
      <div
        className={`pointer-events-none fixed z-50 h-2 w-2 -ml-1 -mt-1 rounded-full bg-blue-500 transition-opacity duration-300 ${
          isVisible ? "opacity-70" : "opacity-0"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: "left 0.15s ease-out, top 0.15s ease-out",
          boxShadow: "0 0 10px 2px rgba(59, 130, 246, 0.3)",
        }}
      ></div>
    </>
  )
}
