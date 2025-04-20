"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RechargeCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  userName?: string
  userEmail?: string
  userMobile?: string
  onSuccess?: (newCredits: number) => void
}

export function RechargeCreditsModal({
  isOpen,
  onClose,
  userId = "test-user-id",
  userName = "Test User",
  userEmail = "test@example.com",
  userMobile = "",
  onSuccess,
}: RechargeCreditsModalProps) {
  const [amount, setAmount] = useState<number>(499)
  const [credits, setCredits] = useState<number>(500)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  // GST calculation (18%)
  const GST_RATE = 0.18
  const baseAmount = Number.parseFloat((amount / (1 + GST_RATE)).toFixed(2))
  const gstAmount = Number.parseFloat((amount - baseAmount).toFixed(2))

  const handleAmountChange = (value: number) => {
    setAmount(value)
    // Simple 1:1 conversion (can be adjusted based on your pricing model)
    setCredits(Math.floor(value))
  }

  const handleCreditsChange = (value: number) => {
    setCredits(value)
    // Simple 1:1 conversion (can be adjusted based on your pricing model)
    setAmount(value)
  }

  const initiatePayment = async () => {
    if (amount < 1) {
      setMessage("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    setMessage("Creating order...")

    try {
      // Create order
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          credits,
          userId,
          userName,
          userEmail,
          userMobile,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Close the modal before opening Razorpay
      onClose()

      // Check if Razorpay is available
      if (typeof window !== "undefined" && window.Razorpay) {
        // Initialize Razorpay
        const options = {
          key: orderData.keyId,
          amount: amount * 100,
          currency: "INR",
          name: "JEE Predictor",
          description: `Purchase ${credits} credits`,
          order_id: orderData.orderId,
          prefill: {
            name: userName,
            email: userEmail,
            contact: userMobile,
          },
          notes: {
            userId,
            credits,
          },
          theme: {
            color: "#3399cc",
          },
          handler: async (response: any) => {
            try {
              const verifyResponse = await fetch("/api/verify-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  userId,
                  credits,
                  amount,
                }),
              })

              const verifyData = await verifyResponse.json()

              if (verifyData.success) {
                alert(`Payment successful! Added ${credits} credits to your account.`)

                if (onSuccess) {
                  onSuccess(verifyData.newCredits)
                }
              } else {
                alert(`Payment verification failed: ${verifyData.error || "Please contact support"}`)
              }
            } catch (error) {
              alert("Payment verification error: Please contact support")
            }
          },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } else {
        alert("Razorpay SDK failed to load. Please check your internet connection.")
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment initiation failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recharge Credits</DialogTitle>
          <DialogDescription>Add credits to your account to use premium features.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(Number.parseFloat(e.target.value))}
              className="col-span-3"
              min="1"
            />
          </div>

          {/* Display GST breakdown */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-sm text-muted-foreground">Base Amount</Label>
            <div className="col-span-3 text-sm text-muted-foreground">₹{baseAmount.toFixed(2)}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-sm text-muted-foreground">GST (18%)</Label>
            <div className="col-span-3 text-sm text-muted-foreground">₹{gstAmount.toFixed(2)}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="credits" className="text-right">
              Credits
            </Label>
            <Input
              id="credits"
              type="number"
              value={credits}
              onChange={(e) => handleCreditsChange(Number.parseInt(e.target.value))}
              className="col-span-3"
              min="1"
            />
          </div>

          {message && <div className="text-center text-sm text-red-500">{message}</div>}
        </div>
        <div className="flex justify-end">
          <Button onClick={initiatePayment} disabled={isLoading}>
            {isLoading ? "Processing..." : "Pay with Razorpay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
