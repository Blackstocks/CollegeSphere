import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Desktop Footer */}
      <div className="container px-4 py-12 mx-auto hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
              About CollegeSphere
            </h3>
            <p className="text-gray-600 mb-4">
              CollegeSphere simplifies JEE Main college selection with AI-powered predictions and real-time cutoff data
              to help you find your perfect engineering college match.
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
                  Cancellation & Refund Policy
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
                  <Mail size={18} />
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
                  <Linkedin size={18} />
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
                  <MapPin size={18} />
                  Meghnad Saha Hall of Residence, IIT Kharagpur, West Mednipur - 721302
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-600 flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>© {currentYear} CollegeSphere. All rights reserved.</span>
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
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
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
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 text-blue-100 fill-current">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
              </svg>
            </div>
          </div>

          <div className="text-center relative z-10">
            <div className="flex justify-center mb-3">
              <img src="/images/collegespherelogo.png" alt="CollegeSphere Logo" className="h-8 md:h-10" />
            </div>

            <div className="flex justify-center space-x-5 mb-4">
              <a
                href="#"
                className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5 text-white hover:shadow-md transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5 text-white hover:shadow-md transition-all"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5 text-white hover:shadow-md transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/collegesphere"
                className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5 text-white hover:shadow-md transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
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

            <p className="text-sm text-gray-600 mb-2">© {currentYear} CollegeSphere. All rights reserved.</p>

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
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
  )
}

export default Footer
