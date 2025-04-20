"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function MinimalTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(`MinimalTest: ${message}`)
    setLogs((prev) => [...prev, message])
  }

  const handleTest = async () => {
    setIsLoading(true)
    addLog("Starting minimal test")

    try {
      // Check if Razorpay is available
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        addLog("Razorpay not loaded, loading script")
        await loadScript()
      } else {
        addLog("Razorpay already loaded")
      }

      // Create a minimal Razorpay instance with test key
      const options = {
        key: "rzp_test_sRi0HhDMynjDIL", // Your test key
        amount: 10000, // ₹100 in paise
        currency: "INR",
        name: "Test Company",
        description: "Test Transaction",
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        handler: (response: any) => {
          addLog(`Test payment successful: ${JSON.stringify(response)}`)
          alert("Test payment successful!")
          setIsLoading(false)
        },
      }

      addLog("Creating Razorpay instance")
      const razorpay = new (window as any).Razorpay(options)

      razorpay.on("payment.failed", (response: any) => {
        addLog(`Test payment failed: ${JSON.stringify(response.error)}`)
        alert(`Test payment failed: ${response.error.description}`)
        setIsLoading(false)
      })

      addLog("Opening Razorpay checkout")
      razorpay.open()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Test failed"
      addLog(`Error: ${errorMessage}`)
      alert(`Error: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  const loadScript = () => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true

      script.onload = () => {
        addLog("Razorpay script loaded successfully")
        resolve()
      }

      script.onerror = () => {
        addLog("Failed to load Razorpay script")
        reject(new Error("Failed to load Razorpay script"))
      }

      document.body.appendChild(script)
    })
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Minimal Razorpay Test</h3>
      <p className="mb-4 text-sm text-gray-600">
        This is a minimal test that uses Razorpay's test mode directly without any server calls.
      </p>

      <Button onClick={handleTest} disabled={isLoading}>
        {isLoading ? "Testing..." : "Run Minimal Test"}
      </Button>

      {logs.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Logs:</div>
          <div className="bg-gray-100 p-2 rounded h-32 overflow-y-auto text-xs font-mono">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
