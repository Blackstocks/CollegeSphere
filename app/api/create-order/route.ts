import { NextResponse } from "next/server"

// Get Razorpay keys from environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: Request) {
  try {
    // Check if Razorpay keys are available
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      // Razorpay keys are not configured
      return NextResponse.json({ success: false, error: "Payment gateway not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { amount, credits, userId, userName, userEmail, userMobile } = body

    if (!amount || !credits || !userId) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Generate a shorter receipt ID that stays under 40 characters
    // Use the current timestamp in seconds (10 digits) and the last 6 chars of userId
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const shortUserId = userId.substring(userId.length - 6)
    const receipt = `rcpt_${timestamp}_${shortUserId}` // Should be well under 40 chars

    // Create Razorpay order
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt, // Using the shortened receipt
        notes: {
          userId,
          credits,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      // Razorpay API error occurred
      throw new Error(errorData.error?.description || `Failed to create order: ${response.statusText}`)
    }

    const orderData = await response.json()

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      keyId: RAZORPAY_KEY_ID,
    })
  } catch (error) {
    // Order creation error
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 },
    )
  }
}
