"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { Search, Trash2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  exam_type: string | null
}

interface GroupedDepartments {
  [institute: string]: {
    institute_type: string
    state: string
    nirf: string | null
    departments: SavedDepartment[]
  }
}

export default function SavedCollegesPage() {
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
  const [collegeTypeFilter, setCollegeTypeFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

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
        throw new Error("Failed to fetch saved colleges")
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
      console.error("Error fetching saved colleges:", err)
      setError("Failed to load saved colleges")
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

  const getUniqueValues = (data: SavedDepartment[], key: keyof SavedDepartment) => {
    const values = new Set<string>()
    data.forEach((dept) => {
      if (dept[key]) values.add(dept[key] as string)
    })
    return Array.from(values).sort()
  }

  // Filter departments based on search query
  const filteredInstitutes = Object.entries(groupedDepartments).filter(([institute, data]) => {
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !(
          institute.toLowerCase().includes(query) ||
          data.departments.some(
            (dept) =>
              dept.department.toLowerCase().includes(query) ||
              data.institute_type.toLowerCase().includes(query) ||
              data.state.toLowerCase().includes(query),
          )
        )
      ) {
        return false
      }
    }

    // Apply college type filter
    if (collegeTypeFilter !== "all" && data.institute_type !== collegeTypeFilter) {
      return false
    }

    // Apply state filter
    if (stateFilter !== "all" && data.state !== stateFilter) {
      return false
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      return data.departments.some((dept) => dept.department === departmentFilter)
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Saved Colleges</h1>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="college-type-filter" className="text-sm font-medium block mb-1">
                College Type
              </label>
              <Select value={collegeTypeFilter} onValueChange={setCollegeTypeFilter}>
                <SelectTrigger id="college-type-filter">
                  <SelectValue placeholder="All College Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All College Types</SelectItem>
                  {getUniqueValues(savedDepartments, "institute_type").map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="state-filter" className="text-sm font-medium block mb-1">
                State
              </label>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger id="state-filter">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {getUniqueValues(savedDepartments, "state").map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="department-filter" className="text-sm font-medium block mb-1">
                Department
              </label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger id="department-filter">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {Array.from(new Set(savedDepartments.map((dept) => dept.department)))
                    .sort()
                    .map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
                  {searchQuery ? "No saved colleges match your search query" : "You haven't saved any colleges yet"}
                </p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/predict")}>
                  Go to Predictions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredInstitutes.map(([institute, data]) => (
                <Card key={institute} className="overflow-hidden mt-4">
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
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/college/${encodeURIComponent(institute)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          <span className="hidden sm:inline">View College</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        {expandedInstitutes[institute] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {expandedInstitutes[institute] && (
                    <>
                      {/* Desktop view - table format */}
                      <div className="hidden md:block overflow-x-auto">
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
                              <th className="px-4 py-2 text-left">Exam Type</th>
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
                                    <div>
                                      <Badge variant="outline">{dept.prediction_rank}</Badge>
                                      {dept.category_rank && (
                                        <div className="mt-1 text-xs text-gray-600">
                                          Category Rank: {dept.category_rank}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {dept.exam_type === "jee-advanced" ? "JEE Advanced" : "JEE Main"}
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

                      {/* Mobile view - card format */}
                      <div className="md:hidden">
                        {data.departments.map((dept, index) => (
                          <div
                            key={dept.id}
                            className={`p-3 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"} border-t`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{dept.department}</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {dept.quota === "HS" ? "Home State" : "All India"}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${dept.gender === "Female" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}`}
                                  >
                                    {dept.gender}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {dept.seat_type}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {dept.exam_type === "jee-advanced" ? "JEE Advanced" : "JEE Main"}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                onClick={() => handleDeleteDepartment(dept.id)}
                                disabled={isDeleting[dept.id]}
                              >
                                {isDeleting[dept.id] ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-gray-500 mb-1">Opening Rank</div>
                                <div className="font-medium">{dept.opening_rank}</div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-gray-500 mb-1">Closing Rank</div>
                                <div className="font-medium">{dept.closing_rank}</div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-gray-500 mb-1">Your Rank</div>
                                <div className="font-medium">
                                  {dept.prediction_rank ? (
                                    <div>
                                      <Badge variant="outline">{dept.prediction_rank}</Badge>
                                      {dept.category_rank && (
                                        <div className="mt-1 text-xs text-gray-600">
                                          Category Rank: {dept.category_rank}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    "N/A"
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
