"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, XCircle } from "lucide-react"

export default function BookingSuccessPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [error, setError] = useState("")

  useEffect(() => {
    async function processBooking() {
      if (!user) {
        setStatus("error")
        setError("User not found. Please log in.")
        return
      }

      try {
        // Get the event details from URL parameters
        const eventName = searchParams.get("event_name")
        const eventDate = searchParams.get("event_date")
        const eventTime = searchParams.get("event_time")

        // Deduct credits
        const response = await fetch("/api/deduct-booking-credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            eventName,
            eventDate,
            eventTime,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to process booking")
        }

        setStatus("success")
      } catch (error) {
        // Error processing booking
        setStatus("error")
        setError(error instanceof Error ? error.message : "Failed to process booking")
      }
    }

    processBooking()
  }, [user, searchParams])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Booking {status === "processing" ? "Processing" : "Status"}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {status === "processing" ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : status === "success" ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500" />
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mb-4">
                    500 credits have been deducted from your account. Check your email for the meeting details.
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500" />
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Booking Error</h2>
                  <p className="text-red-600 mb-4">{error}</p>
                </div>
              </>
            )}
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
