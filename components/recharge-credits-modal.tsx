"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CreditCard, Loader2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface RechargeCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  userName?: string
  userEmail?: string
  userMobile?: string
  onSuccess?: (newCredits: number) => void
}

// Predefined credit packages
const CREDIT_PACKAGES = [
  { id: 1, credits: 100, amount: 99, popular: false, description: "Basic package" },
  { id: 2, credits: 500, amount: 499, popular: true, description: "Most popular" },
  { id: 3, credits: 1000, amount: 899, popular: false, description: "Best value" },
  { id: 4, credits: 2000, amount: 1699, popular: false, description: "Premium package" },
]

export function RechargeCreditsModal({
  isOpen,
  onClose,
  userId = "test-user-id",
  userName = "Test User",
  userEmail = "test@example.com",
  userMobile = "",
  onSuccess,
}: RechargeCreditsModalProps) {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [paymentStep, setPaymentStep] = useState<"select" | "processing" | "success" | "error">("select")

  // GST calculation (18%)
  const GST_RATE = 0.18
  const baseAmount = Number.parseFloat((selectedPackage.amount / (1 + GST_RATE)).toFixed(2))
  const gstAmount = Number.parseFloat((selectedPackage.amount - baseAmount).toFixed(2))

  const resetState = () => {
    setPaymentStep("select")
    setMessage("")
    setIsLoading(false)
  }

  const initiatePayment = async () => {
    setIsLoading(true)
    setPaymentStep("processing")
    setMessage("Creating order...")

    try {
      // Create order
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPackage.amount,
          credits: selectedPackage.credits,
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
          amount: selectedPackage.amount * 100,
          currency: "INR",
          name: "JEE Predictor",
          description: `Purchase ${selectedPackage.credits} credits`,
          order_id: orderData.orderId,
          prefill: {
            name: userName,
            email: userEmail,
            contact: userMobile,
          },
          notes: {
            userId,
            credits: selectedPackage.credits,
          },
          theme: {
            color: "#7c3aed",
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
                  credits: selectedPackage.credits,
                  amount: selectedPackage.amount,
                }),
              })

              const verifyData = await verifyResponse.json()

              if (verifyData.success) {
                setPaymentStep("success")
                if (onSuccess) {
                  onSuccess(verifyData.newCredits)
                }
              } else {
                setPaymentStep("error")
                setMessage(verifyData.error || "Payment verification failed")
              }
            } catch (error) {
              setPaymentStep("error")
              setMessage("Payment verification error")
            }
          },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } else {
        throw new Error("Razorpay SDK failed to load")
      }
    } catch (error) {
      setPaymentStep("error")
      setMessage(error instanceof Error ? error.message : "Payment initiation failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Recharge Credits</DialogTitle>
          <DialogDescription>
            Add credits to your account to access premium features and personalized services.
          </DialogDescription>
        </DialogHeader>

        {paymentStep === "select" && (
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {CREDIT_PACKAGES.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                    selectedPackage.id === pkg.id ? "border-2 border-primary shadow-sm" : "border border-border",
                  )}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    {pkg.popular && <Badge className="bg-primary text-white mb-2">Most Popular</Badge>}
                    <div className="text-3xl font-bold mb-1">{pkg.credits}</div>
                    <div className="text-sm text-muted-foreground mb-3">Credits</div>
                    <div className="text-xl font-semibold">₹{pkg.amount}</div>
                    <div className="text-xs text-muted-foreground mt-2">{pkg.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium">Order Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Base amount:</span>
                <span>₹{baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (18%):</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2 mt-2">
                <span>Total:</span>
                <span>₹{selectedPackage.amount.toFixed(2)}</span>
              </div>
            </div>

            {message && <div className="text-center p-3 bg-red-50 text-red-600 rounded-md text-sm">{message}</div>}

            <Button onClick={initiatePayment} disabled={isLoading} className="w-full py-6 text-base" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" /> Pay ₹{selectedPackage.amount}
                </>
              )}
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        )}

        {paymentStep === "processing" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium">Processing Payment</h3>
            <p className="text-muted-foreground text-center mt-2">Please wait while we process your payment...</p>
          </div>
        )}

        {paymentStep === "success" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Payment Successful!</h3>
            <p className="text-muted-foreground text-center mt-2">
              {selectedPackage.credits} credits have been added to your account.
            </p>
            <Button className="mt-6" onClick={onClose}>
              Continue
            </Button>
          </div>
        )}

        {paymentStep === "error" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <Zap className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-lg font-medium">Payment Failed</h3>
            <p className="text-red-600 text-center mt-2">{message}</p>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={resetState}>
                Try Again
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
