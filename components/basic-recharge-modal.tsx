"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, CheckCircle } from "lucide-react"

interface BasicRechargeModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (credits: number) => void
}

export function BasicRechargeModal({ open, onClose, onSuccess }: BasicRechargeModalProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  // Reset state when modal opens/closes
  const addLog = (message: string) => {
    console.log(`BasicRecharge: ${message}`)
    setLogs((prev) => [...prev, message])
  }

  const handlePayment = async () => {
    if (!user) {
      setError("User information not available")
      return
    }

    setIsLoading(true)
    setError("")
    addLog("Starting payment process")

    try {
      // Check if Razorpay is loaded
      if (typeof window === "undefined" || !(window as any).Razorpay) {
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
          // Removed baseAmount and gstAmount
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

      // Close the modal before opening Razorpay
      addLog("Closing modal before opening Razorpay")
      onClose()

      // Add a small delay to ensure the modal is fully closed
      await new Promise((resolve) => setTimeout(resolve, 100))

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
                // Removed baseAmount and gstAmount
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

            setSuccess(true)
            if (onSuccess) {
              onSuccess(credits)
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Payment verification failed"
            addLog(`Error: ${errorMessage}`)
            alert(`Payment verification error: ${errorMessage}`)
          }
        },
      }

      addLog("Creating Razorpay instance")
      // Create Razorpay instance
      const razorpay = new (window as any).Razorpay(options)

      // Add event listeners for better debugging
      razorpay.on("payment.failed", (response: any) => {
        addLog(`Payment failed: ${JSON.stringify(response.error)}`)
        alert(`Payment failed: ${response.error.description}`)
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
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recharge Credits</DialogTitle>
          <DialogDescription>Add credits to your account to use premium features.</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl font-medium">Payment Successful!</p>
            <p className="text-muted-foreground mt-2">Your credits have been added to your account.</p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-lg font-medium">100 Credits</p>
              <p className="text-3xl font-bold mt-2">₹100</p>
              <p className="text-sm text-muted-foreground mt-1">One-time payment</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button onClick={handlePayment} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? "Processing..." : "Pay with Razorpay"}
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {success ? "Close" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
