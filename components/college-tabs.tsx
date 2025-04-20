"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"

// Define the college data structure
interface ExploreCollege {
  id: number
  college_name: string
  nirf_rank: string | null
  State: string // Note the capital 'S'
  Type: string // Note the capital 'T'
}

// Group colleges by type
interface GroupedColleges {
  [key: string]: ExploreCollege[]
}

// Update the interface to include the onCollegeClick prop
interface CollegeTabsProps {
  collegeData?: GroupedColleges
  onCollegeClick?: (collegeName: string) => void
}

// Update the function signature to include the new prop
export function CollegeTabs({ collegeData = {}, onCollegeClick }: CollegeTabsProps) {
  const collegeTypes =
    Object.keys(collegeData).length > 0 ? Object.keys(collegeData) : ["IIT", "NIT", "GFTI", "IIIT", "BITS", "OTHER"]

  const [activeTab, setActiveTab] = useState(collegeTypes[0] || "IIT")
  const isMobile = useIsMobile()

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Function to get college logo placeholder
  const getCollegeLogo = (name: string, type: string) => {
    // For now, we'll use a placeholder with the first letter
    const initial = name.charAt(0).toUpperCase()
    const colors: Record<string, string> = {
      IIT: "bg-blue-100 text-blue-800",
      NIT: "bg-green-100 text-green-800",
      GFTI: "bg-purple-100 text-purple-800",
      IIIT: "bg-orange-100 text-orange-800",
      BITS: "bg-red-100 text-red-800",
      OTHER: "bg-gray-100 text-gray-800",
    }

    // Default to gray if type not found
    const colorClass = colors[type] || colors.OTHER

    return (
      <div
        className={`w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center font-bold flex-shrink-0 ${colorClass}`}
      >
        {initial}
      </div>
    )
  }

  const getCollegeTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      IIT: "Indian Institutes of Technology",
      NIT: "National Institutes of Technology",
      GFTI: "Government Funded Technical Institutes",
      IIIT: "Indian Institutes of Information Technology",
      BITS: "Birla Institute of Technology & Science",
      OTHER: "Other Engineering Colleges",
    }
    return descriptions[type] || type
  }

  const getCollegeTypeShortDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      IIT: "Premier engineering and technology institutes of India",
      NIT: "Technical institutes of national importance",
      GFTI: "Government funded technical education institutes",
      IIIT: "Specialized in information technology education",
      BITS: "Private deemed university focusing on engineering",
      OTHER: "Other engineering and technical institutes",
    }
    return descriptions[type] || "Engineering and technical institutes"
  }

  // Render the content for the active tab
  const renderActiveContent = () => {
    const colleges = collegeData[activeTab] || []

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold break-words">{getCollegeTypeDescription(activeTab)}</CardTitle>
          <CardDescription className="text-sm break-words">
            {getCollegeTypeShortDescription(activeTab)}
            {colleges.length > 0 && ` (${colleges.length} colleges)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {colleges.length > 0 ? (
            <div className="grid gap-3">
              {colleges
                .sort((a, b) => {
                  // Convert NIRF rank to number, treating null, undefined, or 'N/A' as Infinity
                  const nirfA =
                    a.nirf_rank && a.nirf_rank !== "N/A" ? Number.parseInt(a.nirf_rank) : Number.POSITIVE_INFINITY
                  const nirfB =
                    b.nirf_rank && b.nirf_rank !== "N/A" ? Number.parseInt(b.nirf_rank) : Number.POSITIVE_INFINITY

                  // Sort in ascending order
                  return nirfA - nirfB
                })
                .map((college) => (
                  <div
                    key={college.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {getCollegeLogo(college.college_name, college.Type)}
                      <div className="flex-1 min-w-0 pr-2">
                        <h3
                          className="font-medium text-sm md:text-base break-words line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => onCollegeClick && onCollegeClick(college.college_name)}
                        >
                          {college.college_name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 sm:mt-0 sm:ml-auto">
                      {college.nirf_rank && college.nirf_rank !== "N/A" && (
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          NIRF: {college.nirf_rank}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {college.State}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Coming Soon!</h3>
              <p className="text-muted-foreground text-sm">
                We're working on adding {activeTab} college data. Check back soon!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Format college type for display
  const formatCollegeType = (type: string) => {
    const labels: Record<string, string> = {
      IIT: "IITs",
      NIT: "NITs",
      GFTI: "GFTIs",
      IIIT: "IIITs",
      BITS: "BITS",
      OTHER: "Others",
    }
    return labels[type] || type
  }

  return (
    <div className="w-full overflow-hidden">
      {isMobile ? (
        <div className="space-y-4">
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select college type" />
            </SelectTrigger>
            <SelectContent>
              {collegeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center justify-between w-full">
                    <span>{formatCollegeType(type)}</span>
                    {collegeData[type] && collegeData[type].length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {collegeData[type].length}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {renderActiveContent()}
        </div>
      ) : (
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
            {collegeTypes.slice(0, 6).map((type) => (
              <TabsTrigger key={type} value={type} className="relative text-xs sm:text-sm">
                {formatCollegeType(type)}
                {collegeData[type] && collegeData[type].length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs hidden sm:inline-flex">
                    {collegeData[type].length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {collegeTypes.map((type) => (
            <TabsContent key={type} value={type} className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{getCollegeTypeDescription(type)}</CardTitle>
                  <CardDescription>
                    {getCollegeTypeShortDescription(type)}
                    {collegeData[type] && collegeData[type].length > 0 && ` (${collegeData[type].length} colleges)`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {collegeData[type] && collegeData[type].length > 0 ? (
                    <div className="grid gap-4">
                      {collegeData[type].map((college) => (
                        <div
                          key={college.id || `${college.college_name}-${college.Type}`}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          {getCollegeLogo(college.college_name, college.Type)}
                          <div className="flex-1 min-w-0">
                            {/* Also update the college rendering in the TabsContent section */}
                            <h3
                              className="font-medium text-sm md:text-base truncate cursor-pointer hover:text-primary transition-colors"
                              onClick={() => onCollegeClick && onCollegeClick(college.college_name)}
                            >
                              {college.college_name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {college.nirf_rank && (
                                <Badge variant="outline" className="text-xs">
                                  NIRF: {college.nirf_rank}
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {college.State}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4 bg-muted/30 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">No Colleges Found</h3>
                      <p className="text-muted-foreground">
                        {type === activeTab
                          ? "No colleges found in this category."
                          : "Select this tab to view colleges."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
