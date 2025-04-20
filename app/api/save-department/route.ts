import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key to bypass RLS
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      user_id,
      institute,
      department,
      institute_type,
      state,
      nirf,
      quota,
      gender,
      seat_type,
      opening_rank,
      closing_rank,
      prediction_rank,
      prediction_percentile,
      category_rank,
    } = body

    // Validate required fields
    if (!user_id || !institute || !department || !quota || !gender || !seat_type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // First, check if the user exists
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", user_id)
      .single()

    if (userError || !userData) {
      console.error("Error finding user:", userError)
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Check if this department is already saved by this user
    const { data: existingData, error: checkError } = await supabaseAdmin
      .from("saved_departments")
      .select("id")
      .eq("user_id", user_id)
      .eq("institute", institute)
      .eq("department", department)
      .eq("quota", quota)
      .eq("gender", gender)
      .eq("seat_type", seat_type)

    if (checkError) {
      console.error("Error checking for existing saved department:", checkError)
      return NextResponse.json({ success: false, error: checkError.message }, { status: 500 })
    }

    // If already saved, return success
    if (existingData && existingData.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Department already saved",
        id: existingData[0].id,
      })
    }

    // Save the department
    const { data, error } = await supabaseAdmin
      .from("saved_departments")
      .insert({
        user_id,
        institute,
        department,
        institute_type,
        state,
        nirf,
        quota,
        gender,
        seat_type,
        opening_rank,
        closing_rank,
        prediction_rank,
        prediction_percentile,
        category_rank,
      })
      .select()

    if (error) {
      console.error("Error saving department:", error)

      // Check for foreign key violation specifically
      if (error.code === "23503") {
        // Foreign key violation code
        return NextResponse.json(
          {
            success: false,
            error: "Invalid user ID - user does not exist in the database",
          },
          { status: 400 },
        )
      }

      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Department saved successfully",
      id: data[0].id,
    })
  } catch (error) {
    console.error("Error in save-department API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
