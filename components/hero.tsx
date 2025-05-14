"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase-provider"
import { cn } from "@/lib/utils"

interface HeroMovie {
  id: number
  title: string
  backdrop_path: string
  overview: string
}

const heroMovies: HeroMovie[] = [
  {
    id: 753342,
    title: "Napoleon",
    backdrop_path: "/uVpEd3OJRrHoSkqiTGrJHYNQZYF.jpg",
    overview:
      "An epic that details the checkered rise and fall of French Emperor Napoleon Bonaparte and his relentless journey to power through the prism of his addictive, volatile relationship with his wife, Josephine.",
  },
  {
    id: 872585,
    title: "Oppenheimer",
    backdrop_path: "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    overview:
      "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.",
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    backdrop_path: "/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    overview:
      "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse's very existence.",
  },
]

export default function Hero() {
  const { user } = useSupabase()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroMovies.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const currentMovie = heroMovies[currentIndex]

  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-xl">
      {heroMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0",
          )}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
        <div
          className={cn(
            "max-w-3xl space-y-4 transition-all duration-500",
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
          )}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white">{currentMovie.title}</h1>
          <p className="text-white/80 text-sm md:text-base line-clamp-3 md:line-clamp-2">{currentMovie.overview}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link href={`/movies/${currentMovie.id}`}>Watch Details</Link>
            </Button>
            {user && (
              <Button variant="outline" size="lg" className="bg-black/30 text-white border-white/20 hover:bg-black/50">
                Add to Watchlist
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroMovies.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-white w-6" : "bg-white/50",
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
