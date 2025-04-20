"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"

interface CollegeCutoff {
  id: number
  institute: string
  department: string
  quota: string
  seat_type: string
  gender: string
  opening_rank: number
  closing_rank: number
  academic_year: number
  institute_type: string
  state: string
  NIRF: string
}

interface CollegeInfo {
  institute_type: string
  state: string
  NIRF: string | null
  departments: string[]
}

export default function CollegeDetailsPage({ params }: { params: { name: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [collegeData, setCollegeData] = useState<CollegeCutoff[]>([])
  const [collegeInfo, setCollegeInfo] = useState<CollegeInfo | null>(null)
  const [creditDeducted, setCreditDeducted] = useState(false)

  const collegeName = decodeURIComponent(params.name)

  // Group data by department and seat_type for better organization
  const groupedBySeatType = collegeData.reduce(
    (acc, item) => {
      // Create a key for each seat type
      const key = item.seat_type
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    },
    {} as Record<string, CollegeCutoff[]>,
  )

  // Get unique departments
  const departments = collegeData.length > 0 ? [...new Set(collegeData.map((item) => item.department))].sort() : []

  // Get unique seat types
  const seatTypes = Object.keys(groupedBySeatType).sort()

  useEffect(() => {
    async function fetchCollegeDetails() {
      if (!collegeName || !user) {
        router.push("/dashboard")
        return
      }

      setIsLoading(true)
      setError("")

      try {
        // Check if user has enough credits
        if (user.credits < 10) {
          setError("You don't have enough credits to view college details")
          setIsLoading(false)
          router.push("/dashboard")
          return
        }

        // Fetch all cutoffs for this institute
        const { data, error } = await supabase
          .from("college_cutoffs")
          .select("*")
          .eq("institute", collegeName)
          .eq("academic_year", 2024)

        if (error) throw error

        if (data && data.length > 0) {
          setCollegeData(data)

          // Extract college info
          const uniqueDepartments = [...new Set(data.map((item) => item.department))].sort()
          setCollegeInfo({
            institute_type: data[0].institute_type,
            state: data[0].state,
            NIRF: data[0].NIRF,
            departments: uniqueDepartments,
          })

          // Deduct credits if not already done for this session
          if (!creditDeducted) {
            const { error: updateError } = await supabase
              .from("users")
              .update({ credits: user.credits - 10 })
              .eq("id", user.id)

            if (updateError) throw updateError

            setCreditDeducted(true)

            // Update local user state
            if (user) {
              user.credits -= 10
            }
          }
        } else {
          setError("No data available for this college")
        }
      } catch (err) {
        // Error fetching college details
        setError("Failed to fetch college details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollegeDetails()
  }, [collegeName, user, creditDeducted, router])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container w-full sm:w-[90%] mx-auto max-w-full sm:max-w-[90vw] px-2">
          <Button variant="outline" className="mb-4" onClick={() => router.back()}>
            ← Back to Results
          </Button>

          <h1 className="text-2xl font-bold mb-4">{collegeName}</h1>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-4 text-destructive gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          ) : (
            <Tabs defaultValue="college-info" className="w-full">
              <TabsList className="flex flex-wrap h-auto mb-4 gap-1">
                <TabsTrigger value="college-info" className="flex-1 min-w-[120px] text-xs sm:text-sm py-2 h-auto">
                  College Info
                </TabsTrigger>
                <TabsTrigger value="cutoffs" className="flex-1 min-w-[120px] text-xs sm:text-sm py-2 h-auto">
                  Cutoffs
                </TabsTrigger>
                <TabsTrigger value="departments" className="flex-1 min-w-[120px] text-xs sm:text-sm py-2 h-auto">
                  Departments
                </TabsTrigger>
                <TabsTrigger value="placements" className="flex-1 min-w-[120px] text-xs sm:text-sm py-2 h-auto">
                  Placements
                </TabsTrigger>
              </TabsList>

              {/* College Info Tab */}
              <TabsContent value="college-info">
                <Card>
                  <CardHeader>
                    <CardTitle>College Information</CardTitle>
                    <CardDescription>Basic details about {collegeName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {collegeInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm text-muted-foreground">Institute Type</h3>
                          <p>{collegeInfo.institute_type}</p>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm text-muted-foreground">State</h3>
                          <p>{collegeInfo.state}</p>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm text-muted-foreground">NIRF Ranking</h3>
                          <p>{collegeInfo.NIRF || "Not Available"}</p>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm text-muted-foreground">Total Departments</h3>
                          <p>{collegeInfo.departments.length}</p>
                        </div>
                      </div>
                    ) : (
                      <p>No information available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Cutoffs Tab */}
              <TabsContent value="cutoffs">
                <Card>
                  <CardHeader>
                    <CardTitle>Cutoff Details</CardTitle>
                    <CardDescription>Cutoff ranks by category and gender</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {seatTypes.length > 0 ? (
                      <Tabs defaultValue={seatTypes[0]} className="w-full">
                        <TabsList className="flex flex-wrap h-auto mb-4 gap-1">
                          {seatTypes.map((seatType) => (
                            <TabsTrigger
                              key={seatType}
                              value={seatType}
                              className="flex-1 min-w-[100px] text-xs md:text-sm whitespace-normal text-left h-auto py-2"
                            >
                              {seatType}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {seatTypes.map((seatType) => (
                          <TabsContent key={seatType} value={seatType} className="border rounded-lg p-0">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-muted">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs md:text-sm">Department</th>
                                    <th className="px-3 py-2 text-left text-xs md:text-sm">Quota</th>
                                    <th className="px-3 py-2 text-left text-xs md:text-sm">Gender</th>
                                    <th className="px-3 py-2 text-left text-xs md:text-sm">Opening</th>
                                    <th className="px-3 py-2 text-left text-xs md:text-sm">Closing</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {groupedBySeatType[seatType]
                                    .sort((a, b) => {
                                      // First sort by department
                                      if (a.department !== b.department) {
                                        return a.department.localeCompare(b.department)
                                      }
                                      // Then by quota
                                      if (a.quota !== b.quota) {
                                        return a.quota.localeCompare(b.quota)
                                      }
                                      // Then by gender
                                      return a.gender.localeCompare(b.gender)
                                    })
                                    .map((item, index) => (
                                      <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                        <td className="px-1 sm:px-3 py-1 sm:py-2 text-xs md:text-sm">
                                          {item.department}
                                        </td>
                                        <td className="px-1 sm:px-3 py-1 sm:py-2 text-xs md:text-sm">
                                          {item.quota === "HS" ? "Home State" : "All India"}
                                        </td>
                                        <td className="px-1 sm:px-3 py-1 sm:py-2 text-xs md:text-sm">{item.gender}</td>
                                        <td className="px-1 sm:px-3 py-1 sm:py-2 text-xs md:text-sm">
                                          {item.opening_rank}
                                        </td>
                                        <td className="px-1 sm:px-3 py-1 sm:py-2 text-xs md:text-sm">
                                          {item.closing_rank}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      <p>No cutoff data available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments">
                <Card>
                  <CardHeader>
                    <CardTitle>Departments</CardTitle>
                    <CardDescription>All departments offered by {collegeName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {departments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {departments.map((dept, index) => (
                          <div key={index} className="flex items-center p-2 border rounded-md">
                            <Badge variant="outline" className="mr-2">
                              {index + 1}
                            </Badge>
                            <span>{dept}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No department data available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Placements Tab */}
              <TabsContent value="placements">
                <Card>
                  <CardHeader>
                    <CardTitle>Placement Statistics</CardTitle>
                    <CardDescription>Placement data for {collegeName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground mb-2">Placement statistics will be available soon</p>
                      <p className="text-sm">We're currently collecting placement data for this college</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}
