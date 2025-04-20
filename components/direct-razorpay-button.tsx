"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"

interface DirectRazorpayButtonProps {
  onSuccess?: (credits: number) => void
}

export function DirectRazorpayButton({ onSuccess }: DirectRazorpayButtonProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(`DirectRazorpay: ${message}`)
    setLogs((prev) => [...prev, message])
  }

  const handlePayment = async () => {
    if (!user) {
      setError("Please log in to continue")
      return
    }

    setIsLoading(true)
    setError("")
    addLog("Starting direct payment process")

    try {
      // Check if Razorpay is loaded
      if (typeof window === "undefined" || !window.Razorpay) {
        addLog("Razorpay not loaded, attempting to load script")
        await loadRazorpayScript()
      }

      // Fixed package: 100 credits for ₹100
      const amount = 100
      const credits = 100

      // Create order
      addLog("Creating order via API")
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          credits,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userMobile: user.mobile,
        }),
      })

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        throw new Error(`Failed to create order: ${errorText}`)
      }

      const orderData = await orderResponse.json()
      addLog(`Order created: ${orderData.orderId}`)

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Initialize Razorpay
      addLog("Initializing Razorpay with options")
      const options = {
        key: orderData.keyId,
        amount: amount * 100, // in paise
        currency: "INR",
        name: "CollegeSphere",
        description: `Purchase ${credits} credits`,
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        theme: {
          color: "#7c3aed",
        },
        handler: async (response: any) => {
          addLog(`Payment successful: ${JSON.stringify(response)}`)

          try {
            // Verify payment
            addLog("Verifying payment with server")
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                userId: user.id,
                credits,
                amount,
              }),
            })

            if (!verifyResponse.ok) {
              const errorText = await verifyResponse.text()
              throw new Error(`Payment verification failed: ${errorText}`)
            }

            const verifyData = await verifyResponse.json()
            addLog(`Verification response: ${JSON.stringify(verifyData)}`)

            if (!verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed")
            }

            // Update local user state
            if (user) {
              user.credits += credits
            }

            if (onSuccess) {
              onSuccess(credits)
            }

            alert(`Payment successful! ${credits} credits added to your account.`)
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Payment verification failed"
            addLog(`Error: ${errorMessage}`)
            alert(`Payment verification error: ${errorMessage}`)
          } finally {
            setIsLoading(false)
          }
        },
      }

      addLog("Creating Razorpay instance")
      // Create Razorpay instance
      const razorpay = new window.Razorpay(options)

      // Add event listeners for better debugging
      razorpay.on("payment.failed", (response: any) => {
        addLog(`Payment failed: ${JSON.stringify(response.error)}`)
        alert(`Payment failed: ${response.error.description}`)
        setIsLoading(false)
      })

      // Open Razorpay checkout
      addLog("Opening Razorpay checkout")
      razorpay.open()
      addLog("Razorpay.open() called")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      addLog(`Error: ${errorMessage}`)
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  // Function to load Razorpay script dynamically
  const loadRazorpayScript = () => {
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
    <div className="space-y-4">
      <Button onClick={handlePayment} disabled={isLoading} className="w-full" size="lg">
        {isLoading ? "Processing..." : "Buy 100 Credits for ₹100"}
      </Button>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="p-2 bg-muted rounded-md">
          <p className="text-xs font-medium mb-1">Debug logs:</p>
          <div className="text-xs font-mono h-20 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
