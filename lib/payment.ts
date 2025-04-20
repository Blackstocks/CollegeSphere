import { supabase } from "./supabase/client"

interface PaymentInitiateParams {
  amount: number
  credits: number
  userId: string
  userName: string
  userEmail: string
  userMobile: string
}

export async function initiatePayment(params: PaymentInitiateParams) {
  try {
    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    // First check if the response is OK
    if (!response.ok) {
      const statusText = response.statusText || `Error ${response.status}`
      // Create order API returned error

      try {
        // Try to parse as JSON first
        const errorData = await response.json()
        return { success: false, error: errorData.error || `Server error: ${statusText}` }
      } catch (jsonError) {
        // If JSON parsing fails, use the text
        const errorText = await response.text()
        return { success: false, error: `Server error: ${errorText || statusText}` }
      }
    }

    // If response is OK, try to parse the JSON
    try {
      const data = await response.json()
      return data
    } catch (jsonError) {
      // Failed to parse create order response
      return { success: false, error: "Invalid response from server" }
    }
  } catch (error) {
    // Error initiating payment
    return { success: false, error: error instanceof Error ? error.message : "Failed to initiate payment" }
  }
}

export async function updateUserCredits(userId: string, creditsToAdd: number) {
  try {
    const { error } = await supabase
      .from("users")
      .update({ credits: supabase.raw(`credits + ${creditsToAdd}`) })
      .eq("id", userId)

    if (error) {
      // Error updating user credits
      throw new Error(`Failed to update credits: ${error.message}`)
    }

    return true
  } catch (error) {
    // Error in updateUserCredits
    return false
  }
}
