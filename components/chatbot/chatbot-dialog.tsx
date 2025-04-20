"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { X, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { QUESTION_SETS, getQuestionById, saveChatbotUser } from "@/lib/chatbot-utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  isOptions?: boolean
  options?: Array<{
    id: string
    text: string
  }>
}

type ChatState =
  | "collecting_name"
  | "collecting_email"
  | "collecting_mobile"
  | "showing_options_set1"
  | "showing_options_set2"
  | "showing_options_set3"
  | "asking_contact_support"
  | "collecting_question"
  | "asking_other_questions"
  | "showing_college_suggestion"
  | "asking_login_redirect"
  | "completed"

export function ChatbotDialog({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your JEE counseling assistant. Before we start, could you please share your name?",
    },
  ])

  const [chatState, setChatState] = useState<ChatState>("collecting_name")
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    mobile: "",
    notes: "",
  })
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [optionSetCounter, setOptionSetCounter] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when dialog opens, but only on desktop
  useEffect(() => {
    // Check if it's not a mobile device before focusing
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [])

  // Add resize handler for mobile keyboard
  useEffect(() => {
    const handleResize = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !e.currentTarget.getAttribute("data-option-id")) || isLoading) return

    setIsLoading(true)

    try {
      // Handle based on current state
      if (chatState === "collecting_name") {
        // Save name and ask for email
        const name = input.trim()
        setUserInfo((prev) => ({ ...prev, name }))

        // Add user message
        addUserMessage(name)

        // Add assistant message asking for email
        addAssistantMessage(`Nice to meet you, ${name}! Could you please share your email address?`)

        // Update state
        setChatState("collecting_email")
      } else if (chatState === "collecting_email") {
        const email = input.trim()

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          addUserMessage(email)
          addAssistantMessage("That doesn't look like a valid email. Could you please provide a valid email address?")
        } else {
          setUserInfo((prev) => ({ ...prev, email }))

          // Add user message
          addUserMessage(email)

          // Add assistant message asking for mobile
          addAssistantMessage("Thanks! Finally, could you share your mobile number?")

          // Update state
          setChatState("collecting_mobile")
        }
      } else if (chatState === "collecting_mobile") {
        const mobile = input.trim()

        // Simple mobile validation (10 digits)
        const mobileRegex = /^\d{10}$/
        if (!mobileRegex.test(mobile)) {
          addUserMessage(mobile)
          addAssistantMessage(
            "That doesn't look like a valid 10-digit mobile number. Please provide a valid mobile number.",
          )
        } else {
          setUserInfo((prev) => ({ ...prev, mobile }))

          // Add user message
          addUserMessage(mobile)

          // Save user info to database
          await saveChatbotUser(userInfo.name, userInfo.email, mobile)

          // Show first set of options
          showQuestionOptions("set1")

          // Update state
          setChatState("showing_options_set1")
        }
      } else if (chatState === "collecting_question") {
        // User is submitting their question for support
        const question = input.trim()
        setUserInfo((prev) => ({ ...prev, notes: question }))

        // Add user message
        addUserMessage(question)

        // Save notes to database
        await saveChatbotUser(userInfo.name, userInfo.email, userInfo.mobile, question)

        // Add assistant message
        addAssistantMessage(
          "Thank you for your question. Our team will get in touch with you within 4-8 working hours.",
        )

        // Ask if they have other questions
        setTimeout(() => {
          addAssistantMessage("Do you have any other questions I can help with?")
          setChatState("asking_other_questions")
        }, 1000)
      } else if (chatState === "asking_contact_support") {
        // User is responding to whether they want to contact support
        const response = input.trim().toLowerCase()

        addUserMessage(input.trim())

        if (response === "yes") {
          // User wants to contact support
          addAssistantMessage("Please write your question, and our team will get back to you within 4-8 working hours.")
          setChatState("collecting_question")
        } else if (response === "no") {
          // User doesn't want to contact support
          addAssistantMessage(
            "Is there anything else I can help you with? You can ask me another question or type 'exit' to end our conversation.",
          )
          setChatState("completed")
        } else {
          // Unclear response
          addAssistantMessage(
            "I'm not sure if you want to contact support. Please type 'yes' if you want to contact our support team, or 'no' if you don't.",
          )
        }
      } else if (chatState === "asking_other_questions") {
        const response = input.trim().toLowerCase()
        addUserMessage(input.trim())

        if (response === "yes") {
          // Show first set of options again
          showQuestionOptions("set1")
          setChatState("showing_options_set1")
        } else if (response === "no") {
          // Show college suggestion
          addAssistantMessage(
            "Thank you for using our JEE Counseling Assistant! You might want to check out our college statistics and cutoff data to help with your college selection.",
          )
          setTimeout(() => {
            addAssistantMessage("Would you like to login to access these features? (Yes/No)")
            setChatState("asking_login_redirect")
          }, 1000)
        } else {
          // Unclear response
          addAssistantMessage(
            "I'm not sure I understand. Please type 'yes' if you have more questions, or 'no' if you don't.",
          )
        }
      } else if (chatState === "asking_login_redirect") {
        const response = input.trim().toLowerCase()
        addUserMessage(input.trim())

        if (response === "yes") {
          // Redirect to login
          addAssistantMessage("Great! I'll redirect you to the login page.")
          setTimeout(() => {
            window.location.href = "/login"
          }, 1500)
        } else if (response === "no") {
          // Close chatbot
          addAssistantMessage("No problem! Feel free to come back anytime you need assistance.")
          setTimeout(() => {
            onClose()
          }, 1500)
        } else {
          // Unclear response
          addAssistantMessage(
            "I'm not sure I understand. Please type 'yes' if you want to login, or 'no' if you want to close this chat.",
          )
        }
      } else {
        // Handle option selection
        const optionId = e.currentTarget.getAttribute("data-option-id") || input.trim()

        if (optionId === "not_mentioned") {
          // User selected "My question is not mentioned"
          addUserMessage("My question is not mentioned")

          // Increment counter
          const newCounter = optionSetCounter + 1
          setOptionSetCounter(newCounter)

          if (newCounter >= 3) {
            // After 3 sets, offer to contact support
            addAssistantMessage(
              "I'm sorry I couldn't answer your question. Would you like to contact our support team? (Yes/No)",
            )
            setChatState("asking_contact_support")
          } else {
            // Show next set of options
            const nextSetId = `set${newCounter + 1}`
            showQuestionOptions(nextSetId)

            // Update state
            setChatState(`showing_options_set${newCounter + 1}` as ChatState)
          }
        } else {
          // Handle specific question
          const question = getQuestionById(optionId)

          if (question) {
            // Add user message with the question
            addUserMessage(question.text)

            // Add assistant message with the answer
            addAssistantMessage(question.answer)

            // Ask if they have more questions
            setTimeout(() => {
              addAssistantMessage("Do you have any other questions? (Yes/No)")
            }, 500)
          } else {
            // Check if user typed "yes" or "no" to having more questions
            const userInput = input.trim().toLowerCase()

            addUserMessage(input.trim())

            if (userInput === "yes") {
              // User has more questions, show options again
              showQuestionOptions(`set${(optionSetCounter % 3) + 1}`)
            } else if (userInput === "no") {
              // User doesn't have more questions
              addAssistantMessage("Thank you for chatting with me! If you need help in the future, I'll be here.")
              setChatState("completed")
            } else {
              // Unknown option
              addAssistantMessage(
                "I'm not sure I understand. Could you please select one of the options or type 'exit' to end our conversation?",
              )
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in chatbot:", error)
      addAssistantMessage("Sorry, I encountered an error. Please try again later.")
    } finally {
      setInput("")
      setIsLoading(false)
    }
  }

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content,
      },
    ])
  }

  const addAssistantMessage = (content: string, options?: Array<{ id: string; text: string }>) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant",
        content,
        isOptions: !!options,
        options,
      },
    ])
  }

  const showQuestionOptions = (setId: string) => {
    const questionSet = QUESTION_SETS.find((set) => set.id === setId)

    if (!questionSet) return

    const options = [
      ...questionSet.options.map((q) => ({ id: q.id, text: q.text })),
      { id: "not_mentioned", text: "My question is not mentioned" },
    ]

    addAssistantMessage("Please select one of the following questions:", options)
  }

  const handleOptionClick = (optionId: string) => {
    // Create a synthetic event with the option ID
    const event = {
      preventDefault: () => {},
      currentTarget: { getAttribute: () => optionId },
    } as unknown as React.FormEvent

    handleSubmit(event)
  }

  return (
    <motion.div
      className="fixed bottom-0 sm:bottom-24 right-0 sm:right-6 w-full sm:w-[350px] md:w-[400px] h-[90vh] sm:h-[500px] max-h-[90vh] sm:max-h-[80vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="py-1 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-16 h-16">
            <Image src="/images/chatbot-logo.png" alt="ChatBot" fill className="object-contain brightness-0 invert" />
          </div>
          <h3 className="font-semibold">JEE Counseling Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-200 text-gray-800 rounded-tl-none",
                )}
              >
                {message.content}

                {/* Render options if available */}
                {message.isOptions && message.options && (
                  <div className="mt-2 space-y-2">
                    {message.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionClick(option.id)}
                        className="block w-full text-left p-2 bg-white rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-tl-none max-w-[80%] px-4 py-2">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              // On mobile, scroll to the bottom when input is focused
              if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 300)
              }
            }}
            placeholder={
              chatState === "collecting_name"
                ? "Enter your name..."
                : chatState === "collecting_email"
                  ? "Enter your email..."
                  : chatState === "collecting_mobile"
                    ? "Enter your mobile number..."
                    : chatState === "collecting_question"
                      ? "Write your question here..."
                      : chatState === "asking_contact_support"
                        ? "Type yes or no..."
                        : chatState === "asking_other_questions"
                          ? "Type yes or no..."
                          : chatState === "asking_login_redirect"
                            ? "Type yes or no..."
                            : "Type your message..."
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={cn(
              "p-2 rounded-full",
              input.trim() && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed",
            )}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </motion.div>
  )
}
