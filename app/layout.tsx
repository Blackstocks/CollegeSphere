import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ChatbotProvider } from "./chatbot-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CollegeSphere - JEE Main College Predictor | Find Your Dream Engineering College",
  description:
    "Get accurate JEE Main college predictions based on JOSAA 2024 counseling trends. Explore detailed college insights, rankings, courses, and get 1:1 mentorship from top IITians. Make informed decisions about your engineering future!",
  keywords:
    "JEE Main, college predictor, engineering colleges, IIT, NIT, IIIT, JOSAA counseling, JEE rank predictor, college admission, engineering branches, college cutoffs",
  openGraph: {
    title: "CollegeSphere - Crack JEE with Confidence & Get Your Dream College Prediction",
    description:
      "AI-powered college predictions based on JOSAA 2024 trends. Explore detailed college insights and get 1:1 mentorship from top IITians. Stop guessing, start planning your future!",
    url: "https://collegesphere.vercel.app",
    siteName: "CollegeSphere",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-15%20at%207.19.17%E2%80%AFAM-uoBK3WhalPu3omAMgYW6r27FCJpYFl.png",
        width: 800,
        height: 100,
        alt: "CollegeSphere Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegeSphere - JEE Main College Predictor",
    description: "AI-powered college predictions based on JOSAA 2024 trends. Find your dream engineering college!",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-15%20at%207.19.17%E2%80%AFAM-uoBK3WhalPu3omAMgYW6r27FCJpYFl.png",
    ],
    creator: "@collegesphere",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-15%20at%207.19.17%E2%80%AFAM-uoBK3WhalPu3omAMgYW6r27FCJpYFl.png",
    shortcut:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-15%20at%207.19.17%E2%80%AFAM-uoBK3WhalPu3omAMgYW6r27FCJpYFl.png",
    apple:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-15%20at%207.19.17%E2%80%AFAM-uoBK3WhalPu3omAMgYW6r27FCJpYFl.png",
  },
  authors: [{ name: "CollegeSphere Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#7c3aed",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <ChatbotProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
