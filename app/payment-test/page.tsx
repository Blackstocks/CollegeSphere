import { Header } from "@/components/header"
import { SuperSimplePayment } from "@/components/super-simple-payment"

export default function PaymentTestPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Payment Test</h1>
          <SuperSimplePayment />

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h2 className="font-semibold mb-2">Troubleshooting Tips</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Make sure you're connected to the internet</li>
              <li>Try using a different browser (Chrome or Firefox recommended)</li>
              <li>Disable any ad blockers or browser extensions</li>
              <li>Ensure you're using HTTPS (Razorpay requires a secure connection)</li>
              <li>If on mobile, try using the desktop site option</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
