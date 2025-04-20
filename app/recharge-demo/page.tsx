"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RechargeCreditsModal } from "@/components/recharge-credits-modal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Coins, CreditCard, History, Zap } from "lucide-react"
import Link from "next/link"

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
    setCredits(credits + newCredits)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">JEE Predictor Credits</h1>
          <p className="text-muted-foreground">Manage your credits to access premium features</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mt-8 -mr-8"></div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="mr-2 h-5 w-5" /> Credit Balance
              </CardTitle>
              <CardDescription>Your current available credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-4">{credits}</div>
                <Button onClick={() => setIsModalOpen(true)} className="w-full" size="lg">
                  <CreditCard className="mr-2 h-4 w-4" /> Recharge Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" /> Credit Usage
              </CardTitle>
              <CardDescription>How to use your credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">College Predictions</h3>
                  <p className="text-sm text-muted-foreground">10 credits per prediction</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Personalized Analysis</h3>
                  <p className="text-sm text-muted-foreground">50 credits per analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Mock Tests</h3>
                  <p className="text-sm text-muted-foreground">25 credits per test</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/payment-history">
              <History className="mr-2 h-4 w-4" /> View Payment History
            </Link>
          </Button>
        </div>
      </div>

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
