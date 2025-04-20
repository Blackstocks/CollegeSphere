"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Award, Users, BookOpen, Globe, ArrowRight, CheckCircle } from "lucide-react"
import { CollegeCarousel } from "@/components/college-carousel"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 animate-gradient">
              Lost in the JEE Main maze? <br className="hidden sm:block" />
              Let's find your perfect college match! 🎯
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-gray-600">
              Say goodbye to college selection stress and hello to your dream engineering future!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/predict">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Find Your College Match <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="text-green-500" />
                <span className="text-gray-700">100% Free to Start</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College Carousel Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Top Engineering Colleges
          </h2>
          <CollegeCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative">
        <div className="absolute top-0 right-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>

        {/* Floating infographics */}
        <div className="absolute left-5 top-1/4 w-16 h-16 bg-blue-100 rounded-lg shadow-md transform rotate-12 animate-float">
          <div className="flex items-center justify-center h-full text-blue-500 font-bold text-xl">IIT</div>
        </div>
        <div className="absolute right-10 top-1/3 w-16 h-16 bg-purple-100 rounded-lg shadow-md transform -rotate-6 animate-float animation-delay-1000">
          <div className="flex items-center justify-center h-full text-purple-500 font-bold text-xl">NIT</div>
        </div>
        <div className="absolute left-1/4 bottom-1/4 w-16 h-16 bg-cyan-100 rounded-lg shadow-md transform rotate-3 animate-float animation-delay-2000">
          <div className="flex items-center justify-center h-full text-cyan-500 font-bold text-xl">IIIT</div>
        </div>

        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4">
            Why Choose CollegeSphere?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-6">
            {[
              {
                icon: <Target className="w-8 h-8 text-purple-500" />,
                title: "AI-Powered Predictions",
                description:
                  "Our advanced algorithm ensures spot-on college recommendations based on your JEE Main rank, preferences, and historical data.",
                gradient: "from-purple-500 to-indigo-500",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
                title: "Real-time Cutoff Data",
                description:
                  "Stay updated with the latest cutoff trends from top engineering colleges across India, updated in real-time.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <Award className="w-8 h-8 text-amber-500" />,
                title: "Detailed Placement Stats",
                description:
                  "Make informed decisions with comprehensive placement statistics for each engineering branch and college.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: <Users className="w-8 h-8 text-green-500" />,
                title: "Personalized Guidance",
                description:
                  "Get tailored advice from our community of successful engineering graduates and industry experts.",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: <BookOpen className="w-8 h-8 text-cyan-500" />,
                title: "Comprehensive College Profiles",
                description:
                  "Access detailed information about each college, including facilities, faculty, research opportunities, and student life.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: <Globe className="w-8 h-8 text-teal-500" />,
                title: "Pan-India College Database",
                description:
                  "Explore a vast database of engineering colleges from all over India, including IITs, NITs, and state universities.",
                gradient: "from-teal-500 to-cyan-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 card-hover bg-white"
              >
                <div className="mb-4 bg-gradient-to-br from-white to-gray-50 p-3 rounded-full w-14 h-14 flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <style jsx global>{`
  @keyframes marquee-left-fast {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
  
  @keyframes marquee-right-fast {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
  }
  
  .animate-marquee-left-fast {
    animation: marquee-left-fast 15s linear infinite;
  }
  
  .animate-marquee-right-fast {
    animation: marquee-right-fast 15s linear infinite;
  }
`}</style>
        <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] bg-center opacity-5"></div>
        <div className="container px-4 mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            What Our Students Say
          </h2>
        </div>

        {/* First row - left to right */}
        <div className="relative w-full overflow-hidden mb-8">
          <div className="animate-marquee-left-fast flex gap-6 whitespace-nowrap">
            {[
              {
                quote: "CollegeSphere helped me find my perfect branch at IIT Bombay. Forever grateful!",
                name: "Arjun Mehta",
                college: "IIT Bombay, CSE",
                year: "2024",
              },
              {
                quote: "The predictions were spot on! Got into my dream college thanks to CollegeSphere.",
                name: "Priya Sharma",
                college: "IIT Delhi, Electrical",
                year: "2024",
              },
              {
                quote: "The college comparison feature saved me hours of research. Highly recommend!",
                name: "Rahul Singh",
                college: "NIT Trichy, Mechanical",
                year: "2024",
              },
              {
                quote: "Without CollegeSphere, I would have missed out on IIIT Hyderabad. Best decision ever!",
                name: "Ananya Gupta",
                college: "IIIT Hyderabad, CSE",
                year: "2024",
              },
              {
                quote: "The cutoff predictions were incredibly accurate. Got exactly what was predicted!",
                name: "Vikram Patel",
                college: "IIT Madras, Aerospace",
                year: "2024",
              },
              {
                quote: "CollegeSphere's personalized recommendations matched my interests perfectly.",
                name: "Neha Reddy",
                college: "BITS Pilani, Electronics",
                year: "2024",
              },
            ].map((testimonial, index) => (
              <div
                key={`left-${index}`}
                className="flex-shrink-0 w-80 min-w-[280px] p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm border border-gray-100 flex flex-col"
              >
                <p className="text-gray-700 mb-3 italic text-sm line-clamp-4 flex-grow">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-800 truncate">{testimonial.name}</div>
                  <div className="text-sm text-purple-600 truncate">
                    {testimonial.college} • {testimonial.year}
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              {
                quote: "CollegeSphere helped me find my perfect branch at IIT Bombay. Forever grateful!",
                name: "Arjun Mehta",
                college: "IIT Bombay, CSE",
                year: "2024",
              },
              {
                quote: "The predictions were spot on! Got into my dream college thanks to CollegeSphere.",
                name: "Priya Sharma",
                college: "IIT Delhi, Electrical",
                year: "2024",
              },
              {
                quote: "The college comparison feature saved me hours of research. Highly recommend!",
                name: "Rahul Singh",
                college: "NIT Trichy, Mechanical",
                year: "2024",
              },
              {
                quote: "Without CollegeSphere, I would have missed out on IIIT Hyderabad. Best decision ever!",
                name: "Ananya Gupta",
                college: "IIIT Hyderabad, CSE",
                year: "2024",
              },
              {
                quote: "The cutoff predictions were incredibly accurate. Got exactly what was predicted!",
                name: "Vikram Patel",
                college: "IIT Madras, Aerospace",
                year: "2024",
              },
              {
                quote: "CollegeSphere's personalized recommendations matched my interests perfectly.",
                name: "Neha Reddy",
                college: "BITS Pilani, Electronics",
                year: "2024",
              },
            ].map((testimonial, index) => (
              <div
                key={`left-dup-${index}`}
                className="flex-shrink-0 w-80 min-w-[280px] p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm border border-gray-100 flex flex-col"
              >
                <p className="text-gray-700 mb-3 italic text-sm line-clamp-4 flex-grow">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-800 truncate">{testimonial.name}</div>
                  <div className="text-sm text-purple-600 truncate">
                    {testimonial.college} • {testimonial.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second row - right to left */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-right-fast flex gap-6 whitespace-nowrap">
            {[
              {
                quote: "The one-on-one counseling session was a game-changer for my college selection.",
                name: "Karthik Iyer",
                college: "IIT Kanpur, Chemical",
                year: "2024",
              },
              {
                quote: "I was confused between NITs and IIITs. CollegeSphere's comparison tools cleared all my doubts.",
                name: "Shreya Joshi",
                college: "IIIT Delhi, CSE",
                year: "2024",
              },
              {
                quote: "The placement statistics helped me choose a college with great career prospects.",
                name: "Aditya Kumar",
                college: "NIT Warangal, ECE",
                year: "2024",
              },
              {
                quote: "From JEE rank to college admission, CollegeSphere guided me through every step!",
                name: "Tanvi Desai",
                college: "IIT Roorkee, Civil",
                year: "2024",
              },
              {
                quote: "The branch predictor tool was incredibly accurate. Got exactly what I was hoping for!",
                name: "Rohan Malhotra",
                college: "IIT Guwahati, Mechanical",
                year: "2024",
              },
              {
                quote: "CollegeSphere's insights into campus life helped me make the right choice for my personality.",
                name: "Meera Krishnan",
                college: "NIT Surathkal, IT",
                year: "2024",
              },
            ].map((testimonial, index) => (
              <div
                key={`right-${index}`}
                className="flex-shrink-0 w-80 min-w-[280px] p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm border border-gray-100 flex flex-col"
              >
                <p className="text-gray-700 mb-3 italic text-sm line-clamp-4 flex-grow">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-800 truncate">{testimonial.name}</div>
                  <div className="text-sm text-blue-600 truncate">
                    {testimonial.college} • {testimonial.year}
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              {
                quote: "The one-on-one counseling session was a game-changer for my college selection.",
                name: "Karthik Iyer",
                college: "IIT Kanpur, Chemical",
                year: "2024",
              },
              {
                quote: "I was confused between NITs and IIITs. CollegeSphere's comparison tools cleared all my doubts.",
                name: "Shreya Joshi",
                college: "IIIT Delhi, CSE",
                year: "2024",
              },
              {
                quote: "The placement statistics helped me choose a college with great career prospects.",
                name: "Aditya Kumar",
                college: "NIT Warangal, ECE",
                year: "2024",
              },
              {
                quote: "From JEE rank to college admission, CollegeSphere guided me through every step!",
                name: "Tanvi Desai",
                college: "IIT Roorkee, Civil",
                year: "2024",
              },
              {
                quote: "The branch predictor tool was incredibly accurate. Got exactly what I was hoping for!",
                name: "Rohan Malhotra",
                college: "IIT Guwahati, Mechanical",
                year: "2024",
              },
              {
                quote: "CollegeSphere's insights into campus life helped me make the right choice for my personality.",
                name: "Meera Krishnan",
                college: "NIT Surathkal, IT",
                year: "2024",
              },
            ].map((testimonial, index) => (
              <div
                key={`right-dup-${index}`}
                className="flex-shrink-0 w-80 min-w-[280px] p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm border border-gray-100 flex flex-col"
              >
                <p className="text-gray-700 mb-3 italic text-sm line-clamp-4 flex-grow">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-800 truncate">{testimonial.name}</div>
                  <div className="text-sm text-blue-600 truncate">
                    {testimonial.college} • {testimonial.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Life Section */}
      <section className="py-20 bg-gray-50 relative">
        <div className="absolute inset-0 bg-[url('/dots-pattern.svg')] bg-center opacity-5"></div>
        <div className="container px-4 pl-8 ml-[20%] mr-[5%] max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video order-2 md:order-1">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg"></div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iitkharagpur.jpg-fewxa7dVpHJCeXYyJgdTj38P670BIK.jpeg"
                alt="IIT Kharagpur Campus"
                className="rounded-lg object-cover w-full h-full shadow-lg"
              />
              {/* Culture and Legacy Bubbles */}

              <div className="absolute top-1/4 -right-3 w-20 h-20 bg-purple-100 rounded-full shadow-lg flex items-center justify-center animate-float animation-delay-1000 text-center">
                <div className="text-purple-600 font-medium text-xs px-1">
                  Kgpian
                  <br />
                  Spirit
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-green-100 rounded-full shadow-lg flex items-center justify-center animate-float animation-delay-2000 text-center">
                <div className="text-green-600 font-medium text-xs px-1">
                  Spring Fest
                  <br />
                  Cultural Legacy
                </div>
              </div>
              <div className="absolute bottom-1/3 -left-3 w-20 h-20 bg-amber-100 rounded-full shadow-lg flex items-center justify-center animate-float animation-delay-3000 text-center">
                <div className="text-amber-600 font-medium text-xs px-1">
                  Kshitij
                  <br />
                  Tech Fest
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                Life at IIT Kharagpur
              </Badge>
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                More Than Just Studies
              </h2>
              <p className="text-gray-600 mb-6">
                Life at IIT Kharagpur is a vibrant tapestry of academic rigor and cultural richness. From the legendary
                hall competitions to the sprawling campus that feels like a mini-city, KGP offers an unparalleled
                college experience that shapes future leaders and innovators.
              </p>
              <ul className="space-y-4">
                {[
                  "Hall culture with more than 22 halls each having unique traditions",
                  "Spring Fest and Kshitij - among India's largest college festivals",
                  "50+ student clubs from robotics to music and photography",
                  "Largest campus among all IITs with its own hospital and market",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 relative">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] bg-center opacity-10"></div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect College Match?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of students who have found their dream engineering colleges through CollegeSphere's
            AI-powered predictions.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        {/* Desktop Footer */}
        <div className="container px-4 py-12 mx-auto hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                About CollegeSphere
              </h3>
              <p className="text-gray-600 mb-4">
                CollegeSphere simplifies JEE Main college selection with AI-powered predictions and real-time cutoff
                data to help you find your perfect engineering college match.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-purple-600 transition-colors">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/cancellation-policy" className="text-gray-600 hover:text-purple-600 transition-colors">
                    Cancellation &amp; Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-600 hover:text-purple-600 transition-colors">
                    Register
                  </Link>
                  {" / "}
                  <Link href="/login" className="text-gray-600 hover:text-purple-600 transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <span className="text-gray-600">
                    Newsletter <span className="text-xs text-gray-500">(Coming Soon)</span>
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:collegesphere25@gmail.com"
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-mail"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    collegesphere25@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/collegesphere"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-linkedin"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.google.com/?q=Meghnad+Saha+Hall+of+Residence,+IIT+Kharagpur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-map-pin"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Meghnad Saha Hall of Residence, IIT Kharagpur, West Mednipur - 721302
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-600 flex flex-col sm:flex-row justify-center items-center gap-2">
            <span>© 2025 CollegeSphere. All rights reserved.</span>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">|</span>
              <span className="flex items-center">
                Made with
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#ef4444"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-heart mx-1"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                in India
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Blob Footer */}
        <div className="md:hidden relative">
          {/* Wave shape at the top */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform translate-y-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block h-12 w-full"
              style={{ transform: "rotateY(180deg)" }}
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.2c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="bg-white pt-10 pb-6 px-4 relative overflow-hidden">
            {/* Decorative wavy background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
              <div className="absolute -top-24 -left-10 w-72 h-72 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
              <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"></div>
              <div className="absolute bottom-0 left-0 right-0">
                <svg
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                  className="w-full h-20 text-blue-100 fill-current"
                >
                  <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
              </div>
            </div>

            <div className="text-center relative z-10">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Connect with us!</h3>

              <div className="flex justify-center space-x-5 mb-4">
                <a
                  href="#"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5 text-white hover:shadow-md transition-all"
                  aria-label="Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5 text-white hover:shadow-md transition-all"
                  aria-label="Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5 text-white hover:shadow-md transition-all"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/collegesphere"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5 text-white hover:shadow-md transition-all"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3 text-sm mx-auto max-w-xs">
                <Link href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cancellation-policy" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Cancellation Policy
                </Link>
                <Link href="/register" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Register/Login
                </Link>
              </div>

              <p className="text-sm text-gray-600 mb-2">© 2025 CollegeSphere. All rights reserved.</p>

              <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  Made with
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#ef4444"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-1"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  in India
                </span>
              </div>

              <div className="text-sm text-gray-600">
                <p>Email: collegesphere25@gmail.com</p>
                <p className="mt-1">IIT Kharagpur, West Mednipur - 721302</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
