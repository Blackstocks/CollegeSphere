"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChatbotDialog } from "./chatbot-dialog"

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Delay showing the button for a better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg flex items-center justify-center z-40 hover:scale-110 transition-transform"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open JEE Assistant"
          >
            <div className="relative w-14 h-14 flex items-center justify-center">
              {/* Chatbot Logo */}
              <div className="w-[240%] h-[240%] relative">
                <Image
                  src="/images/chatbot-logo.png"
                  alt="JEE Assistant"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>{isOpen && <ChatbotDialog onClose={() => setIsOpen(false)} />}</AnimatePresence>
    </>
  )
}
