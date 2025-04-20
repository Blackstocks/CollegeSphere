"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export function DirectKeyTester() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // These are the new keys provided by the user
  const KEY_ID = "rzp_test_sRi0HhDMynjDIL"

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
    setLogs((prev) => [...prev, `${timestamp}: ${message}`])
    console.log(`DirectKeyTester: ${message}`) // Also log to console
  }

  const loadScript = () => {
    return new Promise<void>((resolve, reject) => {
      addLog("Loading Razorpay script")

      // Check if already loaded
      if (window.Razorpay) {
        addLog("✅ Razorpay already loaded")
        setScriptLoaded(true)
        return resolve()
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true

      script.onload = () => {
        addLog("✅ Razorpay script loaded successfully")
        setScriptLoaded(true)
        resolve()
      }

      script.onerror = (error) => {
        const errorMsg = `❌ Failed to load Razorpay script: ${error.toString()}`
        addLog(errorMsg)
        reject(new Error(errorMsg))
      }

      document.body.appendChild(script)
    })
  }

  const testDirectPayment = async () => {
    if (!user) {
      addLog("❌ User not logged in")
      return
    }

    setIsLoading(true)
    addLog("Starting direct payment test with new keys")

    try {
      // Load script if not already loaded
      if (!window.Razorpay) {
        await loadScript()
      }

      // Create a test order ID (this won't be verified since we're just testing)
      const testOrderId = `order_${Date.now()}`
      addLog(`Generated test order ID: ${testOrderId}`)

      // Create Razorpay options with the new key
      const options = {
        key: KEY_ID,
        amount: 10000, // ₹100 in paise
        currency: "INR",
        name: "CollegeSphere",
        description: "Test Payment with New Keys",
        order_id: testOrderId, // This won't be verified by Razorpay in test mode
        prefill: {
          name: user.name || "Test User",
          email: user.email || "test@example.com",
          contact: user.mobile || "9999999999",
        },
        handler: (response: any) => {
          addLog(`✅ Payment handler called with response: ${JSON.stringify(response)}`)
          addLog("This indicates the Razorpay modal is working correctly")
          setIsLoading(false)
        },
        modal: {
          ondismiss: () => {
            addLog("Modal dismissed by user")
            setIsLoading(false)
          },
          escape: true,
          confirm_close: true,
        },
        notes: {
          test_note: "This is a test payment to verify new keys",
        },
      }

      addLog("Creating Razorpay instance with new key")
      const razorpayInstance = new window.Razorpay(options)

      // Add event listeners for better debugging
      razorpayInstance.on("payment.failed", (response: any) => {
        addLog(`❌ Payment failed: ${JSON.stringify(response.error)}`)
        setIsLoading(false)
      })

      // Open the checkout modal
      addLog("Opening Razorpay checkout modal")
      razorpayInstance.open()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addLog(`❌ Error: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Direct Razorpay Key Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              This component directly uses your new Razorpay test keys to verify if they're working correctly. The test
              payment won't be processed, but it will show if the Razorpay modal opens properly.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={testDirectPayment} disabled={isLoading}>
              {isLoading ? "Processing..." : "Test New Razorpay Keys"}
            </Button>
            <Button onClick={clearLogs} variant="outline" size="sm">
              Clear Logs
            </Button>
          </div>

          <div className="h-64 overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Click the button to test your new Razorpay keys.</div>
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
