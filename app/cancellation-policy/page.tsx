import { Header } from "@/components/header"

export default function CancellationPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cancellation & Refund Policy</h1>

          <div className="prose prose-sm sm:prose max-w-none">
            <p>
              At CollegeSphere, we want to ensure transparency in our service offerings. Please read our cancellation
              and refund policy carefully before making any purchases.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">No Cancellation Policy</h2>
            <p>
              Due to the instant digital nature of our services, all purchases made on CollegeSphere are final and
              cannot be cancelled once processed. This includes credit purchases, college predictions, and one-to-one
              counseling sessions.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">No Refund Policy</h2>
            <p>
              We do not offer refunds for any purchases made on our platform. Once credits are purchased or services are
              rendered, no refunds will be provided under any circumstances.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Rationale for Our Policy</h2>
            <p>Our no-cancellation and no-refund policy exists for the following reasons:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Our digital services are delivered instantly upon purchase.</li>
              <li>College predictions and counseling sessions involve immediate allocation of resources.</li>
              <li>Credits are non-transferable and tied to your specific account.</li>
              <li>
                The information provided through our services is proprietary and cannot be "returned" once accessed.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">Exceptions</h2>
            <p>
              In the rare case of a technical error where a service was charged but not delivered (e.g., credits
              deducted but prediction not generated), please contact our support team at collegesphere25@gmail.com
              within 24 hours of the transaction with proof of the error.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">One-to-One Counseling Sessions</h2>
            <p>For scheduled one-to-one counseling sessions:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Once booked, sessions cannot be cancelled or refunded.</li>
              <li>Rescheduling may be possible with at least 24 hours notice, subject to counselor availability.</li>
              <li>No-shows will forfeit the session with no option for rescheduling or refund.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p>
              If you have any questions about our cancellation and refund policy, please contact us at
              collegesphere25@gmail.com.
            </p>

            <p className="mt-6 text-sm text-gray-600">Last Updated: March 17, 2025</p>
          </div>
        </div>
      </main>
    </div>
  )
}
