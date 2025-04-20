"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DirectRazorpayButton } from "@/components/direct-razorpay-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function DirectPaymentPage() {
  const { user } = useAuth()
  const [credits, setCredits] = useState(user?.credits || 0)

  const handleSuccess = (newCredits: number) => {
    setCredits((prev) => prev + newCredits)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Direct Payment</h1>

          <Card>
            <CardHeader>
              <CardTitle>Buy Credits</CardTitle>
              <CardDescription>Current balance: {credits} credits</CardDescription>
            </CardHeader>
            <CardContent>
              <DirectRazorpayButton onSuccess={handleSuccess} />

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="font-semibold mb-2 text-sm">Troubleshooting Tips</h3>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Make sure you're connected to the internet</li>
                  <li>Try using a different browser (Chrome or Firefox recommended)</li>
                  <li>Disable any ad blockers or browser extensions</li>
                  <li>Ensure you're using HTTPS (Razorpay requires a secure connection)</li>
                  <li>If on mobile, try using the desktop site option</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
