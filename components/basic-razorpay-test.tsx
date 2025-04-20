"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BasicRazorpayTest() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
    setLogs((prev) => [...prev, `${timestamp}: ${message}`])
    console.log(`BasicTest: ${message}`)
  }

  const testRazorpay = async () => {
    setIsLoading(true)
    addLog("Starting basic Razorpay test")

    try {
      // Load Razorpay script if not already loaded
      if (typeof window.Razorpay === "undefined") {
        addLog("Loading Razorpay script")
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://checkout.razorpay.com/v1/checkout.js"
          script.async = true
          script.onload = () => {
            addLog("Razorpay script loaded")
            resolve()
          }
          script.onerror = () => {
            addLog("Failed to load Razorpay script")
            reject(new Error("Failed to load Razorpay script"))
          }
          document.body.appendChild(script)
        })
      } else {
        addLog("Razorpay already loaded")
      }

      // Create the most basic Razorpay instance possible
      const options = {
        key: "rzp_test_sRi0HhDMynjDIL", // Your new test key
        amount: 10000, // ₹100
        currency: "INR",
        name: "Basic Test",
        description: "Most basic Razorpay test",
        handler: () => {
          addLog("Payment handler called - success!")
          setIsLoading(false)
        },
        modal: {
          ondismiss: () => {
            addLog("Modal dismissed")
            setIsLoading(false)
          },
        },
      }

      addLog("Creating basic Razorpay instance")
      const rzp = new window.Razorpay(options)

      // Remove any existing dialogs or overlays that might interfere
      document.querySelectorAll('[role="dialog"]').forEach((el) => {
        el.setAttribute("style", "display: none !important")
      })

      addLog("Opening Razorpay modal")
      rzp.open()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addLog(`Error: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Basic Razorpay Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            This is the most basic Razorpay test possible - it just tries to open the modal with minimal configuration.
          </p>

          <Button onClick={testRazorpay} disabled={isLoading} className="w-full">
            {isLoading ? "Testing..." : "Run Basic Test"}
          </Button>

          <div className="h-40 overflow-auto p-2 bg-gray-100 rounded text-xs font-mono">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet.</div>
            ) : (
              logs.map((log, i) => <div key={i}>{log}</div>)
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
