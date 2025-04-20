"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RazorpayTester() {
  const [logs, setLogs] = useState<string[]>([])
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [razorpayAvailable, setRazorpayAvailable] = useState(false)

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]}: ${message}`])
    console.log(message) // Also log to console for debugging
  }

  // Check if Razorpay is already available
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ((window as any).Razorpay) {
        addLog("Razorpay already available on page load")
        setScriptLoaded(true)
        setRazorpayAvailable(true)
      } else {
        addLog("Razorpay not available on page load")
      }
    }
  }, [])

  const loadScript = () => {
    addLog("Attempting to load Razorpay script")

    // Clear any existing script to avoid conflicts
    const existingScript = document.querySelector('script[src*="razorpay"]')
    if (existingScript) {
      addLog("Removing existing Razorpay script")
      existingScript.remove()
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true

    script.onload = () => {
      addLog("✅ Razorpay script loaded successfully")
      setScriptLoaded(true)

      if ((window as any).Razorpay) {
        addLog("✅ Razorpay object is available")
        setRazorpayAvailable(true)
      } else {
        addLog("❌ Razorpay script loaded but Razorpay object is not available")
        setRazorpayAvailable(false)
      }
    }

    script.onerror = (error) => {
      addLog(`❌ Error loading Razorpay script: ${error.toString()}`)
      setScriptLoaded(false)
      setRazorpayAvailable(false)
    }

    addLog("Appending Razorpay script to document body")
    document.body.appendChild(script)
  }

  const testRazorpayObject = () => {
    try {
      if (!(window as any).Razorpay) {
        addLog("❌ Razorpay object not available")
        return
      }

      addLog("Creating test Razorpay instance")
      const rzp = new (window as any).Razorpay({
        key: "rzp_test_placeholder", // This is just for testing object creation
        amount: 100,
        currency: "INR",
        name: "Test",
      })

      addLog("✅ Successfully created Razorpay instance")
      addLog(`Razorpay instance type: ${typeof rzp}`)

      // Check if the instance has expected methods
      if (typeof rzp.on === "function") {
        addLog("✅ Razorpay instance has 'on' method")
      } else {
        addLog("❌ Razorpay instance missing 'on' method")
      }

      if (typeof rzp.open === "function") {
        addLog("✅ Razorpay instance has 'open' method")
      } else {
        addLog("❌ Razorpay instance missing 'open' method")
      }
    } catch (error) {
      addLog(`❌ Error creating Razorpay instance: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Razorpay Integration Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={loadScript} variant="outline">
              Load Razorpay Script
            </Button>
            <Button onClick={testRazorpayObject} variant="outline" disabled={!razorpayAvailable}>
              Test Razorpay Object
            </Button>
            <Button onClick={clearLogs} variant="outline" size="sm">
              Clear Logs
            </Button>
          </div>

          <div className="p-2 rounded bg-gray-100 dark:bg-gray-800">
            <div className="flex gap-4 mb-2">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${scriptLoaded ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-sm">Script Loaded</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${razorpayAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-sm">Razorpay Available</span>
              </div>
            </div>
          </div>

          <div className="h-64 overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Click a button to start testing.</div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={`${log.includes("❌") ? "text-red-500" : log.includes("✅") ? "text-green-500" : ""}`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
