"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { getSupabaseClient } from "@/lib/supabase/client"
import { calculateRankFromPercentile } from "@/lib/utils/calculate-rank"
import type { Gender, IndianState, ExamType } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { CollegeFilterUI } from "@/components/college-filter-ui"
import { MobileFilterDrawer } from "@/components/mobile-filter-drawer"
import { RefreshCw, Search, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CollegeDetailsModal } from "@/components/college-details-modal"

interface CollegePrediction {
  institute: string
  department: string
  opening_rank: number
  closing_rank: number
  institute_type: string
  state: string
  NIRF: string
  quota: string
  gender: string
  seat_type: string
}

interface GroupedCollege {
  institute: string
  institute_type: string
  state: string
  NIRF: string | null
  departments: {
    department: string
    opening_rank: number
    closing_rank: number
    quota: string
    gender: string
    seat_type: string
  }[]
}

export default function PredictPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [scoreType, setScoreType] = useState<"percentile" | "rank">("rank")
  const [percentileOrRank, setPercentileOrRank] = useState("")
  const [gender, setGender] = useState<Gender>("gender-neutral")
  const [homeState, setHomeState] = useState<IndianState>("Delhi")
  const [category, setCategory] = useState<string>("General")
  const [isPWD, setIsPWD] = useState<boolean>(false)
  const [error, setError] = useState("")
  const [isPredicting, setIsPredicting] = useState(false)
  const [colleges, setColleges] = useState<GroupedCollege[]>([])
  const [hasResults, setHasResults] = useState(false)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [parsedCategoryRank, setParsedCategoryRank] = useState<number | null>(null)
  const [expandedColleges, setExpandedColleges] = useState<Record<string, boolean>>({})
  const [categoryRank, setCategoryRank] = useState("")
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [animatedRank, setAnimatedRank] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredColleges, setFilteredColleges] = useState<GroupedCollege[]>([])
  const [filters, setFilters] = useState({
    degree: new Set<string>(),
    branch: new Set<string>(),
    duration: new Set<string>(),
    college: new Set<string>(),
    collegeType: new Set<string>(),
  })

  const [initialCollegesLoaded, setInitialCollegesLoaded] = useState(false)
  const [hasCheckedUser, setHasCheckedUser] = useState(false)
  const [hasSetHomeState, setHasSetHomeState] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [examType, setExamType] = useState<ExamType>("jee-main")

  // First, let's add a new state to track which departments are being saved and which are already saved
  // Add these state variables near the other state declarations (around line 60-70)

  const [savedDepartments, setSavedDepartments] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({})
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null)

  const indianStates: IndianState[] = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ]

  const filterColleges = useCallback(() => {
    if (!colleges.length) {
      setFilteredColleges([])
      return
    }

    let result = [...colleges]

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((college) => {
        // Search in college name
        if (college.institute.toLowerCase().includes(query)) return true

        // Search in departments
        return college.departments.some((dept) => dept.department.toLowerCase().includes(query))
      })
    }

    // Apply filters
    if (filters.collegeType.size > 0) {
      result = result.filter((college) => filters.collegeType.has(college.institute_type))
    }

    if (filters.college.size > 0) {
      result = result.filter((college) => filters.college.has(college.institute))
    }

    // For branch filter, we need to filter departments within colleges
    if (filters.branch.size > 0) {
      result = result
        .map((college) => ({
          ...college,
          departments: college.departments.filter((dept) => filters.branch.has(dept.department)),
        }))
        .filter((college) => college.departments.length > 0)
    }

    // Apply degree filter
    if (filters.degree.size > 0) {
      result = result
        .map((college) => ({
          ...college,
          departments: college.departments.filter((dept) => {
            const match = dept.department.match(/^([A-Za-z.]+)/)
            const degree = match ? match[0].trim() : ""
            return filters.degree.has(degree)
          }),
        }))
        .filter((college) => college.departments.length > 0)
    }

    // Apply duration filter
    if (filters.duration.size > 0) {
      result = result
        .map((college) => ({
          ...college,
          departments: college.departments.filter((dept) => {
            const match = dept.department.match(/(\d+)\s*Years?$/i)
            const duration = match ? `${match[1]} Years` : ""
            return filters.duration.has(duration)
          }),
        }))
        .filter((college) => college.departments.length > 0)
    }

    setFilteredColleges(result)
  }, [colleges, searchQuery, filters])

  useEffect(() => {
    filterColleges()
  }, [colleges, filterColleges])

  // Function to group colleges by institute and sort by NIRF
  const groupAndSortColleges = (collegeData: CollegePrediction[]): GroupedCollege[] => {
    // Group by institute
    const groupedByInstitute: Record<string, GroupedCollege> = {}

    collegeData.forEach((college) => {
      if (!groupedByInstitute[college.institute]) {
        groupedByInstitute[college.institute] = {
          institute: college.institute,
          institute_type: college.institute_type,
          state: college.state,
          NIRF: college.NIRF,
          departments: [],
        }
      }

      groupedByInstitute[college.institute].departments.push({
        department: college.department,
        opening_rank: college.opening_rank,
        closing_rank: college.closing_rank,
        quota: college.quota,
        gender: college.gender,
        seat_type: college.seat_type,
      })
    })

    // Convert to array and sort by NIRF
    const result = Object.values(groupedByInstitute)

    // Sort departments within each institute alphabetically by department name
    result.forEach((institute) => {
      institute.departments.sort((a, b) => {
        // First sort by department name
        const deptCompare = a.department.localeCompare(b.department)
        if (deptCompare !== 0) return deptCompare

        // Then by gender (Female first)
        if (a.gender !== b.gender) {
          return a.gender === "Female" ? -1 : 1
        }

        // Then by quota (HS first)
        return a.quota === "HS" ? -1 : 1
      })
    })

    // Sort institutes by NIRF (N/A at the end)
    return result.sort((a, b) => {
      // Handle N/A values
      if (!a.NIRF && !b.NIRF) return 0
      if (!a.NIRF) return 1
      if (!b.NIRF) return -1

      // Convert NIRF to number and sort (lower is better)
      const nirfA = Number.parseInt(a.NIRF)
      const nirfB = Number.parseInt(b.NIRF)

      if (isNaN(nirfA) && isNaN(nirfB)) return 0
      if (isNaN(nirfA)) return 1
      if (isNaN(nirfB)) return -1

      return nirfA - nirfB
    })
  }

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setHasResults(false)
    setColleges([])
    setShowSkeleton(true)
    setAnimationComplete(false)

    if (!user) {
      router.push("/login")
      return
    }

    if (user.credits < 10) {
      setError("You need at least 10 credits to make a prediction")
      setShowSkeleton(false)
      return
    }

    // Validate inputs
    if (!percentileOrRank) {
      setError("Please enter your rank")
      setShowSkeleton(false)
      return
    }

    // Calculate rank if percentile is provided
    let rank: number
    if (scoreType === "percentile") {
      // Validate percentile format
      const percentileValue = percentileOrRank.trim()
      if (!/^\d+(\.\d+)?$/.test(percentileValue)) {
        setError("Percentile must be a valid number with proper decimal format")
        setShowSkeleton(false)
        return
      }

      const percentile = Number.parseFloat(percentileValue)
      if (isNaN(percentile) || percentile < 0 || percentile > 100) {
        setError("Percentile must be between 0 and 100")
        setShowSkeleton(false)
        return
      }
      rank = calculateRankFromPercentile(percentile)
    } else {
      // Validate rank format
      const rankValue = percentileOrRank.trim()
      if (!/^\d+$/.test(rankValue)) {
        setError("Rank must be a valid whole number")
        setShowSkeleton(false)
        return
      }

      rank = Number.parseInt(rankValue)
      if (isNaN(rank) || rank < 1 || rank > 1300000) {
        setError("Rank must be between 1 and 1,300,000")
        setShowSkeleton(false)
        return
      }
    }

    // Validate category rank if provided
    let catRank: number | null = null
    if ((category !== "General" || isPWD) && categoryRank) {
      const catRankValue = categoryRank.trim()
      if (!/^\d+$/.test(catRankValue)) {
        setError("Category rank must be a valid whole number")
        setShowSkeleton(false)
        return
      }

      catRank = Number.parseInt(catRankValue)
      if (isNaN(catRank) || catRank < 1 || catRank > 1300000) {
        setError("Category rank must be between 1 and 1,300,000")
        setShowSkeleton(false)
        return
      }

      // Add this line to set the parsed category rank state
      setParsedCategoryRank(catRank)
    } else if ((category !== "General" || isPWD) && !categoryRank) {
      setError("Please enter your category rank")
      setShowSkeleton(false)
      return
    }

    // Start rank animation
    setAnimatedRank(0)
    setUserRank(rank)
    setIsPredicting(true)

    // Animate the rank counting up - shorter animation (1 second)
    const duration = 1000 // 1 second
    const steps = 20
    const increment = Math.ceil(rank / steps)
    let current = 0

    // Start the data fetching in parallel with the animation
    const fetchDataPromise = fetchCollegeData(rank, catRank)

    const timer = setInterval(() => {
      current += increment
      if (current >= rank) {
        clearInterval(timer)
        setAnimatedRank(rank)
        setAnimationComplete(true)
      } else {
        setAnimatedRank(current)
      }
    }, duration / steps)

    // Wait for the data to be fetched
    try {
      const collegeData = await fetchDataPromise
      setColleges(collegeData)
      setHasResults(true)
      setShowSkeleton(false)
    } catch (error) {
      setError("An error occurred while making the prediction")
      setShowSkeleton(false)
    } finally {
      setIsPredicting(false)
    }
  }

  // Add a new function to handle the data fetching separately
  const fetchCollegeData = async (rank: number, catRank: number | null) => {
    try {
      const supabase = getSupabaseClient()
      // Determine the seat_type based on category and PWD status
      const generalSeatType = isPWD ? "OPEN (PwD)" : "OPEN"
      let categorySeatType: string

      switch (category) {
        case "General":
          categorySeatType = generalSeatType // For General, both are the same
          break
        case "OBC":
          categorySeatType = isPWD ? "OBC-NCL (PwD)" : "OBC-NCL"
          break
        case "SC":
          categorySeatType = isPWD ? "SC (PwD)" : "SC"
          break
        case "ST":
          categorySeatType = isPWD ? "ST (PwD)" : "ST"
          break
        case "EWS":
          categorySeatType = isPWD ? "EWS (PwD)" : "EWS"
          break
        default:
          categorySeatType = generalSeatType
      }

      // For female candidates, we'll fetch data for both gender-neutral and female quotas
      const gendersToFetch = gender === "female" ? ["Gender-Neutral", "Female"] : ["Gender-Neutral"]

      // Instead of using instituteTypeFilter, we'll directly filter in the queries
      let allCollegeData: CollegePrediction[] = []

      // Always fetch general category data based on the main rank (for both regular and PwD candidates)
      // PWD candidates are eligible for both general and PWD-specific seats
      for (const genderToFetch of gendersToFetch) {
        // Build query for OS (All India) quota
        let query = supabase
          .from("college_cutoffs")
          .select(
            "institute, department, opening_rank, closing_rank, institute_type, state, NIRF, quota, gender, seat_type",
          )
          .eq("seat_type", "OPEN") // Always use OPEN for general category
          .eq("gender", genderToFetch)
          .gte("closing_rank", rank) // Use the general rank here
          .eq("academic_year", 2024)
          .eq("quota", "OS") // All India quota

        // Add institute type filter based on exam type
        if (examType === "jee-advanced") {
          query = query.eq("institute_type", "IIT")
        } else {
          // For JEE Main, exclude IITs
          query = query.not("institute_type", "eq", "IIT").not("institute", "ilike", "%Indian Institute of Technology%")
        }

        const { data: osData, error: osError } = await query

        if (osError) {
          throw osError
        }

        // Build query for HS (Home State) quota - only for the candidate's home state
        let hsQuery = supabase
          .from("college_cutoffs")
          .select(
            "institute, department, opening_rank, closing_rank, institute_type, state, NIRF, quota, gender, seat_type",
          )
          .eq("seat_type", "OPEN")
          .eq("gender", genderToFetch)
          .gte("closing_rank", rank)
          .eq("academic_year", 2024)
          .eq("quota", "HS")
          .eq("state", homeState) // Only show HS quota for the candidate's home state

        // Add institute type filter based on exam type
        if (examType === "jee-advanced") {
          hsQuery = hsQuery.eq("institute_type", "IIT")
        } else {
          // For JEE Main, exclude IITs
          hsQuery = hsQuery
            .not("institute_type", "eq", "IIT")
            .not("institute", "ilike", "%Indian Institute of Technology%")
        }

        const { data: hsData, error: hsError } = await hsQuery

        if (hsError) {
          throw hsError
        }

        // Combine results for this gender
        const genderData = [...(osData || []), ...(hsData || [])]
        allCollegeData = [...allCollegeData, ...genderData]
      }

      // If PwD is checked OR a category other than General is selected, fetch category-specific data
      if (isPWD || category !== "General") {
        // Use category rank if provided, otherwise use general rank
        const rankToUse = catRank !== null ? catRank : rank

        for (const genderToFetch of gendersToFetch) {
          // Build query for OS (All India) quota with category seat type
          let catOsQuery = supabase
            .from("college_cutoffs")
            .select(
              "institute, department, opening_rank, closing_rank, institute_type, state, NIRF, quota, gender, seat_type",
            )
            .eq("seat_type", categorySeatType)
            .eq("gender", genderToFetch)
            .gte("closing_rank", rankToUse) // Use the category rank or general rank
            .eq("academic_year", 2024)
            .eq("quota", "OS") // All India quota

          // Add institute type filter based on exam type
          if (examType === "jee-advanced") {
            catOsQuery = catOsQuery.eq("institute_type", "IIT")
          } else {
            // For JEE Main, exclude IITs
            catOsQuery = catOsQuery
              .not("institute_type", "eq", "IIT")
              .not("institute", "ilike", "%Indian Institute of Technology%")
          }

          const { data: catOsData, error: catOsError } = await catOsQuery

          if (catOsError) {
            throw catOsError
          }

          // Build query for HS (Home State) quota with category seat type
          let catHsQuery = supabase
            .from("college_cutoffs")
            .select(
              "institute, department, opening_rank, closing_rank, institute_type, state, NIRF, quota, gender, seat_type",
            )
            .eq("seat_type", categorySeatType)
            .eq("gender", genderToFetch)
            .gte("closing_rank", rankToUse)
            .eq("academic_year", 2024)
            .eq("quota", "HS")
            .eq("state", homeState)

          // Add institute type filter based on exam type
          if (examType === "jee-advanced") {
            catHsQuery = catHsQuery.eq("institute_type", "IIT")
          } else {
            // For JEE Main, exclude IITs
            catHsQuery = catHsQuery
              .not("institute_type", "eq", "IIT")
              .not("institute", "ilike", "%Indian Institute of Technology%")
          }

          const { data: catHsData, error: catHsError } = await catHsQuery

          if (catHsError) {
            throw catHsError
          }

          // Combine results for this gender and category
          const catGenderData = [...(catOsData || []), ...(catHsData || [])]
          allCollegeData = [...allCollegeData, ...catGenderData]
        }
      }

      // Group and sort colleges
      const groupedColleges = groupAndSortColleges(allCollegeData)

      // Update user credits
      const { error: updateError } = await supabase
        .from("users")
        .update({ credits: user.credits - 10 })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Save prediction to database
      const { error: predictionError } = await supabase.from("predictions").insert({
        user_id: user.id,
        percentile: scoreType === "percentile" ? Number.parseFloat(percentileOrRank) : null,
        rank,
        colleges: allCollegeData,
      })

      if (predictionError) throw predictionError

      // Update local user state with new credits
      user.credits -= 10

      return groupedColleges
    } catch (error) {
      console.error("Error in fetchCollegeData:", error)
      throw error
    }
  }

  const toggleCollegeExpand = (instituteIndex: number) => {
    setExpandedColleges((prev) => ({
      ...prev,
      [instituteIndex]: !prev[instituteIndex],
    }))
  }

  const calculateChances = (
    openingRank: number,
    closingRank: number,
    userRank: number | null,
    categoryRank: number | null,
    seatType: string,
  ): { chance: "high" | "medium" | "low"; color: string } => {
    // If no rank is available, return medium chance
    if (!userRank && !categoryRank) return { chance: "medium", color: "bg-yellow-100 text-yellow-800" }

    // Determine which rank to use based on seat type
    // If it's a category seat type (not OPEN), use category rank if available
    const isGeneralSeat = seatType === "OPEN"
    const rankToUse = !isGeneralSeat && categoryRank ? categoryRank : userRank

    // If no applicable rank is available, return medium chance
    if (!rankToUse) return { chance: "medium", color: "bg-yellow-100 text-yellow-800" }

    // If user rank is better than opening rank, high chance
    if (rankToUse <= openingRank) {
      return { chance: "high", color: "bg-green-100 text-green-800" }
    }

    // Determine threshold based on closing rank
    let threshold = 30
    if (closingRank <= 100) {
      threshold = 5
    } else if (closingRank <= 1000) {
      threshold = 15
    } else if (closingRank <= 10000) {
      threshold = 30
    }

    // If user rank is within threshold of closing rank, low chance
    if (closingRank - rankToUse <= threshold) {
      return { chance: "low", color: "bg-red-100 text-red-800" }
    }

    // Otherwise medium chance
    return { chance: "medium", color: "bg-yellow-100 text-yellow-800" }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilters({
      degree: new Set<string>(),
      branch: new Set<string>(),
      duration: new Set<string>(),
      college: new Set<string>(),
      collegeType: new Set<string>(),
    })
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      const filterSet = new Set(prev[filterType as keyof typeof prev])

      if (filterSet.has(value)) {
        filterSet.delete(value)
      } else {
        filterSet.add(value)
      }

      newFilters[filterType as keyof typeof prev] = filterSet
      return newFilters
    })
  }

  const saveList = () => {
    alert("This feature will be available soon!")
  }

  useEffect(() => {
    if (!colleges.length && !initialCollegesLoaded) {
      setFilteredColleges([])
      return
    }
    setFilteredColleges(colleges)
    setInitialCollegesLoaded(true)
  }, [colleges, initialCollegesLoaded])

  // Update the useEffect that sets the home state to handle the exam type change
  // Find the useEffect around line 300-310 that sets the home state

  useEffect(() => {
    if (!loading) {
      setShouldRedirect(!user)
      if (user) {
        // Always set home state, even if it's not shown for JEE Advanced
        setHomeState(user.home_state)
        setHasSetHomeState(true)
      }
    }
  }, [loading, user])

  // Add a new useEffect to handle exam type changes
  useEffect(() => {
    // When switching to JEE Advanced, we still need a valid home state value
    // for the backend queries, even though we don't show it in the UI
    if (examType === "jee-advanced" && user) {
      setHomeState(user.home_state)
    }
  }, [examType, user])

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login")
    }
  }, [shouldRedirect, router])

  useEffect(() => {
    setHasCheckedUser(true)
  }, [])

  // Add a function to fetch already saved departments when the component loads
  // Add this function after the other useEffect hooks

  useEffect(() => {
    // Fetch saved departments when user is available
    if (user) {
      fetchSavedDepartments()
    }
  }, [user])

  const fetchSavedDepartments = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/saved-departments?user_id=${user.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch saved departments")
      }

      const data = await response.json()

      // Create a map of saved departments for quick lookup
      const savedMap: Record<string, boolean> = {}
      data.forEach((dept: any) => {
        const key = `${dept.institute}-${dept.department}-${dept.quota}-${dept.gender}-${dept.seat_type}`
        savedMap[key] = true
      })

      setSavedDepartments(savedMap)
    } catch (error) {
      console.error("Error fetching saved departments:", error)
    }
  }

  const handleSaveDepartment = async (
    institute: string,
    dept: {
      department: string
      opening_rank: number
      closing_rank: number
      quota: string
      gender: string
      seat_type: string
    },
    instituteData: GroupedCollege,
  ) => {
    if (!user) {
      setError("Please log in to save departments")
      return
    }

    // Create a unique key for this department
    const deptKey = `${institute}-${dept.department}-${dept.quota}-${dept.gender}-${dept.seat_type}`

    // If already saving, return
    if (isSaving[deptKey]) return

    // Set saving state
    setIsSaving((prev) => ({ ...prev, [deptKey]: true }))

    try {
      // Prepare the data to save
      const departmentData = {
        user_id: user.id,
        institute,
        department: dept.department,
        institute_type: instituteData.institute_type,
        state: instituteData.state,
        nirf: instituteData.NIRF,
        quota: dept.quota,
        gender: dept.gender,
        seat_type: dept.seat_type,
        opening_rank: dept.opening_rank,
        closing_rank: dept.closing_rank,
        prediction_rank: userRank,
        prediction_percentile: scoreType === "percentile" ? Number.parseFloat(percentileOrRank) : null,
        category_rank: parsedCategoryRank,
      }

      // Call the API to save the department
      const response = await fetch("/api/save-department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentData),
      })

      const result = await response.json()

      if (response.ok) {
        // Update saved state
        setSavedDepartments((prev) => ({ ...prev, [deptKey]: true }))
        setError(`${dept.department} at ${institute} has been saved to your list.`)
        setTimeout(() => setError(""), 3000)
      } else {
        console.error("Error saving department:", result)
        setError(result.error || "Failed to save department")
        setTimeout(() => setError(""), 3000)
      }
    } catch (error) {
      console.error("Error saving department:", error)
      setError("An unexpected error occurred while saving the department")
      setTimeout(() => setError(""), 3000)
    } finally {
      // Reset saving state
      setIsSaving((prev) => ({ ...prev, [deptKey]: false }))
    }
  }

  const handleCreditDeduction = async () => {
    if (!user) {
      setError("Please log in to view college details.")
      return
    }

    if (user.credits < 1) {
      setError("You need at least 1 credit to view college details.")
      return
    }

    try {
      const supabase = getSupabaseClient()

      // Update user credits
      const { error: updateError } = await supabase
        .from("users")
        .update({ credits: user.credits - 1 })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Update local user state with new credits
      user.credits -= 1

      // Optionally, refresh user data or context here
    } catch (error) {
      console.error("Error deducting credit:", error)
      setError("An error occurred while deducting credit.")
    }
  }

  try {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="container mx-auto w-full max-w-full sm:max-w-[90vw]">
            {!hasResults && !showSkeleton ? (
              <Card className="sm:shadow sm:border sm:rounded-lg sm:bg-card sm:p-4 card-small-screen">
                <CardHeader>
                  <CardTitle>Enter Your Details</CardTitle>
                  <CardDescription>
                    This prediction will cost 10 credits. You have {user?.credits} credits remaining.
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-content-small-screen">
                  <form onSubmit={handlePredict} className="space-y-3">
                    <div className="space-y-3">
                      {/* Score Information Section */}
                      <div className="bg-muted/30 p-3 rounded-lg space-y-3">
                        <h3 className="text-base font-medium mb-2">Score Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="percentileOrRank">General Rank</Label>
                            <Input
                              id="percentileOrRank"
                              placeholder="e.g. 12345"
                              value={percentileOrRank}
                              onChange={(e) => setPercentileOrRank(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Exam Type</Label>
                            <RadioGroup
                              className="flex"
                              value={examType}
                              onValueChange={(value) => setExamType(value as ExamType)}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="jee-main" id="jee-main" />
                                <Label htmlFor="jee-main">JEE Main</Label>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <RadioGroupItem value="jee-advanced" id="jee-advanced" />
                                <Label htmlFor="jee-advanced">JEE Advanced</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                      {/* Personal Information Section */}
                      <div className="bg-muted/30 p-3 rounded-lg space-y-3">
                        <h3 className="text-base font-medium mb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Gender</Label>
                            <RadioGroup
                              className="flex"
                              value={gender}
                              onValueChange={(value) => setGender(value as Gender)}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="gender-neutral" id="gender-neutral" />
                                <Label htmlFor="gender-neutral">Gender-Neutral</Label>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female">Female</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Only show home state selection for JEE Main */}
                          {examType === "jee-main" && (
                            <div className="space-y-2">
                              <Label htmlFor="homeState">Home State</Label>
                              <Select value={homeState} onValueChange={(value) => setHomeState(value as IndianState)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  {indianStates.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Category Information Section */}
                      <div className="bg-muted/30 p-3 rounded-lg space-y-3">
                        <h3 className="text-base font-medium mb-2">Category Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={category} onValueChange={(value) => setCategory(value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="OBC">OBC</SelectItem>
                                <SelectItem value="SC">SC</SelectItem>
                                <SelectItem value="ST">ST</SelectItem>
                                <SelectItem value="EWS">EWS</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {(category !== "General" || isPWD) && (
                            <div className="space-y-2">
                              <Label htmlFor="categoryRank">Category Rank</Label>
                              <Input
                                id="categoryRank"
                                placeholder="Enter your category rank"
                                value={categoryRank}
                                onChange={(e) => setCategoryRank(e.target.value)}
                                required
                              />
                            </div>
                          )}

                          <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
                            <Checkbox id="isPWD" checked={isPWD} onCheckedChange={setIsPWD} />
                            <Label htmlFor="isPWD" className="cursor-pointer">
                              Person with Disability (PwD)
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPredicting || !user?.credits || user.credits < 10}
                    >
                      {isPredicting ? "Predicting..." : "Predict Colleges"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : showSkeleton ? (
              <div className="space-y-6">
                <Card className="sm:shadow sm:border sm:rounded-lg sm:bg-card sm:p-4 card-small-screen">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Prediction Results</CardTitle>
                      <CardDescription>
                        Based on your {scoreType === "percentile" ? "percentile" : "rank"} of {percentileOrRank}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 px-4 py-2 rounded-lg border border-purple-100 dark:border-purple-800 shadow-sm">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          Rank: {animatedRank.toLocaleString()}
                        </div>
                        {(category !== "General" || isPWD) && categoryRank && (
                          <div className="text-sm font-medium text-muted-foreground mt-1 text-right">
                            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs">
                              {category === "General" && isPWD
                                ? "PwD Rank"
                                : `${category}${isPWD ? " (PwD)" : ""} Rank`}
                              : <span className="font-semibold ml-1">{categoryRank}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="card-content-small-screen">
                    {/* Show actual results if animation is complete and we have data */}
                    {animationComplete && colleges.length > 0 ? (
                      <div className="space-y-8">
                        <p className="font-medium">
                          You are eligible for {colleges.length} {colleges.length === 1 ? "college" : "colleges"} based
                          on your {scoreType === "percentile" ? "percentile" : "rank"}. Here are your college and branch
                          options:
                        </p>

                        {colleges.map((institute, index) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            <div className="bg-muted p-4 cursor-pointer hover:bg-muted/80 transition-colors">
                              <div className="flex justify-between items-start">
                                <div className="h-6 w-48 bg-muted/80 rounded animate-pulse"></div>
                                <div className="h-8 w-24 bg-muted/80 rounded animate-pulse"></div>
                              </div>
                              <div className="flex gap-4 mt-2">
                                <div className="h-4 w-24 bg-muted/60 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-muted/60 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-muted/60 rounded animate-pulse"></div>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="space-y-4">
                                <div className="flex justify-between">
                                  <div className="h-4 w-full bg-muted/40 rounded animate-pulse"></div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="h-4 w-full bg-muted/40 rounded animate-pulse"></div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="h-4 w-full bg-muted/40 rounded animate-pulse"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="h-6 w-3/4 bg-muted/60 rounded animate-pulse"></div>

                        {/* Skeleton for colleges */}
                        {[1, 2, 3].map((_, index) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            <div className="bg-muted p-4">
                              <div className="flex justify-between items-start">
                                <div className="h-6 w-48 bg-muted/80 rounded animate-pulse"></div>
                                <div className="h-8 w-24 bg-muted/80 rounded animate-pulse"></div>
                              </div>
                              <div className="flex gap-4 mt-2">
                                <div className="h-4 w-24 bg-muted/60 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-muted/60 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-muted/60 rounded animate-pulse"></div>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="space-y-4">
                                <div className="flex justify-between">
                                  <div className="h-4 w-full bg-muted/40 rounded animate-pulse"></div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="h-4 w-full bg-muted/40 rounded animate-pulse"></div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="h-4 w-full bg-muted/40 rounded animate-pulse"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="h-4 w-full bg-muted/40 rounded animate-pulse"></div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setHasResults(false)
                        setShowSkeleton(false)
                      }}
                    >
                      Make Another Prediction
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="sm:shadow sm:border sm:rounded-lg sm:bg-card sm:p-4 card-small-screen">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Prediction Results</CardTitle>
                      <CardDescription>
                        Based on your General Rank of {percentileOrRank}
                        {userRank && scoreType === "percentile" ? ` (Rank: ${userRank})` : ""}
                        {category !== "General" && ` - ${category}${isPWD ? " (PwD)" : ""} category`}
                        {gender === "female" && " - Showing options for both Female and Gender-Neutral quotas"}
                        {` - ${examType === "jee-main" ? "JEE Main" : "JEE Advanced (IITs only)"}`}
                        {examType === "jee-main" && ` - Home State: ${homeState}`}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 px-4 py-2 rounded-lg border border-purple-100 dark:border-purple-800 shadow-sm">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          Rank: {userRank?.toLocaleString()}
                        </div>
                        {(category !== "General" || isPWD) && categoryRank && (
                          <div className="text-sm font-medium text-muted-foreground mt-1 text-right">
                            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs">
                              {category === "General" && isPWD
                                ? "PwD Rank"
                                : `${category}${isPWD ? " (PwD)" : ""} Rank`}
                              : <span className="font-semibold ml-1">{categoryRank}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="card-content-small-screen">
                    <div className="mt-6 space-y-4">
                      {colleges.length > 0 ? (
                        <>
                          {/* Desktop filter UI */}
                          <div className="hidden md:block mb-6">
                            <CollegeFilterUI
                              colleges={colleges}
                              onFilteredCollegesChange={setFilteredColleges}
                              onNewPrediction={() => {
                                setHasResults(false)
                                setShowSkeleton(false)
                              }}
                            />
                          </div>

                          {/* Mobile filter UI */}
                          <div className="md:hidden mb-6">
                            <p className="text-sm font-medium mb-3">
                              You are eligible for {filteredColleges.length}{" "}
                              {filteredColleges.length === 1 ? "college" : "colleges"} based on your{" "}
                              {scoreType === "percentile" ? "percentile" : "rank"}.
                            </p>
                            <div className="flex gap-2 mb-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 flex-1"
                                onClick={() => {
                                  setHasResults(false)
                                  setShowSkeleton(false)
                                }}
                              >
                                <RefreshCw className="h-4 w-4" />
                                New Prediction
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 flex-1"
                                onClick={saveList}
                              >
                                Save this List
                              </Button>
                            </div>

                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Search by college or branch..."
                                  className="pl-10"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                              </div>
                              <MobileFilterDrawer
                                colleges={colleges}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={clearFilters}
                              />
                            </div>
                          </div>

                          {/* Desktop view - original text */}
                          <p className="hidden md:block font-medium">
                            You are eligible for {filteredColleges.length}{" "}
                            {filteredColleges.length === 1 ? "college" : "colleges"} based on your{" "}
                            {scoreType === "percentile" ? "percentile" : "rank"}. Here are your college and branch
                            options:
                          </p>

                          {/* College list */}
                          {filteredColleges.map((institute, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden bg-white">
                              {/* College header - both mobile and desktop */}
                              <div
                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-start"
                                onClick={() => toggleCollegeExpand(index)}
                              >
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg">{institute.institute}</h3>

                                  {/* College details - visible on both mobile and desktop */}
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                                    <span className="inline-flex items-center">
                                      <Badge variant="outline" className="mr-1">
                                        {institute.institute_type === "GFTI" ? "GFTIs" : institute.institute_type}
                                      </Badge>
                                    </span>
                                    <span>
                                      {institute.NIRF && (
                                        <span className="text-amber-600 font-medium">NIRF: {institute.NIRF}</span>
                                      )}
                                      {!institute.NIRF && <span className="text-gray-500">NIRF: N/A</span>}
                                    </span>
                                    <span>{institute.state}</span>
                                  </div>

                                  {/* Show high probability count on both mobile and desktop */}
                                  <div className="flex items-center mt-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">
                                      {
                                        institute.departments.filter((dept) => {
                                          const { chance } = calculateChances(
                                            dept.opening_rank,
                                            dept.closing_rank,
                                            userRank,
                                            parsedCategoryRank,
                                            dept.seat_type,
                                          )
                                          return chance === "high"
                                        }).length
                                      }{" "}
                                      High Probability Branches
                                    </span>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <span className="text-sm text-gray-600">
                                      {
                                        institute.departments.filter((dept) => {
                                          const { chance } = calculateChances(
                                            dept.opening_rank,
                                            dept.closing_rank,
                                            userRank,
                                            parsedCategoryRank,
                                            dept.seat_type,
                                          )
                                          return chance === "medium"
                                        }).length
                                      }{" "}
                                      Medium
                                    </span>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <span className="text-sm text-gray-600">
                                      {
                                        institute.departments.filter((dept) => {
                                          const { chance } = calculateChances(
                                            dept.opening_rank,
                                            dept.closing_rank,
                                            userRank,
                                            parsedCategoryRank,
                                            dept.seat_type,
                                          )
                                          return chance === "low"
                                        }).length
                                      }{" "}
                                      Low
                                    </span>
                                  </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-md"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      router.push(`/college/${encodeURIComponent(institute.institute)}`)
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-md"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleCollegeExpand(index)
                                    }}
                                  >
                                    {expandedColleges[index] ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-chevron-up"
                                      >
                                        <path d="m18 15-6-6-6 6" />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-chevron-down"
                                      >
                                        <path d="m6 9 6 6 6-6" />
                                      </svg>
                                    )}
                                  </Button>
                                </div>
                              </div>

                              {/* Expanded content */}
                              {expandedColleges[index] && (
                                <>
                                  {/* Desktop view - table format */}
                                  <div className="hidden md:block">
                                    <table className="w-full">
                                      <thead className="bg-muted/50">
                                        <tr>
                                          <th className="px-4 py-2 text-left">Department</th>
                                          <th className="px-4 py-2 text-left">Quota</th>
                                          {gender === "female" && <th className="px-4 py-2 text-left">Gender</th>}
                                          <th className="px-4 py-2 text-left">Category</th>
                                          <th className="px-4 py-2 text-left">Opening Rank</th>
                                          <th className="px-4 py-2 text-left">Closing Rank</th>
                                          <th className="px-4 py-2 text-left">Chances</th>
                                          <th className="px-4 py-2 text-center">Save</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {institute.departments.map((dept, deptIndex) => {
                                          const { chance, color } = calculateChances(
                                            dept.opening_rank,
                                            dept.closing_rank,
                                            userRank,
                                            parsedCategoryRank,
                                            dept.seat_type,
                                          )

                                          const deptKey = `${institute.institute}-${dept.department}-${dept.quota}-${dept.gender}-${dept.seat_type}`
                                          const isSaved = savedDepartments[deptKey]
                                          const isCurrentlySaving = isSaving[deptKey]

                                          return (
                                            <tr
                                              key={deptIndex}
                                              className={deptIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}
                                            >
                                              <td className="px-4 py-2">{dept.department}</td>
                                              <td className="px-4 py-2">
                                                {dept.quota === "HS" ? "Home State" : "All India"}
                                              </td>
                                              {gender === "female" && (
                                                <td className="px-4 py-2">
                                                  <span
                                                    className={
                                                      dept.gender === "Female" ? "text-purple-600 font-medium" : ""
                                                    }
                                                  >
                                                    {dept.gender}
                                                  </span>
                                                </td>
                                              )}
                                              <td className="px-4 py-2">
                                                {dept.gender === "Female"
                                                  ? `${dept.seat_type} (Female)`
                                                  : dept.seat_type}
                                              </td>
                                              <td className="px-4 py-2">{dept.opening_rank}</td>
                                              <td className="px-4 py-2">{dept.closing_rank}</td>
                                              <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                                                  {chance.charAt(0).toUpperCase() + chance.slice(1)}
                                                </span>
                                              </td>
                                              <td className="px-4 py-2 text-center">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  disabled={isSaved || isCurrentlySaving}
                                                  onClick={() =>
                                                    handleSaveDepartment(institute.institute, dept, institute)
                                                  }
                                                >
                                                  {isCurrentlySaving ? "Saving..." : isSaved ? "Saved" : "Save"}
                                                </Button>
                                              </td>
                                            </tr>
                                          )
                                        })}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Mobile view - card format */}
                                  <div className="md:hidden">
                                    {institute.departments.map((dept, deptIndex) => {
                                      const { chance, color } = calculateChances(
                                        dept.opening_rank,
                                        dept.closing_rank,
                                        userRank,
                                        parsedCategoryRank,
                                        dept.seat_type,
                                      )

                                      const deptKey = `${institute.institute}-${dept.department}-${dept.quota}-${dept.gender}-${dept.seat_type}`
                                      const isSaved = savedDepartments[deptKey]
                                      const isCurrentlySaving = isSaving[deptKey]

                                      return (
                                        <div
                                          key={deptIndex}
                                          className={`p-3 ${deptIndex % 2 === 0 ? "bg-background" : "bg-muted/20"} border-t`}
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
                                              </div>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                              onClick={() => handleSaveDepartment(institute.institute, dept, institute)}
                                              disabled={isSaved || isCurrentlySaving}
                                            >
                                              {isCurrentlySaving ? "Saving..." : isSaved ? "Saved" : "Save"}
                                            </Button>
                                          </div>

                                          <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                                            <div className="bg-gray-50 p-2 rounded">
                                              <div className="text-gray-500 mb-1">Opening Rank</div>
                                              <div className="font-medium">{dept.opening_rank}</div>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded">
                                              <div className="text-gray-500 mb-1">Closing Rank</div>
                                              <div className="font-medium">{dept.closing_rank}</div>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded">
                                              <div className="text-gray-500 mb-1">Chances</div>
                                              <div className="font-medium">
                                                <Badge className={color}>
                                                  {chance.charAt(0).toUpperCase() + chance.slice(1)}
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            No colleges match your current filters. Try adjusting your filters.
                          </p>
                          <Button variant="outline" className="mt-4" onClick={clearFilters}>
                            Clear All Filters
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {/* College Details Modal */}
            {selectedCollege && (
              <CollegeDetailsModal
                collegeName={selectedCollege}
                onClose={() => setSelectedCollege(null)}
                onCreditDeduction={handleCreditDeduction}
              />
            )}
          </div>
        </main>
      </div>
    )
  } catch (e: any) {
    console.error("Error in PredictPage component:", e)
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="text-red-500">
            An error occurred while rendering this page. Please try again later.
            <br />
            {process.env.NODE_ENV === "development" && (
              <>
                <br />
                Error details: {e.message}
                <br />
                Stack trace: {e.stack}
              </>
            )}
          </div>
        </main>
      </div>
    )
  }
}
