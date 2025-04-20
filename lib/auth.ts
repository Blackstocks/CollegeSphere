import { getSupabaseClient } from "./supabase/client"
import type { User, Category, IndianState, Gender } from "./types"

export async function signUp(
  name: string,
  email: string,
  mobile: string,
  gender: Gender,
  category: Category,
  homeState: IndianState,
) {
  try {
    const supabase = getSupabaseClient()
    // Check if a user with this email or mobile already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("email, mobile")
      .or(`email.eq.${email},mobile.eq.${mobile}`)
      .limit(1)

    if (checkError) throw checkError

    if (existingUsers && existingUsers.length > 0) {
      const existingUser = existingUsers[0]
      if (existingUser.email === email && existingUser.mobile === mobile) {
        return {
          success: false,
          error: "profile_exists",
          message: "This email and mobile number are already registered. Please login instead.",
        }
      } else if (existingUser.email === email) {
        return {
          success: false,
          error: "email_exists",
          message: "This email is already registered. Please login instead.",
        }
      } else if (existingUser.mobile === mobile) {
        return {
          success: false,
          error: "mobile_exists",
          message: "This mobile number is already registered. Please login instead.",
        }
      }
    }

    // Generate a random UUID for the user
    const userId = crypto.randomUUID()

    // Insert the user profile data directly
    const { data: userData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: userId,
        name,
        email,
        mobile,
        gender, // Use the provided gender
        category,
        home_state: homeState,
        credits: 50, // Default credits on registration
      })
      .select()
      .single()

    if (profileError) {
      // Profile error occurred
      throw profileError
    }

    // Store the user in local storage for session management
    localStorage.setItem("jee_predictor_user", JSON.stringify(userData))

    return { success: true, userId, user: userData }
  } catch (error) {
    // Error during sign up
    return { success: false, error }
  }
}

export async function signIn(email: string, mobile: string) {
  try {
    const supabase = getSupabaseClient()
    // Fetch the user directly from the database
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("mobile", mobile)
      .limit(1)

    if (error) throw error

    if (!users || users.length === 0) {
      return { success: false, error: "Invalid email or mobile number" }
    }

    const user = users[0]

    // Store the user in local storage for session management
    if (typeof window !== "undefined") {
      localStorage.setItem("jee_predictor_user", JSON.stringify(user))
    }

    return { success: true, user }
  } catch (error) {
    // Error during sign in
    return { success: false, error }
  }
}

export async function signOut() {
  try {
    // Remove the user from local storage
    localStorage.removeItem("jee_predictor_user")
    return { success: true }
  } catch (error) {
    // Error during sign out
    return { success: false, error }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get the user from local storage
    const userJson = typeof window !== "undefined" ? localStorage.getItem("jee_predictor_user") : null

    if (!userJson) return null

    const user = JSON.parse(userJson) as User

    return user
  } catch (error) {
    // Error getting current user
    return null
  }
}
