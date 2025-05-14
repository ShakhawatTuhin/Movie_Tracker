import Link from "next/link"
import Image from "next/image"
import type { TvShow } from "@/types/tmdb"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface TrendingShowsProps {
  shows: TvShow[]
}

export default function TrendingShows({ shows }: TrendingShowsProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Trending TV Shows</h2>
        <Link href="/tv" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shows.map((show) => (
          <Link key={show.id} href={`/tv/${show.id}`}>
            <Card className="overflow-hidden h-full transition-all hover:scale-105 hover:shadow-lg">
              <div className="aspect-[2/3] relative">
                <Image
                  src={
                    show.poster_path
                      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                      : "/placeholder.svg?height=450&width=300"
                  }
                  alt={show.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40vw, 20vw"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="flex items-center space-x-1 bg-black/70 hover:bg-black/70">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{show.vote_average?.toFixed(1) || "N/A"}</span>
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium line-clamp-1">{show.name}</h3>
                <p className="text-xs text-muted-foreground">{show.first_air_date?.split("-")[0] || "TBA"}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
