import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"
import crypto from "crypto"

// Get the Calendly webhook secret from environment variables
const WEBHOOK_SECRET = process.env.CALENDLY_WEBHOOK_SECRET

if (!WEBHOOK_SECRET) {
  // CALENDLY_WEBHOOK_SECRET is not set
}

// Function to verify the Calendly webhook signature
function verifySignature(signature: string, body: string): boolean {
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET!)
  const digest = hmac.update(body).digest("hex")
  return signature === digest
}

export async function POST(request: Request) {
  try {
    // Get the Calendly signature from the headers
    const signature = request.headers.get("Calendly-Webhook-Signature")

    if (!signature) {
      return NextResponse.json({ success: false, error: "Missing signature" }, { status: 401 })
    }

    // Get the raw body as a string
    const body = await request.text()

    // Verify the signature
    if (!verifySignature(signature, body)) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 })
    }

    // Parse the webhook payload
    const payload = JSON.parse(body)

    // Check if this is an event.created webhook
    if (payload.event !== "invitee.created" && payload.event !== "booking.created") {
      return NextResponse.json({ success: true, message: "Ignored non-booking event" })
    }

    // Extract user information from the payload
    const userEmail = payload.payload.invitee.email
    const userName = payload.payload.invitee.name

    // Find the user in your database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, credits, email")
      .eq("email", userEmail)
      .single()

    if (userError || !userData) {
      // User not found
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Check if user has enough credits
    if (userData.credits < 500) {
      // User doesn't have enough credits
      return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 400 })
    }

    // Deduct credits from the user
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: userData.credits - 500 })
      .eq("id", userData.id)

    if (updateError) {
      // Error updating user credits
      return NextResponse.json(
        { success: false, error: `Failed to update credits: ${updateError.message}` },
        { status: 500 },
      )
    }

    // Log the transaction
    const { error: transactionError } = await supabase.from("credit_transactions").insert({
      user_id: userData.id,
      credits_added: -500, // Negative because we're deducting
      transaction_type: "session_booking",
      payment_id: payload.payload.uri || payload.payload.uuid, // Use Calendly's event ID
    })

    if (transactionError) {
      // Error logging transaction
      // Don't fail the whole operation if just the logging fails
    }

    // Here you would typically send a confirmation email
    // await sendConfirmationEmail(userData.email, payload.payload.event_details)

    return NextResponse.json({
      success: true,
      message: "Credits deducted successfully",
    })
  } catch (error) {
    // Webhook processing error
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 500 },
    )
  }
}
