"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface BookingConfirmationModalProps {
  open: boolean
  onClose: () => void
  userId: string
  userCredits: number
}

export function BookingConfirmationModal({ open, onClose, userId, userCredits }: BookingConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { updateUserCredits } = useAuth()

  const handleConfirm = async () => {
    if (userCredits < 500) {
      setError("You don't have enough credits for this session.")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // Use our API endpoint to handle both credit deduction and transaction logging
      const response = await fetch("/api/deduct-session-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          credits: 500, // Amount to deduct
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to deduct credits")
      }

      // Update the user credits in the auth context to refresh the UI
      updateUserCredits(userId, -500)

      // Mark as success
      setSuccess(true)

      // Redirect to Calendly after a short delay
      setTimeout(() => {
        const schedulingUrl = "https://calendly.com/collegesphere25/30min"
        window.open(schedulingUrl, "_blank")
        onClose()
      }, 1500)
    } catch (error) {
      // Error processing booking
      setError(error instanceof Error ? error.message : "Failed to process booking")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isProcessing) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto w-[95%] sm:w-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Book a One-to-One Session</DialogTitle>
          <DialogDescription>This will deduct 500 credits from your account</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="text-center">
              <h3 className="text-lg font-medium">Payment Successful!</h3>
              <p className="text-muted-foreground mt-1">Redirecting you to the scheduling page...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                  Expert College Selection & Career Advice
                </h3>
                <p className="text-sm text-muted-foreground mb-2">45 min</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Web conferencing details provided upon confirmation.
                </p>
                <p className="text-sm mb-4">
                  Book a 30-45 minute personal session with current IIT students who have secured an average package of
                  50 LPA from top IITs. Get expert insights on college selection, career opportunities, exam strategies,
                  and how to maximize your potential. Whether you're preparing for JEE, choosing the right institute, or
                  planning your career path, our mentors will provide personalized guidance tailored to your goals.
                </p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <span className="mr-2">🎯</span> What you'll get:
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">✅</span> Best-fit college predictions based on your profile
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✅</span> Personalized study strategies and exam tips
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✅</span> Career insights from top IIT graduates
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✅</span> One-on-one mentorship for your success
                    </li>
                  </ul>
                </div>
                <p className="text-sm mt-4">
                  <span className="mr-2">📅</span> Book your session now and take the first step towards your dream
                  college! <span className="ml-1">🚀</span>
                </p>
              </div>

              <p className="text-xs text-muted-foreground italic">
                * This is a non-refundable process. Credits will be deducted immediately upon confirmation.
              </p>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isProcessing || userCredits < 500}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isProcessing ? "Processing..." : "Confirm & Pay 500 Credits"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
