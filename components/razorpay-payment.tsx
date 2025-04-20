"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, CheckCircle } from "lucide-react"

interface RazorpayPaymentProps {
  amount: number
  credits: number
  onSuccess: (credits: number) => void
  onError?: (error: string) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayPayment({ amount, credits, onSuccess, onError }: RazorpayPaymentProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const razorpayInstance = useRef<any>(null)

  // Calculate GST (18%) - GST is added on top of the base amount
  const baseAmount = amount
  const gstAmount = Math.round(baseAmount * 0.18 * 100) / 100
  const totalAmount = baseAmount + gstAmount

  useEffect(() => {
    // Load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => {
        console.log("Razorpay script loaded successfully")
        setRazorpayLoaded(true)
      }
      script.onerror = () => {
        console.error("Failed to load Razorpay script")
        setError("Failed to load payment gateway. Please try again later.")
      }
      document.body.appendChild(script)

      return () => {
        // Cleanup
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    } else {
      console.log("Razorpay already loaded")
      setRazorpayLoaded(true)
    }
  }, [])

  // Cleanup Razorpay instance on unmount
  useEffect(() => {
    return () => {
      if (razorpayInstance.current) {
        razorpayInstance.current.close()
      }
    }
  }, [])

  const handlePayment = async () => {
    if (!user) {
      setError("User information not available. Please try again.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Create order on server
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          baseAmount: baseAmount,
          gstAmount: gstAmount,
          credits,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userMobile: user.mobile,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create order: ${errorText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create order")
      }

      // Set the body attribute before opening Razorpay
      document.body.setAttribute("data-razorpay-active", "true")

      const options = {
        key: data.keyId,
        amount: Math.round(totalAmount * 100), // in paise, ensure it's an integer
        currency: "INR",
        name: "CollegeSphere",
        description: `Purchase ${credits} credits`,
        order_id: data.orderId,
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
            console.log("Razorpay modal dismissed")
            setIsLoading(false)
            document.body.removeAttribute("data-razorpay-active")
          },
        },
        handler: (response: any) => {
          console.log("Payment successful, handling response:", response)
          document.body.removeAttribute("data-razorpay-active")
          handlePaymentSuccess(response)
        },
      }

      // Create a new instance each time
      const rzp = new window.Razorpay(options)
      razorpayInstance.current = rzp

      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error)
        setError(response.error.description || "Payment failed")
        setIsLoading(false)
        document.body.removeAttribute("data-razorpay-active")
        if (onError) onError(response.error.description)
      })

      rzp.open()
    } catch (err) {
      console.error("Error in handlePayment:", err)
      const errorMessage = err instanceof Error ? err.message : "Payment initialization failed"
      setError(errorMessage)
      setIsLoading(false)
      document.body.removeAttribute("data-razorpay-active")
      if (onError) onError(errorMessage)
    }
  }

  const handlePaymentSuccess = async (response: any) => {
    console.log("Verifying payment with server")
    try {
      // Verify payment on server
      const verifyResponse = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          userId: user?.id,
          credits,
        }),
      })

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text()
        throw new Error(`Payment verification failed: ${errorText}`)
      }

      const verifyData = await verifyResponse.json()

      if (!verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed")
      }

      console.log("Payment verification successful:", verifyData)
      setSuccess(true)

      // Update local user state with new credits
      if (user) {
        user.credits += credits
      }

      onSuccess(credits)
    } catch (err) {
      console.error("Error in handlePaymentSuccess:", err)
      const errorMessage = err instanceof Error ? err.message : "Payment verification failed"
      setError(errorMessage)
      if (onError) onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span>Payment successful! {credits} credits added.</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-3 rounded-md mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Base amount:</span>
          <span>₹{baseAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>GST (18%):</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium border-t pt-1 mt-1">
          <span>Total:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button onClick={handlePayment} disabled={isLoading || !razorpayLoaded || !user} className="w-full">
        {isLoading ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
      </Button>
    </div>
  )
}
