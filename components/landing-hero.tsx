"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <div className="w-full bg-white py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Main content container */}
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
          {/* Logo and title section - reduce margin */}
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600 mb-1">CollegeSphere</h2>
            <p className="text-gray-500 text-center">Presents</p>
          </div>

          {/* Main title - reduce margin */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">College Predictor for 2025</h1>

          {/* Quote */}
          <p className="text-lg text-center text-gray-600 mb-4">
            "Lost in the JEE Main maze? Let's find your perfect college match! 🎯"
          </p>

          {/* CTA Button */}
          <Link href="/predict">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-4"
            >
              Find Your College Match
            </Button>
          </Link>

          {/* Free to start badge */}
          <div className="flex items-center justify-center mb-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 text-green-600 border border-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>100% Free to Start</span>
            </div>
          </div>

          {/* Trust indicators - reduce margin */}
          <div className="w-full max-w-md bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 shadow-sm border border-blue-100 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-100 rounded-full opacity-50"></div>
            <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-purple-100 rounded-full opacity-50"></div>

            <div className="flex flex-col items-center relative z-10">
              <div className="flex -space-x-4 mb-2">
                {/* Overlapping avatars with animated hover effect */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white flex items-center justify-center text-white font-bold transform transition-transform hover:scale-110 hover:-translate-y-1">
                  S
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white flex items-center justify-center text-white font-bold transform transition-transform hover:scale-110 hover:-translate-y-1">
                  A
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 border-2 border-white flex items-center justify-center text-white font-bold transform transition-transform hover:scale-110 hover:-translate-y-1">
                  R
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-white flex items-center justify-center text-white font-bold transform transition-transform hover:scale-110 hover:-translate-y-1">
                  P
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 border-2 border-white flex items-center justify-center text-white font-bold transform transition-transform hover:scale-110 hover:-translate-y-1">
                  K
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg transform transition-transform hover:scale-110 hover:-translate-y-1">
                  +4.7k
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-gray-700 font-medium text-center">4,732+ students secured their dream colleges</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer">
                  JEE Main
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors cursor-pointer">
                  JEE Advanced
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium hover:bg-green-200 transition-colors cursor-pointer">
                  BITSAT
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors cursor-pointer">
                  WBJEE
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium hover:bg-red-200 transition-colors cursor-pointer">
                  COMEDK
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium hover:bg-indigo-200 transition-colors cursor-pointer">
                  VITEEE
                </span>
              </div>
            </div>
          </div>

          {/* Made by alumni - reduce margin */}
          <div className="flex items-center justify-center mb-4 gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/220px-IIT_Kharagpur_Logo.svg.png"
              alt="IIT Kharagpur Logo"
              className="h-8 w-auto"
            />
            <p className="text-gray-600">Made by Alumni of IIT Kharagpur</p>
          </div>
        </div>
      </div>
    </div>
  )
}
