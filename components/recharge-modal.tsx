"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface RechargeOption {
  credits: number
  price: number
  originalPrice: number
  discount: number
  paymentLink: string
}

interface RechargeModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (credits: number) => void
}

export function RechargeModal({ open, onClose, onSuccess }: RechargeModalProps) {
  const { user } = useAuth()
  const [selectedOption, setSelectedOption] = useState<RechargeOption | null>(null)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(open)
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"select" | "payment" | "transaction">("select")
  const [transactionId, setTransactionId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    setShowModal(open)
    if (open) {
      setStep("select")
      setSelectedOption(null)
      setTransactionId("")
      setError("")
      setSuccessMessage("")
    }
  }, [open])

  const rechargeOptions: RechargeOption[] = [
    {
      credits: 50,
      price: 50,
      originalPrice: 50,
      discount: 0,
      paymentLink: "https://payments.cashfree.com/forms/blackstocks",
    },
    {
      credits: 100,
      price: 100,
      originalPrice: 100,
      discount: 0,
      paymentLink: "https://payments.cashfree.com/forms/blackstocks",
    },
    {
      credits: 200,
      price: 180,
      originalPrice: 200,
      discount: 10,
      paymentLink: "https://payments.cashfree.com/forms/blackstocks",
    },
    {
      credits: 500,
      price: 400,
      originalPrice: 500,
      discount: 20,
      paymentLink: "https://payments.cashfree.com/forms/blackstocks",
    },
    {
      credits: 1000,
      price: 700,
      originalPrice: 1000,
      discount: 30,
      paymentLink: "https://payments.cashfree.com/forms/blackstocks",
    },
  ]

  const handleProceedToPayment = () => {
    if (!selectedOption) return
    setStep("payment")
  }

  const handleOpenPaymentLink = () => {
    if (!selectedOption || !user) return

    // Open the payment link in a new tab
    window.open(selectedOption.paymentLink, "_blank")

    // Move to transaction step
    setStep("transaction")
  }

  // Update the handleSubmitTransaction function to use the simplified API
  const handleSubmitTransaction = async () => {
    if (!transactionId || !selectedOption || !user) return

    setIsSubmitting(true)
    setError("")

    try {
      // Submit the transaction to the API with just the essential fields
      const response = await fetch("/api/submit-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: user.name,
          userEmail: user.email,
          userMobile: user.mobile,
          transactionId: transactionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit transaction")
      }

      setSuccessMessage(
        "Transaction submitted successfully! Your credits will be added to your wallet within 15-30 minutes.",
      )

      // Reset form
      setTransactionId("")
    } catch (err) {
      console.error("Error submitting transaction:", err)
      setError(err instanceof Error ? err.message : "Failed to submit transaction")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSelectStep = () => (
    <>
      <div className="py-4">
        {/* Desktop view - Tabular layout */}
        <div className="hidden md:block overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Package</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Credits</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Savings</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Select</th>
              </tr>
            </thead>
            <tbody>
              {rechargeOptions.map((option, index) => (
                <tr
                  key={option.credits + "-" + option.price}
                  className={`border-t hover:bg-muted/30 transition-colors cursor-pointer ${
                    selectedOption?.credits === option.credits && selectedOption?.price === option.price
                      ? "bg-primary/10"
                      : ""
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {option.credits} Credits
                      {option.price === 1 && (
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        >
                          Test
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                        <span className="font-semibold text-primary">{option.credits}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₹{option.price}</span>
                      {option.discount > 0 && (
                        <span className="text-sm text-muted-foreground line-through">₹{option.originalPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {option.discount > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        Save {option.discount}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {selectedOption?.credits === option.credits && selectedOption?.price === option.price ? (
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 mx-auto"></div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view - Card layout with improvements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-3">
          {rechargeOptions.map((option) => (
            <Card
              key={option.credits + "-" + option.price}
              className={`cursor-pointer transition-all ${
                selectedOption?.credits === option.credits && selectedOption?.price === option.price
                  ? "border-primary ring-2 ring-primary ring-opacity-50"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedOption(option)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xl font-bold">{option.credits}</div>
                    <div className="text-sm text-muted-foreground">Credits</div>
                  </div>
                  {selectedOption?.credits === option.credits && selectedOption?.price === option.price && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xl font-semibold">₹{option.price}</span>
                  {option.discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">₹{option.originalPrice}</span>
                  )}
                </div>

                <div className="mt-2">
                  {option.discount > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      Save {option.discount}%
                    </Badge>
                  )}
                  {option.price === 1 && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mt-1"
                    >
                      Test Payment
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleProceedToPayment}
          disabled={!selectedOption || isProcessing}
          className="bg-primary text-white"
        >
          Continue
        </Button>
      </DialogFooter>
    </>
  )

  const renderPaymentStep = () => (
    <>
      <div className="space-y-4 py-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-300 flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" /> IMPORTANT INSTRUCTIONS
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>After clicking "Proceed to Payment", you'll be redirected to the Cashfree payment form.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>
                On the form, select the <strong>{selectedOption?.credits} credits</strong> option for{" "}
                <strong>₹{selectedOption?.price}</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>
                Complete your payment and{" "}
                <span className="font-bold underline">note down the transaction ID/reference number</span> shown on the
                payment success page.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Return to this page and enter the transaction ID in the next step.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">5.</span>
              <span>DO NOT refresh or close this page until you've submitted your transaction ID.</span>
            </li>
          </ul>
        </div>

        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md border border-red-200 dark:border-red-800">
          <h3 className="font-medium text-red-800 dark:text-red-300 flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" /> WARNING
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
            Please DO NOT press the back button or refresh the page while completing your payment.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" /> Payment Summary
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Package:</div>
            <div className="font-medium">{selectedOption?.credits} Credits</div>

            <div className="text-muted-foreground">Amount:</div>
            <div className="font-medium">₹{selectedOption?.price}</div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setStep("select")}>
          Back
        </Button>
        <Button onClick={handleOpenPaymentLink} className="bg-primary text-white flex items-center gap-2">
          Proceed to Payment <ExternalLink className="h-4 w-4" />
        </Button>
      </DialogFooter>
    </>
  )

  const renderTransactionStep = () => (
    <>
      <div className="space-y-4 py-4">
        {successMessage ? (
          <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-md border border-green-200 dark:border-green-800 text-center">
            <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-600 dark:text-green-400" />
            <h3 className="font-medium text-green-800 dark:text-green-300 text-lg mb-2">
              Transaction Submitted Successfully!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your credits will be added to your wallet within 15-30 minutes.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" /> Enter Transaction Details
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                Please enter the transaction ID/reference number from your payment receipt.
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your credits will be reflected in your wallet within 15-30 minutes after verification.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID/Reference Number</Label>
              <Input
                id="transactionId"
                placeholder="Enter the transaction ID from your payment receipt"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                This is usually a long alphanumeric code shown on the payment success page or sent to your email.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </>
        )}
      </div>

      <DialogFooter>
        {successMessage ? (
          <Button onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={() => setStep("payment")} disabled={isSubmitting}>
              Back
            </Button>
            <Button
              onClick={handleSubmitTransaction}
              disabled={!transactionId || isSubmitting}
              className="bg-primary text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Transaction"}
            </Button>
          </>
        )}
      </DialogFooter>
    </>
  )

  return (
    <Dialog
      open={showModal}
      onOpenChange={(isOpen) => {
        setShowModal(isOpen)
        if (!isOpen) onClose()
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95%] sm:w-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === "select"
              ? "Recharge Credits"
              : step === "payment"
                ? "Payment Instructions"
                : "Submit Transaction"}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Choose a recharge package to continue using the college predictor"
              : step === "payment"
                ? "Follow these instructions to complete your payment"
                : "Enter your transaction details to verify your payment"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" && renderSelectStep()}
        {step === "payment" && renderPaymentStep()}
        {step === "transaction" && renderTransactionStep()}
      </DialogContent>
    </Dialog>
  )
}
