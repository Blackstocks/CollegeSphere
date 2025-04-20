import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userName, userEmail, userMobile, transactionId } = body

    if (!userName || !userEmail || !userMobile || !transactionId) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Store the transaction in the database
    const { data, error } = await supabase
      .from("simple_transactions")
      .insert({
        user_name: userName,
        user_email: userEmail,
        user_mobile: userMobile,
        transaction_id: transactionId,
      })
      .select()

    if (error) {
      // Error storing transaction
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Transaction submitted successfully",
    })
  } catch (error) {
    // Error in submit-transaction
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to submit transaction" },
      { status: 500 },
    )
  }
}
