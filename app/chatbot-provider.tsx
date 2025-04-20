"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ChatbotButton } from "@/components/chatbot/chatbot-button"

export function ChatbotProvider() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Only show after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show on admin pages
  if (!mounted || pathname.startsWith("/admin")) {
    return null
  }

  return <ChatbotButton />
}
