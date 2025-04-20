import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Ensure we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
}

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null

// Function to get the Supabase client
export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are required")
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
    return supabaseInstance
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    throw new Error("Failed to initialize Supabase client")
  }
}

// For backward compatibility
export const supabase = getSupabaseClient()
