"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function RazorpayButton() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    if (!user) {
      alert("Please log in first")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Check if Razorpay is available
      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Razorpay not loaded. Please refresh the page and try again.")
      }

      // Create a simple test order
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1, // Just ₹1 for testing
          credits: 1,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userMobile: user.mobile || "9999999999",
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Failed to create order: ${text}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create order")
      }

      // Initialize Razorpay
      const options = {
        key: data.keyId,
        amount: 100, // ₹1 in paise
        currency: "INR",
        name: "CollegeSphere",
        description: "Test Payment",
        order_id: data.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile || "9999999999",
        },
        handler: (response: any) => {
          alert(`Payment successful! ID: ${response.razorpay_payment_id}`)
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Razorpay error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Processing..." : "Test Razorpay"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
