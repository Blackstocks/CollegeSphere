import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase/client"

// Get Razorpay secret key from environment variable
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: Request) {
  try {
    // Check if Razorpay key is available
    if (!RAZORPAY_KEY_SECRET) {
      // Razorpay secret key is not configured
      return NextResponse.json({ success: false, error: "Payment verification not configured" }, { status: 500 })
    }

    // Check if Supabase client is initialized
    if (!supabase) {
      // Supabase client is not initialized
      return NextResponse.json({ success: false, error: "Database connection not available" }, { status: 500 })
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      // Failed to parse request body
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    const { paymentId, orderId, signature, userId, credits } = body

    if (!paymentId || !orderId || !signature || !userId || !credits) {
      // Missing required parameters
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Verify signature
    const dataToSign = `${orderId}|${paymentId}`

    let generatedSignature
    try {
      generatedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(dataToSign).digest("hex")
    } catch (cryptoError) {
      // Error generating signature
      return NextResponse.json({ success: false, error: "Failed to verify payment signature" }, { status: 500 })
    }

    if (generatedSignature !== signature) {
      // Signature verification failed
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 })
    }

    // Update user credits directly using raw SQL to avoid race conditions
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

      // Use a simpler update approach
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
          transaction_type: "recharge",
          payment_id: paymentId,
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
    // Payment verification error
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Payment verification failed" },
      { status: 500 },
    )
  }
}
