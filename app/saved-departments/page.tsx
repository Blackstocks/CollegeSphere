"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { Search, Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface SavedDepartment {
  id: string
  institute: string
  department: string
  institute_type: string
  state: string
  nirf: string | null
  quota: string
  gender: string
  seat_type: string
  opening_rank: number
  closing_rank: number
  prediction_rank: number | null
  prediction_percentile: number | null
  category_rank: number | null
  created_at: string
}

interface GroupedDepartments {
  [institute: string]: {
    institute_type: string
    state: string
    nirf: string | null
    departments: SavedDepartment[]
  }
}

export default function SavedDepartmentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [savedDepartments, setSavedDepartments] = useState<SavedDepartment[]>([])
  const [groupedDepartments, setGroupedDepartments] = useState<GroupedDepartments>({})
  const [expandedInstitutes, setExpandedInstitutes] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchSavedDepartments()
    }
  }, [user, loading, router])

  const fetchSavedDepartments = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/saved-departments?user_id=${user?.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch saved departments")
      }

      const data: SavedDepartment[] = await response.json()
      setSavedDepartments(data)

      // Group departments by institute
      const grouped: GroupedDepartments = {}
      data.forEach((dept) => {
        if (!grouped[dept.institute]) {
          grouped[dept.institute] = {
            institute_type: dept.institute_type,
            state: dept.state,
            nirf: dept.nirf,
            departments: [],
          }
        }
        grouped[dept.institute].departments.push(dept)
      })

      setGroupedDepartments(grouped)

      // Expand all institutes by default
      const expanded: Record<string, boolean> = {}
      Object.keys(grouped).forEach((institute) => {
        expanded[institute] = true
      })
      setExpandedInstitutes(expanded)
    } catch (err) {
      console.error("Error fetching saved departments:", err)
      setError("Failed to load saved departments")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDepartment = async (id: string) => {
    if (!user) return

    setIsDeleting((prev) => ({ ...prev, [id]: true }))
    setError("")
    setSuccessMessage("")

    try {
      const response = await fetch(`/api/save-department?id=${id}&user_id=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete department")
      }

      // Remove the deleted department from state
      setSavedDepartments((prev) => prev.filter((dept) => dept.id !== id))

      // Update grouped departments
      const newGrouped = { ...groupedDepartments }
      Object.keys(newGrouped).forEach((institute) => {
        newGrouped[institute].departments = newGrouped[institute].departments.filter((dept) => dept.id !== id)
        if (newGrouped[institute].departments.length === 0) {
          delete newGrouped[institute]
        }
      })
      setGroupedDepartments(newGrouped)

      setSuccessMessage("Department removed successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error deleting department:", err)
      setError("Failed to delete department")
      setTimeout(() => setError(""), 3000)
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }))
    }
  }

  const toggleInstituteExpand = (institute: string) => {
    setExpandedInstitutes((prev) => ({
      ...prev,
      [institute]: !prev[institute],
    }))
  }

  // Filter departments based on search query
  const filteredInstitutes = Object.entries(groupedDepartments).filter(([institute, data]) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()

    // Check if institute name matches
    if (institute.toLowerCase().includes(query)) return true

    // Check if any department matches
    return data.departments.some(
      (dept) =>
        dept.department.toLowerCase().includes(query) ||
        dept.institute_type.toLowerCase().includes(query) ||
        dept.state.toLowerCase().includes(query),
    )
  })

  if (loading) {
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
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Saved Departments</h1>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by college or department name"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
              <p>{successMessage}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredInstitutes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No saved departments match your search query"
                    : "You haven't saved any departments yet"}
                </p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/predict")}>
                  Go to Predictions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredInstitutes.map(([institute, data]) => (
                <Card key={institute} className="overflow-hidden">
                  <div
                    className="p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors flex justify-between items-center"
                    onClick={() => toggleInstituteExpand(institute)}
                  >
                    <div>
                      <h3 className="font-bold text-lg">{institute}</h3>
                      <div className="flex flex-wrap gap-x-6 text-sm text-muted-foreground mt-1">
                        <span>Type: {data.institute_type}</span>
                        <span>State: {data.state}</span>
                        <span>NIRF Rank: {data.nirf || "N/A"}</span>
                        <span>Saved Departments: {data.departments.length}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2">
                      {expandedInstitutes[institute] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  {expandedInstitutes[institute] && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-2 text-left">Department</th>
                            <th className="px-4 py-2 text-left">Quota</th>
                            <th className="px-4 py-2 text-left">Gender</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">Opening Rank</th>
                            <th className="px-4 py-2 text-left">Closing Rank</th>
                            <th className="px-4 py-2 text-left">Your Rank</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.departments.map((dept, index) => (
                            <tr key={dept.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                              <td className="px-4 py-2">{dept.department}</td>
                              <td className="px-4 py-2">{dept.quota === "HS" ? "Home State" : "All India"}</td>
                              <td className="px-4 py-2">
                                <span className={dept.gender === "Female" ? "text-purple-600 font-medium" : ""}>
                                  {dept.gender}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                {dept.gender === "Female" ? `${dept.seat_type} (Female)` : dept.seat_type}
                              </td>
                              <td className="px-4 py-2">{dept.opening_rank}</td>
                              <td className="px-4 py-2">{dept.closing_rank}</td>
                              <td className="px-4 py-2">
                                {dept.prediction_rank ? (
                                  <Badge
                                    className={
                                      dept.prediction_rank <= dept.opening_rank
                                        ? "bg-green-100 text-green-800"
                                        : dept.prediction_rank <= dept.closing_rank
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {dept.prediction_rank}
                                  </Badge>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteDepartment(dept.id)}
                                  disabled={isDeleting[dept.id]}
                                >
                                  {isDeleting[dept.id] ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
