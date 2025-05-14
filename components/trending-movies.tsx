import Link from "next/link"
import Image from "next/image"
import type { Movie } from "@/types/tmdb"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface TrendingMoviesProps {
  movies: Movie[]
}

export default function TrendingMovies({ movies }: TrendingMoviesProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Trending Movies</h2>
        <Link href="/movies" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <Card className="overflow-hidden h-full transition-all hover:scale-105 hover:shadow-lg">
              <div className="aspect-[2/3] relative">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg?height=450&width=300"
                  }
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40vw, 20vw"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="flex items-center space-x-1 bg-black/70 hover:bg-black/70">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium line-clamp-1">{movie.title}</h3>
                <p className="text-xs text-muted-foreground">{movie.release_date?.split("-")[0] || "TBA"}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
