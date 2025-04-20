"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"

interface MinimalRazorpayProps {
  amount: number
  credits: number
  onSuccess: (credits: number) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function MinimalRazorpay({ amount, credits, onSuccess }: MinimalRazorpayProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [showLogs, setShowLogs] = useState(false)

  const addLog = (message: string) => {
    console.log(`Razorpay: ${message}`) // Log to console
    setLogs((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]}: ${message}`])
  }

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve, reject) => {
      addLog("Loading Razorpay script")

      // Check if script is already loaded
      if (window.Razorpay) {
        addLog("Razorpay already loaded, using existing instance")
        return resolve()
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true

      script.onload = () => {
        addLog("Razorpay script loaded successfully")
        resolve()
      }

      script.onerror = (error) => {
        const errorMsg = `Failed to load Razorpay script: ${error.toString()}`
        addLog(errorMsg)
        reject(new Error(errorMsg))
      }

      document.body.appendChild(script)
      addLog("Razorpay script added to DOM")
    })
  }

  const handlePayment = async () => {
    if (!user) {
      setError("User information not available")
      return
    }

    setIsLoading(true)
    setError("")
    setLogs([])
    addLog("Payment process started")

    try {
      // Load Razorpay script
      try {
        await loadRazorpayScript()
      } catch (scriptError) {
        throw new Error(
          `Script loading failed: ${scriptError instanceof Error ? scriptError.message : String(scriptError)}`,
        )
      }

      // Verify Razorpay is available
      if (!window.Razorpay) {
        throw new Error("Razorpay not available after script load")
      }

      // Create order via API
      addLog("Creating order via API")
      let orderResponse
      try {
        orderResponse = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            credits,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            userMobile: user.mobile,
          }),
        })
        addLog(`API response status: ${orderResponse.status}`)
      } catch (fetchError) {
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
      }

      // Handle non-OK responses
      if (!orderResponse.ok) {
        let errorMessage = `Server error: ${orderResponse.status} ${orderResponse.statusText}`

        try {
          // Clone the response before reading it
          const responseClone = orderResponse.clone()
          try {
            const errorData = await responseClone.json()
            addLog(`API error response: ${JSON.stringify(errorData)}`)
            errorMessage = errorData.error || errorMessage
          } catch (jsonError) {
            const errorText = await orderResponse.text()
            addLog(`API error text: ${errorText}`)
            errorMessage = errorText || errorMessage
          }
        } catch (readError) {
          addLog(`Failed to read error response: ${String(readError)}`)
        }

        throw new Error(errorMessage)
      }

      // Parse response
      let orderData
      try {
        orderData = await orderResponse.json()
        addLog(`Order created: ${JSON.stringify(orderData)}`)
      } catch (jsonError) {
        throw new Error(
          `Invalid response from server: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`,
        )
      }

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Set the body attribute before opening Razorpay
      document.body.setAttribute("data-razorpay-active", "true")

      // Initialize Razorpay
      addLog("Initializing Razorpay checkout")
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
        modal: {
          ondismiss: () => {
            addLog("Razorpay modal dismissed")
            setIsLoading(false)
            document.body.removeAttribute("data-razorpay-active")
          },
        },
        handler: async (response: any) => {
          addLog(`Payment successful: ${JSON.stringify(response)}`)
          document.body.removeAttribute("data-razorpay-active")

          try {
            // Verify payment
            addLog("Verifying payment with server")
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                userId: user.id,
                credits,
              }),
            })

            addLog(`Verification response status: ${verifyResponse.status}`)

            if (!verifyResponse.ok) {
              let errorMessage = `Verification failed: ${verifyResponse.status} ${verifyResponse.statusText}`

              try {
                const errorData = await verifyResponse.json()
                addLog(`Verification error: ${JSON.stringify(errorData)}`)
                errorMessage = errorData.error || errorMessage
              } catch (jsonError) {
                addLog(`Failed to parse verification error: ${String(jsonError)}`)
              }

              throw new Error(errorMessage)
            }

            const verifyData = await verifyResponse.json()
            addLog(`Verification successful: ${JSON.stringify(verifyData)}`)

            if (!verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed")
            }

            // Update local user state
            if (user) {
              user.credits += credits
              addLog(`Credits added to user: ${credits}`)
            }

            setIsLoading(false)
            onSuccess(credits)
          } catch (verifyError) {
            const errorMsg = verifyError instanceof Error ? verifyError.message : "Payment verification failed"
            addLog(`Verification error: ${errorMsg}`)
            setError(errorMsg)
            setIsLoading(false)
            setShowLogs(true)
          }
        },
      }

      try {
        addLog("Creating Razorpay instance")
        const razorpay = new window.Razorpay(options)

        razorpay.on("payment.failed", (response: any) => {
          addLog(`Payment failed: ${JSON.stringify(response.error)}`)
          setError(response.error.description || "Payment failed")
          setIsLoading(false)
          document.body.removeAttribute("data-razorpay-active")
          setShowLogs(true)
        })

        addLog("Opening Razorpay checkout")
        razorpay.open()
      } catch (razorpayError) {
        throw new Error(
          `Razorpay initialization error: ${razorpayError instanceof Error ? razorpayError.message : String(razorpayError)}`,
        )
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed"
      addLog(`Error: ${errorMessage}`)
      setError(errorMessage)
      setIsLoading(false)
      setShowLogs(true)
    }
  }

  return (
    <div>
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md mb-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Button onClick={handlePayment} disabled={isLoading || !user} className="w-full">
        {isLoading ? "Processing..." : `Pay ₹${amount}`}
      </Button>

      {logs.length > 0 && (
        <div className="mt-2 flex justify-end">
          <Button variant="link" size="sm" className="text-xs" onClick={() => setShowLogs(!showLogs)}>
            {showLogs ? "Hide Logs" : "Show Logs"}
          </Button>
        </div>
      )}

      {showLogs && logs.length > 0 && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono h-40 overflow-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      )}
    </div>
  )
}
