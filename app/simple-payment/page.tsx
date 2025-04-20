"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { MinimalTest } from "@/components/minimal-test"

export default function SimplePaymentPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Check if Razorpay is already loaded
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      console.log("Razorpay already loaded on page load")
      setScriptLoaded(true)
    } else {
      console.log("Razorpay not loaded on page load, will load manually")
    }
  }, [])

  const addLog = (message: string) => {
    console.log(`SimplePayment: ${message}`)
    setLogs((prev) => [...prev, message])
  }

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        addLog("Razorpay already loaded")
        setScriptLoaded(true)
        return resolve()
      }

      addLog("Loading Razorpay script manually")
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true

      script.onload = () => {
        addLog("Razorpay script loaded successfully")
        setScriptLoaded(true)
        resolve()
      }

      script.onerror = (error) => {
        addLog(`Failed to load Razorpay script: ${error}`)
        reject(new Error("Failed to load Razorpay script"))
      }

      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!user) {
      addLog("User not logged in")
      alert("Please log in to continue")
      return
    }

    setIsLoading(true)
    addLog("Starting payment process")

    try {
      // Ensure Razorpay is loaded
      if (!scriptLoaded) {
        await loadRazorpayScript()
      }

      // Fixed values for testing
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
        description: `Purchase ${credits} credits`,
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile || "9999999999",
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
      addLog("Razorpay.open() called")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      addLog(`Error: ${errorMessage}`)
      alert(`Error: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Simple Payment Test</h1>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="mb-6 text-center">
              <div className="text-lg font-medium">100 Credits</div>
              <div className="text-3xl font-bold mt-2">₹100</div>
              <div className="text-sm text-gray-500 mt-1">One-time payment</div>
            </div>

            <Button onClick={handlePayment} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? "Processing..." : "Pay with Razorpay"}
            </Button>

            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Razorpay Status:</div>
              <div className="text-sm bg-gray-100 p-2 rounded">{scriptLoaded ? "✅ Loaded" : "❌ Not Loaded"}</div>
            </div>

            {logs.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Debug Logs:</div>
                <div className="bg-gray-100 p-2 rounded h-40 overflow-y-auto text-xs font-mono">
                  {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <MinimalTest />
        </div>
      </main>
    </div>
  )
}
