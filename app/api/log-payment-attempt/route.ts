import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, userName, userEmail, userMobile, credits, amount, paymentLink } = body

    if (!userId || !credits || !amount || !paymentLink) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Log the payment attempt in the database
    const { data, error } = await supabase
      .from("payment_attempts")
      .insert({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        user_mobile: userMobile,
        credits: credits,
        amount: amount,
        payment_link: paymentLink,
        status: "pending",
      })
      .select()

    if (error) {
      console.error("Error logging payment attempt:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Payment attempt logged successfully",
      attemptId: data?.[0]?.id,
    })
  } catch (error) {
    console.error("Error in log-payment-attempt:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to log payment attempt" },
      { status: 500 },
    )
  }
}
