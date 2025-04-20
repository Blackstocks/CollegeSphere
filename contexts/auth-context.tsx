"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, Gender } from "@/lib/types"
import { getCurrentUser, signIn, signOut, signUp } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, mobile: string) => Promise<{ success: boolean; error?: any }>
  logout: () => Promise<{ success: boolean; error?: any }>
  register: (
    name: string,
    email: string,
    mobile: string,
    gender: Gender,
    category: string,
    homeState: string,
  ) => Promise<{ success: boolean; error?: any; message?: string; user?: User }>
  updateUserCredits: (userId: string, creditsToAdd: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser()
        setUser(user)
      } catch (error) {
        // Error loading user
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Update the login function to ensure we're properly handling the redirect

  const login = async (email: string, mobile: string) => {
    try {
      const result = await signIn(email, mobile)
      if (result.success && result.user) {
        setUser(result.user as User)
        // Add a small delay before redirecting to ensure state is updated
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      }
      return result
    } catch (error) {
      // Login error occurred
      return { success: false, error }
    }
  }

  const logout = async () => {
    try {
      const result = await signOut()
      if (result.success) {
        setUser(null)
        router.push("/")
      }
      return result
    } catch (error) {
      // Logout error occurred
      return { success: false, error }
    }
  }

  const register = async (
    name: string,
    email: string,
    mobile: string,
    gender: Gender,
    category: string,
    homeState: string,
  ) => {
    try {
      const result = await signUp(name, email, mobile, gender, category as any, homeState as any)

      if (result.success && result.user) {
        // Set the user directly from the signup result
        setUser(result.user as User)
        router.push("/dashboard")
      }

      // Pass along the message if it exists
      return {
        success: result.success,
        error: result.error,
        message: result.message,
        user: result.user,
      }
    } catch (error) {
      // Registration error in context
      return { success: false, error }
    }
  }

  const updateUserCredits = (userId: string, creditsToAdd: number) => {
    if (!user) return

    // Update local user state
    setUser({
      ...user,
      credits: user.credits + creditsToAdd,
    })

    // Update the user in localStorage to persist the change
    if (typeof window !== "undefined") {
      const userJson = localStorage.getItem("jee_predictor_user")
      if (userJson) {
        try {
          const userData = JSON.parse(userJson) as User
          userData.credits = user.credits + creditsToAdd
          localStorage.setItem("jee_predictor_user", JSON.stringify(userData))
        } catch (error) {
          // Error updating user credits in localStorage
        }
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUserCredits }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
