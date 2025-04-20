import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    console.log("Received request to save-chatbot-user API")

    const body = await request.json()
    const { name, email, mobile, notes } = body

    console.log("Request body:", { name, email, mobile, notes: notes ? "provided" : "not provided" })

    if (!name || !email || !mobile) {
      console.error("Missing required fields")
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Ensure Supabase client is initialized
    if (!supabase) {
      console.error("Supabase client not initialized")
      return NextResponse.json({ success: false, error: "Database connection not available" }, { status: 500 })
    }

    // Check if user already exists
    console.log("Checking if user exists:", { email, mobile })
    const { data: existingUser, error: checkError } = await supabase
      .from("chatbot_users")
      .select("id, notes")
      .or(`email.eq.${email},mobile.eq.${mobile}`)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing user:", checkError)
      return NextResponse.json({ success: false, error: checkError.message }, { status: 500 })
    }

    if (existingUser) {
      // User exists, update their record
      console.log("User exists, updating record:", existingUser.id)
      const { data, error } = await supabase
        .from("chatbot_users")
        .update({
          name,
          last_interaction: new Date().toISOString(),
          notes: notes || existingUser.notes,
          interaction_count: supabase.rpc("increment_interaction_count", { row_id: existingUser.id }),
        })
        .eq("id", existingUser.id)
        .select()

      if (error) {
        console.error("Error updating chatbot user:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      console.log("User updated successfully")
      return NextResponse.json({ success: true, data, isUpdate: true })
    } else {
      // Insert new user
      console.log("Creating new user")
      const { data, error } = await supabase
        .from("chatbot_users")
        .insert([
          {
            name,
            email,
            mobile,
            notes: notes || null,
            created_at: new Date().toISOString(),
            last_interaction: new Date().toISOString(),
            interaction_count: 1,
          },
        ])
        .select()

      if (error) {
        console.error("Error saving chatbot user:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      console.log("New user created successfully")
      return NextResponse.json({ success: true, data, isNew: true })
    }
  } catch (error) {
    console.error("Exception in save-chatbot-user API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
