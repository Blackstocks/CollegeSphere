import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase/client"

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paymentId, orderId, signature, userId, credits } = body

    // Validate required fields
    if (!paymentId || !orderId || !signature || !userId || !credits) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex")

    if (generatedSignature !== signature) {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 })
    }

    // Update order status in database
    await supabase
      .from("razorpay_orders")
      .update({
        status: "completed",
        razorpay_payment_id: paymentId,
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", orderId)

    // Get current user credits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single()

    if (userError) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Update user credits
    const newCredits = userData.credits + credits
    const { error: updateError } = await supabase.from("users").update({ credits: newCredits }).eq("id", userId)

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to update credits" }, { status: 500 })
    }

    // Log transaction
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      credits_added: credits,
      transaction_type: "razorpay_payment",
      payment_id: paymentId,
    })

    return NextResponse.json({
      success: true,
      newCredits,
    })
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Payment verification failed",
      },
      { status: 500 },
    )
  }
}
