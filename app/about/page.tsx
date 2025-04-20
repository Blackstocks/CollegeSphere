import { Header } from "@/components/header"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About CollegeSphere</h1>
          <div className="prose prose-sm sm:prose max-w-none">
            <p>
              CollegeSphere simplifies JEE Main college selection with AI-powered predictions and real-time cutoff data
              to help you find your perfect engineering college match.
            </p>
            <p>
              Our mission is to empower students with the information and guidance they need to make informed decisions
              about their future.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-3">Our Services</h2>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>AI-Powered College Predictions</li>
              <li>Real-time Cutoff Data</li>
              <li>Personalized Mentorship</li>
            </ul>
            <p>
              We are a team of IIT alumni dedicated to helping students navigate the complex world of college
              admissions.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
