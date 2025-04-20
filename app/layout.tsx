import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ChatbotProvider } from "./chatbot-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CollegeSphere - #1 JEE Main College Predictor 2025 | Find Your Dream Engineering College",
  description:
    "Get accurate JEE Main college predictions based on latest JOSAA 2025 counseling data. Explore 100+ engineering colleges, detailed branch insights, and personalized mentorship from IITians. Make informed decisions about your engineering future with 99% accuracy!",
  keywords:
    "JEE Main college predictor, engineering college predictor, IIT JEE, NIT, IIIT, GFTI, JOSAA counseling 2025, JEE rank predictor, college admission predictor, engineering branches, college cutoffs, JEE Main 2025, JEE Advanced 2025, best engineering colleges in India, IIT admission, NIT admission",
  openGraph: {
    title: "CollegeSphere - #1 JEE Main College Predictor 2025 | Find Your Dream Engineering College",
    description:
      "AI-powered college predictions based on latest JOSAA 2025 data. Explore 100+ engineering colleges, detailed branch insights, and get personalized mentorship from IITians. Plan your engineering future with confidence!",
    url: "https://collegesphere.vercel.app",
    siteName: "CollegeSphere",
    images: [
      {
        url: "https://collegesphere.vercel.app/images/mainlogo.png",
        width: 800,
        height: 800,
        alt: "CollegeSphere Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegeSphere - #1 JEE Main College Predictor 2025",
    description:
      "AI-powered college predictions based on latest JOSAA 2025 data. Find your dream engineering college with 99% accuracy!",
    images: ["https://collegesphere.vercel.app/images/mainlogo.png"],
    creator: "@collegesphere",
    site: "@collegesphere",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://collegesphere.vercel.app",
  },
  icons: {
    icon: "/images/mainlogo.png",
    shortcut: "/images/mainlogo.png",
    apple: "/images/mainlogo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/images/mainlogo.png",
    },
  },
  authors: [{ name: "CollegeSphere Team", url: "https://collegesphere.vercel.app" }],
  creator: "CollegeSphere Team",
  publisher: "CollegeSphere",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://collegesphere.vercel.app"),
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#7c3aed",
  category: "education",
  verification: {
    google: "verification_token",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://collegesphere.vercel.app" />
        <meta name="google-site-verification" content="verification_token" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <ChatbotProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
