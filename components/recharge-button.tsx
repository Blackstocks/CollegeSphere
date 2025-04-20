"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RechargeCreditsModal } from "@/components/recharge-credits-modal"
import { useToast } from "@/hooks/use-toast"

interface RechargeButtonProps {
  userId: string
  userName: string
  userEmail: string
  userMobile?: string
  currentCredits: number
  onCreditsUpdated?: (newCredits: number) => void
}

export function RechargeButton({
  userId,
  userName,
  userEmail,
  userMobile,
  currentCredits,
  onCreditsUpdated,
}: RechargeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleSuccess = (newCredits: number) => {
    if (onCreditsUpdated) {
      onCreditsUpdated(newCredits)
    }

    toast({
      title: "Credits updated",
      description: `Your new balance: ${newCredits} credits`,
    })
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Recharge Credits</Button>

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
