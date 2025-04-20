import { Header } from "@/components/header"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <div className="prose prose-sm sm:prose max-w-none">
            <p>
              At CollegeSphere, we value your privacy and are committed to protecting your personal information. This
              Privacy Policy outlines how we collect, use, store, and protect your data when you use our services.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <p>When you use CollegeSphere, we may collect the following types of information:</p>

            <h3 className="text-lg font-medium mt-4 mb-2">A. Personal Information</h3>
            <p>Name, email address, phone number (when provided during account registration or inquiries).</p>
            <p>Academic details such as JEE rank, category, and preferences (to generate personalized predictions).</p>

            <h3 className="text-lg font-medium mt-4 mb-2">B. Usage Data & Analytics</h3>
            <p>Your interactions with our platform, including searches, visited pages, and session duration.</p>
            <p>
              Device information such as IP address, browser type, and operating system for security and analytics
              purposes.
            </p>

            <h3 className="text-lg font-medium mt-4 mb-2">C. Payment Information</h3>
            <p>
              If you purchase premium services, payment details are processed securely through third-party payment
              gateways (e.g., Cashfree). We do not store credit/debit card details.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <p>
              We collect data to improve your experience and provide personalized insights. Your information may be used
              for:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>College Predictions</strong> – Generating AI-driven college suggestions based on JEE counseling
                data.
              </li>
              <li>
                <strong>User Experience</strong> – Customizing your dashboard, saving preferences, and offering relevant
                recommendations.
              </li>
              <li>
                <strong>Communication</strong> – Sending updates, newsletters, or responding to inquiries.
              </li>
              <li>
                <strong>Analytics & Security</strong> – Monitoring site performance, detecting fraudulent activity, and
                ensuring a safe user environment.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Protection & Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data from unauthorized access,
              alteration, or disclosure. However, no method of online transmission is 100% secure, and we cannot
              guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Sharing & Third-Party Services</h2>
            <p>
              We do not sell or share your personal data with third parties for marketing purposes. However, we may
              share data in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>With Trusted Partners</strong> – Third-party service providers (e.g., payment gateways,
                analytics tools) to facilitate payments and platform improvements.
              </li>
              <li>
                <strong>Legal Compliance</strong> – If required by law, we may disclose data to regulatory authorities.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Cookies & Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance your browsing experience. You can manage or disable
              cookies through your browser settings.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights & Control Over Your Data</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Request access to your personal data.</li>
              <li>Update or correct any inaccuracies in your information.</li>
              <li>Request data deletion (subject to legal and operational requirements).</li>
            </ul>
            <p>To exercise your rights, contact us at collegesphere25@gmail.com.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Updates to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be notified on our website, and continued use
              of our services implies acceptance of these updates.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
