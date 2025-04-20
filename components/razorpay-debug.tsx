"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function RazorpayDebug() {
  const [isVisible, setIsVisible] = useState(false)
  const [razorpayStatus, setRazorpayStatus] = useState("Not loaded")
  const [lastError, setLastError] = useState<string | null>(null)

  useEffect(() => {
    // Check for debug mode via URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const debugMode = urlParams.get("debug") === "true"

    if (debugMode) {
      setIsVisible(true)

      // Check Razorpay status
      const checkRazorpay = () => {
        if (typeof window !== "undefined") {
          if ((window as any).Razorpay) {
            setRazorpayStatus("Loaded")
          } else {
            setRazorpayStatus("Not loaded")
          }
        }
      }

      // Listen for errors
      const handleError = (event: ErrorEvent) => {
        if (event.message.includes("Razorpay") || event.message.includes("razorpay")) {
          setLastError(event.message)
        }
      }

      window.addEventListener("error", handleError)

      checkRazorpay()
      const interval = setInterval(checkRazorpay, 1000)

      return () => {
        clearInterval(interval)
        window.removeEventListener("error", handleError)
      }
    }
  }, [])

  const testRazorpay = () => {
    try {
      if ((window as any).Razorpay) {
        // Just create a simple instance to test if it works
        const rzp = new (window as any).Razorpay({
          key: "rzp_test_1DP5mmOlF5G5ag",
          amount: 100,
          currency: "INR",
          name: "Test",
          description: "Test Payment",
          handler: () => {
            alert("Test successful")
          },
        })
        alert("Razorpay instance created successfully")
      } else {
        alert("Razorpay not loaded")
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 bg-black/80 text-white p-2 text-xs font-mono z-50">
      <div>Razorpay: {razorpayStatus}</div>
      {lastError && <div className="text-red-400">Error: {lastError}</div>}
      <div className="flex gap-2 mt-1">
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-xs"
          onClick={() => {
            // Force reload Razorpay script
            const script = document.createElement("script")
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            script.async = true
            document.body.appendChild(script)
          }}
        >
          Reload Razorpay
        </Button>
        <Button size="sm" variant="outline" className="h-6 text-xs" onClick={testRazorpay}>
          Test Razorpay
        </Button>
      </div>
    </div>
  )
}
