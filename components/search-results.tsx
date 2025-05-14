import Link from "next/link"
import Image from "next/image"
import type { SearchResults as SearchResultsType } from "@/types/tmdb"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Film, Tv, User } from "lucide-react"

interface SearchResultsProps {
  results: SearchResultsType
  currentQuery: string
  currentPage: number
}

export default function SearchResults({ results, currentQuery, currentPage }: SearchResultsProps) {
  const totalPages = results.total_pages > 20 ? 20 : results.total_pages

  return (
    <div className="space-y-8">
      <div className="text-sm text-muted-foreground">
        Found {results.total_results} results for &quot;{currentQuery}&quot;
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.results.map((item) => {
          if (item.media_type === "movie") {
            return (
              <Link key={item.id} href={`/movies/${item.id}`}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "/placeholder.svg?height=450&width=300"
                      }
                      alt={item.title || "Movie poster"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="flex items-center space-x-1 bg-black/70 hover:bg-black/70">
                        <Film className="h-3 w-3" />
                        <span>Movie</span>
                      </Badge>
                    </div>
                    {item.vote_average > 0 && (
                      <div className="absolute bottom-2 right-2">
                        <Badge className="flex items-center space-x-1 bg-black/70 hover:bg-black/70">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.release_date?.split("-")[0] || "TBA"}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          } else if (item.media_type === "tv") {
            return (
              <Link key={item.id} href={`/tv/${item.id}`}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "/placeholder.svg?height=450&width=300"
                      }
                      alt={item.name || "TV show poster"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="flex items-center space-x-1 bg-black/70 hover:bg-black/70">
                        <Tv className="h-3 w-3" />
                        <span>TV</span>
                      </Badge>
                    </div>
                    {item.vote_average > 0 && (
                      <div className="absolute bottom-2 right-2">
                        <Badge className="flex items-center space-x-1 bg-black/70 hover:bg-black/70">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.first_air_date?.split("-")[0] || "TBA"}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          } else if (item.media_type === "person") {
            return (
              <Link key={item.id} href={`/person/${item.id}`}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={
                        item.profile_path
                          ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                          : "/placeholder.svg?height=450&width=300"
                      }
                      alt={item.name || "Person"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="flex items-center space-x-1 bg-black/70 hover:bg-black/70">
                        <User className="h-3 w-3" />
                        <span>Person</span>
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                    {item.known_for_department && (
                      <p className="text-xs text-muted-foreground">{item.known_for_department}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          }
          return null
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {currentPage > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/search?query=${encodeURIComponent(currentQuery)}&page=${currentPage - 1}`}>Previous</Link>
              </Button>
            )}

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number

                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    asChild
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    className="w-9"
                  >
                    <Link href={`/search?query=${encodeURIComponent(currentQuery)}&page=${pageNum}`}>{pageNum}</Link>
                  </Button>
                )
              })}
            </div>

            {currentPage < totalPages && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/search?query=${encodeURIComponent(currentQuery)}&page=${currentPage + 1}`}>Next</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
