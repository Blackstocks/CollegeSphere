"use client"

import { useState, useEffect } from "react"

const collegeImages = [
  {
    name: "IIT Madras",
    state: "Tamil Nadu",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iitmadras-IPzlEC1FtMq0jGaGqhhGop4him8pVV.jpeg",
    nirf: "Rank #1",
  },
  {
    name: "IIT Delhi",
    state: "New Delhi",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IITdelhi.jpg-m8qKgC6Pd79zh62j5w3MlPD6rZ8WCv.jpeg",
    nirf: "Rank #2",
  },
  {
    name: "IIT Bombay",
    state: "Maharashtra",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iitbombay.jpg-1IV4KITpsdKy8armgpBoLrkgXgRd3E.jpeg",
    nirf: "Rank #3",
  },
  {
    name: "IIT Kharagpur",
    state: "West Bengal",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iitkharagpur.jpg-fewxa7dVpHJCeXYyJgdTj38P670BIK.jpeg",
    nirf: "Rank #5",
  },
  {
    name: "NIT Trichy",
    state: "Tamil Nadu",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nit_trichy.jpg-9CyAyqofNpOpyf9DuRFOYqy3Gey0XX.jpeg",
    nirf: "Rank #9",
  },
  {
    name: "NIT Surathkal",
    state: "Karnataka",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nitsuratkal-elSqUtOzjBrUpO5Ux1kdjDVXxlaogR.webp",
    nirf: "Rank #10",
  },
]

export function CollegeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % collegeImages.length)
    }, 1500) // Changed to 1.5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {collegeImages.map((college, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={college.image || "/placeholder.svg"}
                  alt={college.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white font-bold text-xl md:text-2xl">{college.name}</p>
                      <p className="text-white/90 text-base">{college.state}</p>
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-sm">{college.nirf}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
