"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface DirectRazorpayProps {
  amount: number
  credits: number
  onSuccess: (credits: number) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function DirectRazorpay({ amount, credits, onSuccess }: DirectRazorpayProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]}: ${message}`])
  }

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve, reject) => {
      addLog("Loading Razorpay script")
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
  }

  const handlePayment = async () => {
    if (!user) return

    setIsLoading(true)
    setError("")
    setLogs([])
    addLog("Payment process started")

    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await loadRazorpayScript()
      } else {
        addLog("Razorpay already loaded")
      }

      // Create a simple order ID for testing
      const orderId = `order_${Date.now()}`
      addLog(`Created test order ID: ${orderId}`)

      // Initialize Razorpay options
      const options = {
        key: "rzp_test_aFBHBrEi7bfSl3", // Use test key directly for debugging
        amount: amount * 100, // in paise
        currency: "INR",
        name: "CollegeSphere",
        description: `Purchase ${credits} credits (Test)`,
        order_id: orderId, // This won't work with real Razorpay but helps for testing
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        handler: (response: any) => {
          addLog("Payment handler called")
          addLog(`Payment ID: ${response.razorpay_payment_id || "N/A"}`)

          // Simulate success
          if (user) {
            user.credits += credits
            addLog(`Credits added: ${credits}`)
          }

          setIsLoading(false)
          onSuccess(credits)
        },
        modal: {
          ondismiss: () => {
            addLog("Payment modal dismissed")
            setIsLoading(false)
          },
        },
      }

      addLog("Creating Razorpay instance")
      const razorpay = new window.Razorpay(options)
      addLog("Opening Razorpay checkout")
      razorpay.open()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed"
      addLog(`Error: ${errorMessage}`)
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button onClick={handlePayment} disabled={isLoading || !user} className="w-full">
        {isLoading ? "Processing..." : `Test Pay ₹${amount}`}
      </Button>

      {logs.length > 0 && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono h-40 overflow-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      )}
    </div>
  )
}
