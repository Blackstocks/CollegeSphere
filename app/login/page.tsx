"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginMobile, setLoginMobile] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoggingIn(true)

    try {
      if (!loginEmail || !loginMobile) {
        setLoginError("Please fill in all fields")
        setIsLoggingIn(false)
        return
      }

      // Validate mobile number (10 digits)
      if (!/^\d{10}$/.test(loginMobile)) {
        setLoginError("Mobile number must be 10 digits")
        setIsLoggingIn(false)
        return
      }

      const result = await login(loginEmail, loginMobile)

      if (!result.success) {
        if (typeof result.error === "string") {
          setLoginError(result.error)
        } else if (result.error && typeof result.error === "object" && "message" in result.error) {
          setLoginError(result.error.message as string)
        } else {
          setLoginError("Invalid email or mobile number")
        }
      }
    } catch (error) {
      // Login error occurred
      setLoginError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  placeholder="10-digit mobile number"
                  value={loginMobile}
                  onChange={(e) => setLoginMobile(e.target.value)}
                  required
                />
              </div>
              {loginError && <p className="text-sm text-destructive">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
