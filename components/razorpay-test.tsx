"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export function RazorpayTest() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTestPayment = async () => {
    if (!user) return

    setIsLoading(true)
    setError("")

    try {
      // Create a test order for 1 credit at ₹1
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1,
          credits: 1,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userMobile: user.mobile,
          baseAmount: 0.85,
          gstAmount: 0.15,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create test order")
      }

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: 100, // ₹1 in paise
        currency: "INR",
        name: "JEE Predictor",
        description: "Test Payment",
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        notes: {
          userId: user.id,
          credits: 1,
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
                userId: user.id,
                credits: 1,
                amount: 1,
                baseAmount: 0.85,
                gstAmount: 0.15,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              alert("Test payment successful!")
              // Update user credits in UI
              window.location.reload()
            } else {
              alert(`Test payment verification failed: ${verifyData.error || "Please contact support"}`)
            }
          } catch (error) {
            alert("Payment verification error: Please contact support")
          }
        },
      }

      // @ts-ignore - Razorpay is loaded from external script
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to initiate test payment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Razorpay Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Click the button below to test the Razorpay payment integration with a ₹1 payment.</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Button onClick={handleTestPayment} disabled={isLoading}>
          {isLoading ? "Processing..." : "Make Test Payment"}
        </Button>
      </CardContent>
    </Card>
  )
}
