import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, eventName, eventDate, eventTime } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single()

    if (userError || !userData) {
      // Error fetching user
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Check if user has enough credits
    if (userData.credits < 500) {
      return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 400 })
    }

    // Deduct credits
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: userData.credits - 500 })
      .eq("id", userId)

    if (updateError) {
      // Error updating credits
      return NextResponse.json({ success: false, error: "Failed to update credits" }, { status: 500 })
    }

    // Log the transaction
    const { error: transactionError } = await supabase.from("credit_transactions").insert({
      user_id: userId,
      credits_added: -500,
      transaction_type: "session_booking",
      payment_id: `booking_${Date.now()}`, // Generate a unique ID
    })

    if (transactionError) {
      // Error logging transaction
      // Don't fail the operation if just the logging fails
    }

    return NextResponse.json({
      success: true,
      message: "Credits deducted successfully",
      newCredits: userData.credits - 500,
    })
  } catch (error) {
    // Error processing booking
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to process booking" },
      { status: 500 },
    )
  }
}
