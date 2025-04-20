"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RechargeCreditsModal } from "@/components/recharge-credits-modal"
import { useToast } from "@/hooks/use-toast"
import { Coins } from "lucide-react"

interface RechargeButtonProps {
  userId: string
  userName: string
  userEmail: string
  userMobile?: string
  currentCredits: number
  onCreditsUpdated?: (newCredits: number) => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function RechargeButton({
  userId,
  userName,
  userEmail,
  userMobile,
  currentCredits,
  onCreditsUpdated,
  variant = "default",
  size = "default",
  className,
}: RechargeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleSuccess = (newCredits: number) => {
    if (onCreditsUpdated) {
      onCreditsUpdated(newCredits)
    }

    toast({
      title: "Credits updated",
      description: `Your new balance: ${currentCredits + newCredits} credits`,
      duration: 5000,
    })
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} variant={variant} size={size} className={className}>
        <Coins className="mr-2 h-4 w-4" /> Recharge Credits
      </Button>

      <RechargeCreditsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        userName={userName}
        userEmail={userEmail}
        userMobile={userMobile}
        onSuccess={handleSuccess}
      />
    </>
  )
}
