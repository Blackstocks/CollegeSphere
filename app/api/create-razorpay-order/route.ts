import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

// Get Razorpay keys from environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, baseAmount, gstAmount, credits, userId, userName, userEmail, userMobile } = body

    // Validate required fields
    if (!amount || !credits || !userId || !userName || !userEmail || !userMobile) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Create receipt ID
    const receipt = `rcpt_${Date.now()}_${userId.substring(0, 8)}`

    // Create Razorpay order
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: amount,
        currency: "INR",
        receipt,
        notes: {
          userId,
          credits,
          baseAmount: baseAmount || (amount / 100).toFixed(2),
          gstAmount: gstAmount || "0.00",
          gstPercentage: "18%",
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ success: false, error: `Razorpay API error: ${errorText}` }, { status: 500 })
    }

    const orderData = await response.json()

    // Store order in database with GST information
    await supabase.from("razorpay_orders").insert({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      user_mobile: userMobile,
      credits: credits,
      amount: amount / 100, // Convert from paise to rupees
      base_amount: baseAmount || amount / 100,
      gst_amount: gstAmount || 0,
      razorpay_order_id: orderData.id,
      status: "created",
    })

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      keyId: RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 },
    )
  }
}
