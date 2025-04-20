"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"

interface PaymentHistoryItem {
  id: string
  credits_purchased: number
  amount_paid: number
  transaction_id: string | null
  payment_status: "pending" | "completed" | "failed"
  payment_method: string
  created_at: string
}

export default function PaymentHistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchPaymentHistory()
  }, [user, router])

  const fetchPaymentHistory = async () => {
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase
        .from("payment_history")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setPaymentHistory(data || [])
    } catch (err) {
      console.error("Error fetching payment history:", err)
      setError("Failed to load payment history")
    } finally {
      setIsLoading(false)
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
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Payment History</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p>{error}</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Your Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No payment history found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Credits</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Payment Method</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.created_at)}</td>
                          <td className="px-4 py-3">{item.credits_purchased}</td>
                          <td className="px-4 py-3">₹{item.amount_paid.toFixed(2)}</td>
                          <td className="px-4 py-3 capitalize">{item.payment_method}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                item.payment_status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : item.payment_status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {item.payment_status.charAt(0).toUpperCase() + item.payment_status.slice(1)}
                            </Badge>
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
