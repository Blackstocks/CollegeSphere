"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function SuperSimplePayment() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(`SuperSimplePayment: ${message}`)
    setLogs((prev) => [...prev, message])
  }

  const handlePayment = async () => {
    if (!user) {
      alert("Please log in first")
      return
    }

    setIsLoading(true)
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

      // Fixed values for testing
      const amount = 1 // Just ₹1 for testing
      const credits = 1

      // Create order
      addLog("Creating order")
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
          userMobile: user.mobile || "9999999999",
        }),
      })

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        throw new Error(`Failed to create order: ${errorText}`)
      }

      const orderData = await orderResponse.json()
      addLog(`Order created: ${JSON.stringify(orderData)}`)

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Initialize Razorpay
      addLog("Initializing Razorpay")
      const options = {
        key: orderData.keyId,
        amount: amount * 100, // in paise
        currency: "INR",
        name: "CollegeSphere",
        description: "Test Payment",
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile || "9999999999",
        },
        handler: async (response: any) => {
          addLog(`Payment successful: ${JSON.stringify(response)}`)

          try {
            // Verify payment
            addLog("Verifying payment")
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

            const verifyData = await verifyResponse.json()
            addLog(`Verification response: ${JSON.stringify(verifyData)}`)

            if (verifyData.success) {
              alert(`Payment successful! ${credits} credit added.`)
              // Update local user state
              if (user) {
                user.credits += credits
              }
            } else {
              throw new Error(verifyData.error || "Payment verification failed")
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Payment verification failed"
            addLog(`Error: ${errorMessage}`)
            alert(`Payment verification error: ${errorMessage}`)
          } finally {
            setIsLoading(false)
          }
        },
      }

      // Create Razorpay instance
      addLog("Creating Razorpay instance")
      const razorpay = new (window as any).Razorpay(options)

      // Add event listeners for better debugging
      razorpay.on("payment.failed", (response: any) => {
        addLog(`Payment failed: ${JSON.stringify(response.error)}`)
        alert(`Payment failed: ${response.error.description}`)
        setIsLoading(false)
      })

      // Open Razorpay checkout
      addLog("Opening Razorpay checkout")
      razorpay.open()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      addLog(`Error: ${errorMessage}`)
      alert(`Error: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-4">Super Simple Payment Test</h3>
      <p className="mb-4 text-sm text-gray-600">This is the simplest possible implementation with detailed logging.</p>

      <Button onClick={handlePayment} disabled={isLoading} className="w-full">
        {isLoading ? "Processing..." : "Pay ₹1 (Test)"}
      </Button>

      {logs.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Logs:</div>
          <div className="bg-gray-100 p-2 rounded h-40 overflow-y-auto text-xs font-mono">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
