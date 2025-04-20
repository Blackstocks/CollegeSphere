"use client"

import { Header } from "@/components/header"
import { RazorpayTester } from "@/components/razorpay-tester"
import { DirectKeyTester } from "@/components/direct-key-tester"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicRazorpayTest } from "@/components/basic-razorpay-test"
import { SimpleOrderTest } from "@/components/simple-order-test"

export default function RazorpayTestPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Razorpay Integration Test</h1>
          <p className="mb-6 text-muted-foreground">This page helps diagnose issues with the Razorpay integration.</p>

          <Tabs defaultValue="basic-test">
            <TabsList className="mb-4">
              <TabsTrigger value="basic-test">Basic Test</TabsTrigger>
              <TabsTrigger value="order-test">Order Test</TabsTrigger>
              <TabsTrigger value="key-tester">New Key Tester</TabsTrigger>
              <TabsTrigger value="script-tester">Script Tester</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-test">
              <BasicRazorpayTest />
            </TabsContent>

            <TabsContent value="order-test">
              <SimpleOrderTest />
            </TabsContent>

            <TabsContent value="key-tester">
              <DirectKeyTester />
            </TabsContent>

            <TabsContent value="script-tester">
              <RazorpayTester />
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h2 className="font-semibold text-amber-800 mb-2">Troubleshooting Tips</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700">
              <li>Make sure you're using the correct Razorpay API keys</li>
              <li>Check if there are any Content Security Policy (CSP) restrictions</li>
              <li>Verify that the Razorpay script is not being blocked by browser extensions</li>
              <li>Try using a different browser to rule out browser-specific issues</li>
              <li>Ensure your Razorpay account is active and properly configured</li>
              <li>Check if you're testing on HTTPS, as Razorpay may require a secure connection</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
