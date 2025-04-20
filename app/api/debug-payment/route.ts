import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(request: Request) {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ success: false, error: "Only available in development" }, { status: 403 })
    }

    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    const orderId = url.searchParams.get("orderId")

    if (!userId && !orderId) {
      return NextResponse.json({ success: false, error: "Missing userId or orderId parameter" }, { status: 400 })
    }

    let query = supabase.from("payment_history").select("*")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (orderId) {
      query = query.eq("order_id", orderId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // If userId is provided, also get user info
    let userData = null
    if (userId) {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, name, email, credits")
        .eq("id", userId)
        .single()

      if (!userError) {
        userData = user
      }
    }

    return NextResponse.json({
      success: true,
      payments: data,
      user: userData,
      count: data.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to debug payment" },
      { status: 500 },
    )
  }
}
