"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { AlertCircle, CheckCircle, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PaymentOrder {
  id: string
  user_id: string
  user_name: string
  user_email: string
  user_mobile: string
  credits: number
  amount: number
  transaction_id: string
  status: "pending" | "completed" | "failed"
  created_at: string
  updated_at: string
  notes?: string
}

export default function AdminPaymentOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([])
  const [error, setError] = useState("")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

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

    fetchPaymentOrders()
  }, [user, router])

  const fetchPaymentOrders = async () => {
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase
        .from("payment_orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setPaymentOrders(data || [])
    } catch (err) {
      console.error("Error fetching payment orders:", err)
      setError("Failed to load payment orders")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProcessPayment = async (order: PaymentOrder) => {
    setProcessingId(order.id)
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
          userId: order.user_id,
          credits: order.credits,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update credits")
      }

      // Update the payment order status
      const { error: updateError } = await supabase
        .from("payment_orders")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", order.id)

      if (updateError) throw updateError

      setSuccessMessage(`Successfully added ${order.credits} credits to ${order.user_name}`)

      // Refresh the list
      fetchPaymentOrders()
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

  // Filter payment orders based on search query
  const filteredOrders = paymentOrders.filter((order) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      order.user_name.toLowerCase().includes(query) ||
      order.user_email.toLowerCase().includes(query) ||
      order.user_mobile.includes(query) ||
      order.transaction_id.toLowerCase().includes(query)
    )
  })

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
            <h1 className="text-2xl font-bold">Payment Orders Management</h1>
            <Button onClick={fetchPaymentOrders} variant="outline" size="sm" className="flex items-center gap-2">
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

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, mobile or transaction ID"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No matching payment orders found" : "No payment orders found"}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">User</th>
                        <th className="px-4 py-2 text-left">Transaction ID</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Credits</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{order.user_name}</div>
                              <div className="text-xs text-muted-foreground">{order.user_email}</div>
                              <div className="text-xs text-muted-foreground">{order.user_mobile}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-mono text-xs break-all max-w-[200px]">{order.transaction_id}</div>
                          </td>
                          <td className="px-4 py-3">₹{order.amount}</td>
                          <td className="px-4 py-3">{order.credits}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(order.created_at)}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {order.status === "pending" ? (
                              <Button
                                size="sm"
                                onClick={() => handleProcessPayment(order)}
                                disabled={processingId === order.id}
                              >
                                {processingId === order.id ? "Processing..." : "Add Credits"}
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                {order.status === "completed" ? "Completed" : "Failed"}
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
