"use client"

import { useState, useEffect } from "react"

interface DebugInfo {
  razorpayAvailable: boolean
  modalState: string
  lastAction: string
  timestamp: string
}

export function DebugOverlay() {
  const [visible, setVisible] = useState(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    razorpayAvailable: false,
    modalState: "unknown",
    lastAction: "none",
    timestamp: new Date().toISOString(),
  })

  useEffect(() => {
    // Check for debug mode via URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const debugMode = urlParams.get("debug") === "true" || localStorage.getItem("debug") === "true"

    if (debugMode) {
      setVisible(true)

      // Update debug info every second
      const interval = setInterval(() => {
        setDebugInfo({
          razorpayAvailable: typeof window !== "undefined" && !!(window as any).Razorpay,
          modalState: document.querySelector('[role="dialog"]') ? "open" : "closed",
          lastAction: localStorage.getItem("lastAction") || "none",
          timestamp: new Date().toISOString(),
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [])

  // Log actions for debugging
  const logAction = (action: string) => {
    localStorage.setItem("lastAction", action)
  }

  // Expose the logAction function globally
  useEffect(() => {
    if (typeof window !== "undefined" && visible) {
      ;(window as any).logAction = logAction
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-2 text-xs font-mono z-50 max-w-xs">
      <div>Debug Info:</div>
      <div>Razorpay: {debugInfo.razorpayAvailable ? "Available" : "Not Available"}</div>
      <div>Modal: {debugInfo.modalState}</div>
      <div>Last Action: {debugInfo.lastAction}</div>
      <div>Time: {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
      <button
        onClick={() => logAction("manual-test")}
        className="bg-blue-500 text-white px-2 py-1 text-xs mt-1 rounded"
      >
        Test
      </button>
    </div>
  )
}
