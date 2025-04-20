"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RechargeCreditsModal } from "@/components/recharge-credits-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RechargeDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [credits, setCredits] = useState(100)

  // Hardcoded user data for demo
  const demoUser = {
    id: "demo-user-123",
    name: "Demo User",
    email: "demo@example.com",
    mobile: "9876543210",
  }

  const handleSuccess = (newCredits: number) => {
    setCredits(newCredits)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>JEE Predictor Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="text-center mb-4">
              <p className="text-lg font-medium">Current Balance</p>
              <p className="text-3xl font-bold">{credits} Credits</p>
            </div>

            <Button onClick={() => setIsModalOpen(true)} className="w-full">
              Recharge Credits
            </Button>

            <p className="text-sm text-muted-foreground text-center mt-2">
              Credits are used for premium features like mock tests and personalized analysis.
            </p>
          </div>
        </CardContent>
      </Card>

      <RechargeCreditsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={demoUser.id}
        userName={demoUser.name}
        userEmail={demoUser.email}
        userMobile={demoUser.mobile}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
