"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { RefreshCw } from "lucide-react"

interface CreditPurchase {
  id: string
  user_id: string
  user_name: string
  user_email: string
  user_mobile: string
  credits_purchased: number
  amount_paid: number
  base_amount: number
  gst_amount: number
  razorpay_order_id: string
  razorpay_payment_id: string | null
  payment_status: "pending" | "completed" | "failed"
  purchase_date: string
  updated_at: string
}

export default function AdminCreditPurchasesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [creditPurchases, setCreditPurchases] = useState<CreditPurchase[]>([])
  const [error, setError] = useState("")

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

    fetchCreditPurchases()
  }, [user, router])

  const fetchCreditPurchases = async () => {
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase
        .from("credit_purchases")
        .select("*")
        .order("purchase_date", { ascending: false })

      if (error) throw error

      setCreditPurchases(data || [])
    } catch (err) {
      console.error("Error fetching credit purchases:", err)
      setError("Failed to load credit purchases")
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
        <div className="container max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Credit Purchase History</h1>
            <Button onClick={fetchCreditPurchases} variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p>{error}</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Credit Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              {creditPurchases.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No credit purchases found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">User</th>
                        <th className="px-4 py-2 text-left">Credits</th>
                        <th className="px-4 py-2 text-left">Base Amount</th>
                        <th className="px-4 py-2 text-left">GST</th>
                        <th className="px-4 py-2 text-left">Total</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Payment ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {creditPurchases.map((purchase) => (
                        <tr key={purchase.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{purchase.user_name}</div>
                              <div className="text-xs text-muted-foreground">{purchase.user_email}</div>
                              <div className="text-xs text-muted-foreground">{purchase.user_mobile}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{purchase.credits_purchased}</td>
                          <td className="px-4 py-3">
                            ₹{purchase.base_amount?.toFixed(2) || purchase.amount_paid.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">₹{purchase.gst_amount?.toFixed(2) || "0.00"}</td>
                          <td className="px-4 py-3">₹{purchase.amount_paid.toFixed(2)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(purchase.purchase_date)}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                purchase.payment_status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : purchase.payment_status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {purchase.payment_status.charAt(0).toUpperCase() + purchase.payment_status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-mono text-xs break-all max-w-[200px]">
                              {purchase.razorpay_payment_id || "-"}
                            </div>
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
