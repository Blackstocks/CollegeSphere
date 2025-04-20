"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SimpleOrderTest() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
    setLogs((prev) => [...prev, `${timestamp}: ${message}`])
    console.log(`SimpleOrderTest: ${message}`)
  }

  const testCreateOrder = async () => {
    setIsLoading(true)
    addLog("Starting order creation test")

    try {
      // Make a simple request to create an order
      addLog("Calling create-order API")
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 100,
          credits: 100,
          userId: "test-user-id",
          userName: "Test User",
          userEmail: "test@example.com",
          userMobile: "9999999999",
        }),
      })

      addLog(`API response status: ${response.status}`)

      // Try to read the response
      try {
        const responseText = await response.text()
        addLog(`API response text: ${responseText}`)

        try {
          // Try to parse as JSON
          const responseData = JSON.parse(responseText)
          addLog(`API response parsed: ${JSON.stringify(responseData)}`)

          if (responseData.success) {
            addLog(`✅ Order created successfully! Order ID: ${responseData.orderId}`)
          } else {
            addLog(`❌ Order creation failed: ${responseData.error}`)
          }
        } catch (jsonError) {
          addLog(`Failed to parse response as JSON: ${String(jsonError)}`)
        }
      } catch (textError) {
        addLog(`Failed to read response text: ${String(textError)}`)
      }
    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Simple Order Creation Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            This test simply tries to create a Razorpay order through our API, without opening the payment modal.
          </p>

          <Button onClick={testCreateOrder} disabled={isLoading} className="w-full">
            {isLoading ? "Testing..." : "Test Create Order"}
          </Button>

          <div className="h-64 overflow-auto p-2 bg-gray-100 rounded text-xs font-mono">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet.</div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={log.includes("❌") ? "text-red-500" : log.includes("✅") ? "text-green-500" : ""}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
