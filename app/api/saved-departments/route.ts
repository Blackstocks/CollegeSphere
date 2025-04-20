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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const user_id = url.searchParams.get("user_id")

    if (!user_id) {
      return NextResponse.json({ success: false, error: "Missing user_id parameter" }, { status: 400 })
    }

    // First, check if the user exists
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", user_id)
      .single()

    if (userError) {
      // If the error is "not found", return an empty array instead of an error
      if (userError.code === "PGRST116") {
        return NextResponse.json([])
      }
      console.error("Error finding user:", userError)
      return NextResponse.json({ success: false, error: userError.message }, { status: 500 })
    }

    // Fetch saved departments for the user
    const { data, error } = await supabaseAdmin
      .from("saved_departments")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching saved departments:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in saved-departments API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
