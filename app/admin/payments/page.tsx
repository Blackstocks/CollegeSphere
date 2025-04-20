"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

interface PaymentAttempt {
  id: string
  user_id: string
  user_name: string
  user_email: string
  user_mobile: string
  credits: number
  amount: number
  payment_link: string
  status: "pending" | "completed" | "failed"
  created_at: string
  updated_at: string
}

export default function AdminPaymentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentAttempts, setPaymentAttempts] = useState<PaymentAttempt[]>([])
  const [error, setError] = useState("")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  // Admin emails that are allowed to access this page
  const adminEmails = ["collegesphere25@gmail.com"]

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Check if the user is an admin
    if (!adminEmails.includes(user.email)) {
      router.push("/dashboard")
      return
    }

    fetchPaymentAttempts()
  }, [user, router])

  const fetchPaymentAttempts = async () => {
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase
        .from("payment_attempts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setPaymentAttempts(data || [])
    } catch (err) {
      console.error("Error fetching payment attempts:", err)
      setError("Failed to load payment attempts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProcessPayment = async (attempt: PaymentAttempt) => {
    setProcessingId(attempt.id)
    setError("")
    setSuccessMessage("")

    try {
      // Call the manual credit update API
      const response = await fetch("/api/manual-credit-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: attempt.user_id,
          credits: attempt.credits,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update credits")
      }

      // Update the payment attempt status
      const { error: updateError } = await supabase
        .from("payment_attempts")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", attempt.id)

      if (updateError) throw updateError

      setSuccessMessage(`Successfully added ${attempt.credits} credits to ${attempt.user_name}`)

      // Refresh the list
      fetchPaymentAttempts()
    } catch (err) {
      console.error("Error processing payment:", err)
      setError(err instanceof Error ? err.message : "Failed to process payment")
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Payment Management</h1>
            <Button onClick={fetchPaymentAttempts} variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Payment Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentAttempts.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No payment attempts found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">User</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Credits</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentAttempts.map((attempt) => (
                        <tr key={attempt.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{attempt.user_name}</div>
                              <div className="text-xs text-muted-foreground">{attempt.user_email}</div>
                              <div className="text-xs text-muted-foreground">{attempt.user_mobile}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">₹{attempt.amount}</td>
                          <td className="px-4 py-3">{attempt.credits}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(attempt.created_at)}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                attempt.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : attempt.status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {attempt.status === "pending" ? (
                              <Button
                                size="sm"
                                onClick={() => handleProcessPayment(attempt)}
                                disabled={processingId === attempt.id}
                              >
                                {processingId === attempt.id ? "Processing..." : "Add Credits"}
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                {attempt.status === "completed" ? "Completed" : "Failed"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
