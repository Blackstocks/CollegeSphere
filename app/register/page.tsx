"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import type { IndianState, Category, Gender } from "@/lib/types"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [gender, setGender] = useState<Gender>("gender-neutral")
  const [category, setCategory] = useState<Category>("OPEN")
  const [homeState, setHomeState] = useState<IndianState>("Delhi")
  const [error, setError] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  const { register } = useAuth()
  const router = useRouter()

  const indianStates: IndianState[] = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ]

  const categories: Category[] = [
    "OPEN",
    "OPEN (PwD)",
    "OBC_NCL",
    "OBC-NCL (PwD)",
    "SC",
    "SC (PwD)",
    "ST",
    "ST (PwD)",
    "EWS",
    "EWS (PwD)",
  ]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsRegistering(true)

    try {
      // Validate inputs
      if (!name || !email || !mobile || !gender || !category || !homeState) {
        setError("Please fill in all fields")
        setIsRegistering(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address")
        setIsRegistering(false)
        return
      }

      // Validate mobile number (10 digits)
      if (!/^\d{10}$/.test(mobile)) {
        setError("Mobile number must be 10 digits")
        setIsRegistering(false)
        return
      }

      const result = await register(name, email, mobile, gender, category, homeState)

      if (!result.success) {
        // Check for profile exists error
        if (result.error === "profile_exists" || result.error === "email_exists" || result.error === "mobile_exists") {
          setError(result.message || "This profile already exists. Please login instead.")
        } else if (result.error && typeof result.error === "object" && "message" in result.error) {
          setError(result.error.message as string)
        } else if (typeof result.error === "string") {
          setError(result.error)
        } else {
          setError("Registration failed. Please try again.")
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 py-6 sm:py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create an account to predict your college</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup className="flex" value={gender} onValueChange={(value) => setGender(value as Gender)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gender-neutral" id="gender-neutral" />
                      <Label htmlFor="gender-neutral">Gender-Neutral</Label>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeState">Home State</Label>
                  <Select value={homeState} onValueChange={(value) => setHomeState(value as IndianState)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
