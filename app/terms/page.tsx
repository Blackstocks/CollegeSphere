import { Header } from "@/components/header"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

          <div className="prose prose-sm sm:prose max-w-none">
            <p>
              By using CollegeSphere's college prediction services, you acknowledge and agree to the following terms:
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Data-Driven Insights, Not Guarantees</h2>
            <p>
              CollegeSphere provides data-driven predictions based on historical trends, particularly from JOSAA 2024
              counseling data. However, these predictions are for reference purposes only and do not guarantee admission
              to any college.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Based on General Category & JOSAA 2024 Trends</h2>
            <p>
              Predictions are made using past admission data from JOSAA 2024 counseling and are specifically based on
              the General category.
            </p>
            <p>Cutoff ranks may vary for different categories, quotas, and home-state preferences.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Factors Affecting Predictions</h2>
            <p>The actual admission process is influenced by several dynamic factors, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Changes in the total number of seats available in each college.</li>
              <li>The number of students appearing for JEE exams and participating in counseling.</li>
              <li>Modifications in government policies, reservation norms, or seat allocation rules.</li>
              <li>Individual college-specific criteria or special rounds introduced by JOSAA.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. No Legal Liability</h2>
            <p>
              While we strive to provide accurate and up-to-date insights, the predictions are only estimates and should
              not be considered final admission results. CollegeSphere is an informational platform and does not
              influence, control, or participate in the official admission process.
            </p>

            <p className="mt-4">By using this service, you acknowledge that:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>The predicted rank ranges and cutoffs may vary for the current year.</li>
              <li>
                CollegeSphere is not responsible for any admission-related decisions made based on these predictions.
              </li>
              <li>
                No legal claims, disputes, or liabilities will be entertained regarding the accuracy of predictions.
              </li>
            </ul>

            <p className="mt-4 font-medium">
              For the most accurate and official updates, always refer to the JOSAA official website or respective
              college admission portals.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
