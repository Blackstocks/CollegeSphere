"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { CollegeTabs } from "@/components/college-tabs"
import { BookingConfirmationModal } from "@/components/booking-confirmation-modal"
import { supabase } from "@/lib/supabase/client"
// Import the CollegeDetailsModal component
import { CollegeDetailsModal } from "@/components/college-details-modal"
import { Footer } from "@/components/footer"

// Define the college data structure
interface ExploreCollege {
  id: number
  created_at: string
  State: string // Note: Capital 'S' as in database
  Type: string // Note: Capital 'T' as in database
  college_name: string
  nirf_rank: number
}

// Group colleges by type
interface GroupedColleges {
  [key: string]: ExploreCollege[]
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [collegeData, setCollegeData] = useState<GroupedColleges>({})
  const [isLoadingColleges, setIsLoadingColleges] = useState(true)
  const [collegeError, setCollegeError] = useState("")

  // Add state variables and handler for college details modal
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleViewCollegeDetails = async (collegeName: string) => {
    if (user && user.credits >= 10) {
      setSelectedCollege(collegeName)
    } else {
      setError("You need at least 10 credits to view detailed college information")
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Fetch college data from the explore_college table
  useEffect(() => {
    async function fetchCollegeData() {
      try {
        setIsLoadingColleges(true)
        setCollegeError("")

        const { data, error } = await supabase
          .from("explore_college")
          .select("*")
          .order("nirf_rank", { ascending: true, nullsLast: true })

        if (error) {
          // Error fetching college data
          setCollegeError("Failed to load college data. Please try again later.")
          return
        }

        // Group colleges by type
        const grouped: GroupedColleges = {}
        if (data) {
          data.forEach((college: ExploreCollege) => {
            const type = college.Type // Use exact column name with capital 'T'
            if (!grouped[type]) {
              grouped[type] = []
            }
            grouped[type].push(college)
          })
        }

        setCollegeData(grouped)
      } catch (error) {
        // Error in fetchCollegeData
        setCollegeError("An unexpected error occurred. Please try again later.")
      } finally {
        setIsLoadingColleges(false)
      }
    }

    fetchCollegeData()
  }, [])

  const handleBookSession = () => {
    if (user.credits < 500) {
      return
    }
    setShowBookingModal(true)
  }

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto w-full max-w-full sm:max-w-[90vw]">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">Explore colleges and make predictions based on your JEE Main rank</p>
          </div>

          <div className="mb-6 md:mb-8 flex flex-col md:flex-row gap-4 md:gap-6">
            {/* College Prediction Card - adjust for better responsiveness */}
            <div className="w-full md:w-[65%]">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-900 h-full sm:shadow sm:border sm:rounded-lg sm:p-4 card-small-screen">
                <CardHeader>
                  <CardTitle className="text-blue-800 dark:text-blue-300">College Prediction</CardTitle>
                  <CardDescription>Find colleges based on your JEE Main rank</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Our prediction tool uses the latest JoSAA cutoff data to help you find colleges where you have a
                    good chance of admission.
                  </p>
                  <p>
                    You have <span className="font-bold text-blue-700 dark:text-blue-300">{user.credits}</span> credits
                    remaining. Each prediction costs 10 credits.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => router.push("/predict")}
                    disabled={user.credits < 10}
                  >
                    Make a Prediction
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* One-to-One Session Card - adjust for better responsiveness */}
            <div className="w-full md:w-[35%]">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-100 dark:border-purple-900 h-full sm:shadow sm:border sm:rounded-lg sm:p-4 card-small-screen">
                <CardHeader>
                  <CardTitle className="text-purple-800 dark:text-purple-300">One-to-One Session</CardTitle>
                  <CardDescription>Personal guidance from top IIT students</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Book a 30-45 minute personal session with current IIT students who have secured an average package
                    of 50 LPA from top IITs.
                  </p>
                  <p>
                    Each session costs{" "}
                    <span className="font-bold text-purple-700 dark:text-purple-300">500 credits</span>. Get
                    personalized advice for JEE preparation and college selection.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleBookSession}
                    disabled={user.credits < 500}
                  >
                    Book a Session
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* College List and Tabs - adjust for better responsiveness */}
          <div className="mb-6">
            <div className="mb-2">
              <h2 className="text-2xl font-bold">Explore Colleges</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Browse through the top 100 colleges in NIRF ranking according to 2024 in engineering categories. Click on
              any college name to view detailed information including cutoffs, departments, and more.
            </p>

            {isLoadingColleges ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : collegeError ? (
              <Card className="sm:shadow sm:border sm:rounded-lg sm:p-4 card-small-screen">
                <CardContent className="py-8 text-center">
                  <p className="text-red-500">{collegeError}</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* College Tabs */}
                <CollegeTabs
                  collegeData={collegeData}
                  onCollegeClick={(collegeName) => {
                    if (user && user.credits >= 10) {
                      handleViewCollegeDetails(collegeName)
                    } else {
                      setError("You need at least 10 credits to view detailed college information")
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md z-50">
            <p>{error}</p>
            <button className="absolute top-0 right-0 mt-1 mr-2 text-red-700" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}
      </main>
      <Footer />
      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        userId={user.id}
        userCredits={user.credits}
      />
      {/* College Details Modal */}
      <CollegeDetailsModal
        collegeName={selectedCollege}
        onClose={() => setSelectedCollege(null)}
        onCreditDeduction={() => {
          if (user) {
            user.credits -= 10
          }
        }}
      />
    </div>
  )
}
