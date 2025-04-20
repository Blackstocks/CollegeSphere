"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { MinimalRazorpay } from "./minimal-razorpay"
import { DirectRazorpay } from "./direct-razorpay"
import { DirectKeyTester } from "./direct-key-tester"

interface SimpleRechargeModalProps {
  open: boolean
  onClose: () => void
}

export function SimpleRechargeModal({ open, onClose }: SimpleRechargeModalProps) {
  const { user } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<{ credits: number; amount: number } | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<"normal" | "test">("normal")

  const packages = [
    { credits: 100, amount: 100 },
    { credits: 200, amount: 180 },
    { credits: 500, amount: 400 },
  ]

  const handleSuccess = (credits: number) => {
    setSuccess(true)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recharge Credits</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <p className="text-green-600 font-medium">Payment successful!</p>
            <p className="text-sm text-gray-500 mt-2">Your credits have been added to your account.</p>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "normal" | "test")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="normal">Normal</TabsTrigger>
                <TabsTrigger value="test">Test Mode</TabsTrigger>
              </TabsList>

              <TabsContent value="normal">
                <div className="grid grid-cols-3 gap-4 py-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.credits}
                      className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                        selectedPackage?.credits === pkg.credits ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <div className="font-bold">{pkg.credits}</div>
                      <div className="text-sm">₹{pkg.amount}</div>
                    </div>
                  ))}
                </div>

                {selectedPackage && (
                  <MinimalRazorpay
                    amount={selectedPackage.amount}
                    credits={selectedPackage.credits}
                    onSuccess={handleSuccess}
                  />
                )}
              </TabsContent>

              <TabsContent value="test">
                <div className="py-4">
                  <p className="text-sm text-amber-600 mb-4">
                    Test mode bypasses the server API and uses a direct Razorpay integration for debugging.
                  </p>

                  <div className="space-y-4">
                    <DirectRazorpay amount={100} credits={100} onSuccess={handleSuccess} />

                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm font-medium mb-2">Try with new keys:</p>
                      <DirectKeyTester />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
