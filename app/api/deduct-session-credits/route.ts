import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, credits } = body

    if (!userId || !credits) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Get current user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single()

    if (userError) {
      // Error fetching user
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    if (userData.credits < credits) {
      return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 400 })
    }

    // Update user credits
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: userData.credits - credits })
      .eq("id", userId)

    if (updateError) {
      // Error updating credits
      return NextResponse.json({ success: false, error: "Failed to update credits" }, { status: 500 })
    }

    // Log transaction separately - if this fails, we don't want to roll back the credit deduction
    try {
      await supabase.from("credit_transactions").insert({
        user_id: userId,
        credits_added: -credits,
        transaction_type: "session_booking",
      })
    } catch (logError) {
      // Error logging transaction (non-critical)
    }

    return NextResponse.json({
      success: true,
      message: "Credits deducted successfully",
      newCredits: userData.credits - credits,
    })
  } catch (error) {
    // Error processing credit deduction
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to process credit deduction" },
      { status: 500 },
    )
  }
}
