"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, RefreshCw } from "lucide-react"

export function MinimalPayment() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(`MinimalPayment: ${message}`)
    setLogs((prev) => [...prev, message])
  }

  const handlePayment = async () => {
    if (!user) {
      setError("Please log in first")
      return
    }

    setIsLoading(true)
    setError("")
    addLog("Starting payment process")

    try {
      // Load Razorpay script if not already loaded
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        addLog("Loading Razorpay script")
        await new Promise<void>((resolve, reject) => {
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
      } else {
        addLog("Razorpay already loaded")
      }

      // Use test key directly for minimal test
      const options = {
        key: "rzp_test_sRi0HhDMynjDIL", // Test key
        amount: 10000, // ₹100 in paise
        currency: "INR",
        name: "CollegeSphere",
        description: "Test Payment",
        prefill: {
          name: user.name || "Test User",
          email: user.email || "test@example.com",
          contact: user.mobile || "9999999999",
        },
        handler: (response: any) => {
          addLog(`Payment handler called: ${JSON.stringify(response)}`)
          alert("Test payment successful!")
          setIsLoading(false)
        },
        modal: {
          ondismiss: () => {
            addLog("Payment modal dismissed")
            setIsLoading(false)
          },
        },
      }

      addLog("Creating Razorpay instance")
      const razorpay = new (window as any).Razorpay(options)

      razorpay.on("payment.failed", (response: any) => {
        addLog(`Payment failed: ${JSON.stringify(response.error)}`)
        setError(`Payment failed: ${response.error.description}`)
        setIsLoading(false)
      })

      addLog("Opening Razorpay checkout")
      razorpay.open()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      addLog(`Error: ${errorMessage}`)
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handlePayment} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Test Direct Payment (₹100)"
        )}
      </Button>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono h-40 overflow-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      )}
    </div>
  )
}
