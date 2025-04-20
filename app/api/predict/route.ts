import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key to bypass RLS if needed
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ADMIN_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

// Update the POST function to filter out IITs for JEE Main
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { rank, categoryRank, category, gender, examType } = body

    // Validate required parameters
    if (!rank) {
      return NextResponse.json({ error: "Rank is required" }, { status: 400 })
    }

    console.log("Prediction request:", { rank, categoryRank, category, gender, examType })

    // Convert rank to integer to avoid database type errors
    const userRank = Math.round(Number(rank))

    // Query the college_cutoffs table with appropriate filters
    let query = supabaseAdmin
      .from("college_cutoffs")
      .select("*")
      .lte("closing_rank", Math.ceil(userRank * 1.2)) // Allow some buffer for closing rank
      .gte("opening_rank", Math.floor(userRank * 0.8)) // Allow some buffer for opening rank
      .eq("academic_year", 2024) // Filter for the current academic year

    // Filter out IITs if exam type is JEE Main
    if (examType === "jee-main") {
      // Use a more robust approach to filter out IITs
      // Check for both the institute_type field and the institute name containing "Indian Institute of Technology"
      query = query
        .not("institute_type", "eq", "IIT")
        .not("institute_type", "ilike", "%Indian Institute of Technology%")
        .not("institute", "ilike", "%Indian Institute of Technology%")
    }

    // Apply category filter if not OPEN
    if (category !== "OPEN") {
      query = query.eq("seat_type", category)
    }

    // Apply gender filter if female
    if (gender === "female") {
      query = query.eq("gender", "Female")
    }

    // Execute the query
    const { data, error } = await query.limit(100)

    if (error) {
      console.error("Database query error:", error)
      return NextResponse.json({ error: "Failed to fetch college data" }, { status: 500 })
    }

    // If no data found, return empty array
    if (!data || data.length === 0) {
      console.log("No colleges found matching criteria")
      return NextResponse.json([])
    }

    console.log(`Found ${data.length} matching colleges`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in predict API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
