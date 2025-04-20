import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      // Failed to parse request body
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    const { userId, credits } = body

    if (!userId || !credits) {
      // Missing required parameters
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Update user credits
    try {
      // First check if user exists
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, credits")
        .eq("id", userId)
        .single()

      if (userError) {
        // Error fetching user
        return NextResponse.json(
          { success: false, error: `Failed to fetch user: ${userError.message}` },
          { status: 500 },
        )
      }

      if (!userData) {
        // User not found
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
      }

      // Update credits
      const newCredits = userData.credits + credits

      const { error: updateError } = await supabase.from("users").update({ credits: newCredits }).eq("id", userId)

      if (updateError) {
        // Error updating user credits
        return NextResponse.json(
          { success: false, error: `Failed to update credits: ${updateError.message}` },
          { status: 500 },
        )
      }

      // Log the transaction
      try {
        const { error: transactionError } = await supabase.from("credit_transactions").insert({
          user_id: userId,
          credits_added: credits,
          transaction_type: "manual_recharge",
        })

        if (transactionError) {
          // Error logging transaction
          // Don't fail the whole operation if just the logging fails
          // Failed to log transaction, but credits were updated
        } else {
        }
      } catch (transactionError) {
        // Exception logging transaction
        // Don't fail the whole operation if just the logging fails
        // Exception logging transaction, but credits were updated
      }

      return NextResponse.json({
        success: true,
        newCredits,
      })
    } catch (dbError) {
      // Database operation failed
      return NextResponse.json(
        { success: false, error: dbError instanceof Error ? dbError.message : "Database operation failed" },
        { status: 500 },
      )
    }
  } catch (error) {
    // Manual credit update error
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Credit update failed" },
      { status: 500 },
    )
  }
}
