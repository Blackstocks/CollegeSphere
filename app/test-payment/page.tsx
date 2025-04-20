"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { RazorpayButton } from "@/components/razorpay-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleRechargeModal } from "@/components/simple-recharge-modal"
import { Button } from "@/components/ui/button"

export default function TestPaymentPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Test Payment Integration</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Razorpay Button</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">This button tests the basic Razorpay integration with a ₹1 payment.</p>
                <RazorpayButton />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Recharge Modal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">This tests the recharge modal with a ₹100 payment for 100 credits.</p>
                <Button onClick={() => setShowModal(true)}>Open Recharge Modal</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h2 className="font-semibold mb-2">Troubleshooting Tips</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Make sure you're connected to the internet</li>
              <li>Try using a different browser</li>
              <li>Check if any browser extensions might be blocking the payment popup</li>
              <li>Ensure you're using HTTPS (Razorpay requires a secure connection)</li>
              <li>Try refreshing the page before making a payment</li>
            </ul>
          </div>
        </div>
      </main>

      <SimpleRechargeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(credits) => {
          alert(`Added ${credits} credits successfully!`)
          setShowModal(false)
        }}
      />
    </div>
  )
}
