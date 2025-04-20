"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RechargeModal } from "./recharge-modal"
import { BookingConfirmationModal } from "@/components/booking-confirmation-modal"

export function Header() {
  const { user, logout, updateUserCredits } = useAuth()
  const [showRechargeModal, setShowRechargeModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [isRazorpayActive, setIsRazorpayActive] = useState(false)

  // Function to get user initials
  const getUserInitials = () => {
    if (!user || !user.name) return "U"

    const nameParts = user.name.split(" ")
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }

  const handleRechargeSuccess = (credits: number) => {
    if (user) {
      updateUserCredits(user.id, credits)
    }
    setShowRechargeModal(false)
  }

  const handleBookSession = () => {
    if (user && user.credits < 500) {
      return
    }
    setShowBookingModal(true)
  }

  // Monitor for Razorpay elements to detect when it's active
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const razorpayElements = document.querySelectorAll(
            '.razorpay-container, .razorpay-backdrop, iframe[src*="razorpay"]',
          )
          if (razorpayElements.length > 0) {
            setIsRazorpayActive(true)
            document.body.setAttribute("data-razorpay-active", "true")
          } else {
            setIsRazorpayActive(false)
            document.body.removeAttribute("data-razorpay-active")
          }
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  const lowCredits = user && user.credits <= 20

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="w-full max-w-[1440px] mx-auto flex h-20 sm:h-24 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/collegespherelogo.png" alt="CollegeSphere Logo" className="h-14 md:h-20" />
        </Link>
        <div className="flex items-center gap-1 md:gap-4">
          {user ? (
            <>
              <div
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-full ${
                  lowCredits ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : "bg-secondary"
                }`}
              >
                {lowCredits && <AlertCircle className="h-3.5 w-3.5 mr-1" />}
                <span className="text-sm md:text-base font-medium">Credits:</span>
                <span className="text-sm md:text-base font-bold">{user.credits}</span>
              </div>

              {lowCredits && (
                <Button
                  variant="outline"
                  size="default"
                  className="text-sm bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 hidden sm:flex"
                  onClick={() => setShowRechargeModal(true)}
                  disabled={isRazorpayActive}
                >
                  Recharge
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring relative"
                    disabled={isRazorpayActive}
                  >
                    {getUserInitials()}
                    {lowCredits && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background sm:hidden"></span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <div className="text-base font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 space-y-1">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className="text-muted-foreground">Mobile:</span>
                      <span>{user.mobile}</span>

                      <span className="text-muted-foreground">Gender:</span>
                      <span>{user.gender === "gender-neutral" ? "Gender-Neutral" : "Female"}</span>

                      <span className="text-muted-foreground">Category:</span>
                      <span>{user.category}</span>

                      <span className="text-muted-foreground">Home State:</span>
                      <span>{user.home_state}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {lowCredits && (
                    <>
                      <DropdownMenuItem
                        onClick={() => setShowRechargeModal(true)}
                        className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 font-medium"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Recharge Credits
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/predict">Make Prediction</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/saved-colleges">Saved Colleges</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleBookSession}
                    disabled={user.credits < 500}
                    className={user.credits < 500 ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    One-to-One Session
                    {user.credits < 500 && <span className="ml-auto text-xs text-muted-foreground">500 credits</span>}
                  </DropdownMenuItem>
                  {!lowCredits && (
                    <DropdownMenuItem onClick={() => setShowRechargeModal(true)}>Recharge Credits</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/contact">Contact Us</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/terms">Terms and Conditions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/privacy">Privacy Policy</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="default" disabled={isRazorpayActive}>
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Recharge Modal */}
      <RechargeModal
        open={showRechargeModal && !isRazorpayActive}
        onClose={() => setShowRechargeModal(false)}
        onSuccess={handleRechargeSuccess}
      />

      {/* Booking Confirmation Modal */}
      {user && (
        <BookingConfirmationModal
          open={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          userId={user.id}
          userCredits={user.credits}
        />
      )}
    </header>
  )
}
