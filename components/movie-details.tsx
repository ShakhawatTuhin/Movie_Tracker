"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import type { MovieDetails as MovieDetailsType, Credits, Movie } from "@/types/tmdb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Star, Clock, Calendar, Plus, Check, PlayCircle, ThumbsUp } from "lucide-react"
import { formatRuntime, formatCurrency } from "@/lib/utils"
import RatingDialog from "@/components/rating-dialog"

interface MovieDetailsProps {
  movie: MovieDetailsType
  credits: Credits
  similar: Movie[]
}

export function MovieDetails({ movie, credits, similar }: MovieDetailsProps) {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false)
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add movies to your watchlist",
      })
      router.push("/login")
      return
    }

    setIsAddingToWatchlist(true)

    try {
      // First, ensure the movie exists in our database
      const { error: movieError } = await supabase.from("movies").upsert({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genres: movie.genres.map((g) => g.name),
        popularity: movie.popularity,
      })

      if (movieError) throw movieError

      // Then add to watchlist
      const { error: watchlistError } = await supabase.from("movie_watchlist").upsert({
        user_id: user.id,
        movie_id: movie.id,
        status: "plan_to_watch",
      })

      if (watchlistError) throw watchlistError

      setIsInWatchlist(true)
      toast({
        title: "Added to watchlist",
        description: `${movie.title} has been added to your watchlist`,
      })
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to add to watchlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToWatchlist(false)
    }
  }

  const handleRateMovie = async (rating: number, review = "") => {
    if (!user) return

    try {
      // First, ensure the movie exists in our database
      const { error: movieError } = await supabase.from("movies").upsert({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genres: movie.genres.map((g) => g.name),
        popularity: movie.popularity,
      })

      if (movieError) throw movieError

      // Then add the rating
      const { error: ratingError } = await supabase.from("movie_ratings").upsert({
        user_id: user.id,
        movie_id: movie.id,
        rating,
        review,
      })

      if (ratingError) throw ratingError

      toast({
        title: "Rating submitted",
        description: `You rated ${movie.title} ${rating}/10`,
      })
      setIsRatingDialogOpen(false)
    } catch (error) {
      console.error("Error rating movie:", error)
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get director
  const director = credits.crew.find((person) => person.job === "Director")

  // Get top cast
  const topCast = credits.cast.slice(0, 6)

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden rounded-xl">
        <Image
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : "/placeholder.svg?height=1080&width=1920"
          }
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row gap-6">
          <div className="hidden md:block shrink-0">
            <Image
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder.svg?height=450&width=300"
              }
              alt={movie.title}
              width={200}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>

            <div className="flex flex-wrap gap-2 items-center text-sm">
              {movie.release_date && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}

              {movie.runtime > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                </>
              )}

              {movie.vote_average > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="outline">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground line-clamp-3 md:line-clamp-none">{movie.overview}</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Watch Trailer
              </Button>

              {!isInWatchlist ? (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleAddToWatchlist}
                  disabled={isAddingToWatchlist}
                >
                  {isAddingToWatchlist ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
              ) : (
                <Button variant="outline" className="gap-2" disabled>
                  <Check className="h-4 w-4" />
                  In Watchlist
                </Button>
              )}

              <Button variant="ghost" className="gap-2" onClick={() => setIsRatingDialogOpen(true)}>
                <ThumbsUp className="h-4 w-4" />
                Rate
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile poster */}
      <div className="md:hidden flex justify-center">
        <Image
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder.svg?height=450&width=300"
          }
          alt={movie.title}
          width={180}
          height={270}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
          <TabsTrigger value="similar">Similar</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
              <p className="text-muted-foreground">{movie.overview}</p>

              {director && (
                <div className="mt-4">
                  <span className="font-medium">Director:</span>{" "}
                  <span className="text-muted-foreground">{director.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Release Date</h4>
                  <p className="text-muted-foreground">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Runtime</h4>
                  <p className="text-muted-foreground">{movie.runtime ? formatRuntime(movie.runtime) : "Unknown"}</p>
                </div>

                {movie.budget > 0 && (
                  <div>
                    <h4 className="font-medium">Budget</h4>
                    <p className="text-muted-foreground">{formatCurrency(movie.budget)}</p>
                  </div>
                )}

                {movie.revenue > 0 && (
                  <div>
                    <h4 className="font-medium">Revenue</h4>
                    <p className="text-muted-foreground">{formatCurrency(movie.revenue)}</p>
                  </div>
                )}

                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="col-span-2">
                    <h4 className="font-medium">Production</h4>
                    <p className="text-muted-foreground">{movie.production_companies.map((c) => c.name).join(", ")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cast" className="pt-4">
          <h3 className="text-xl font-semibold mb-4">Top Cast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topCast.map((person) => (
              <div key={person.id} className="text-center">
                <div className="aspect-[2/3] relative mb-2 rounded-lg overflow-hidden">
                  <Image
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                        : "/placeholder.svg?height=300&width=200"
                    }
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-medium line-clamp-1">{person.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <h3 className="text-xl font-semibold mb-4">Crew</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {credits.crew
              .filter((person) => ["Director", "Producer", "Screenplay", "Writer"].includes(person.job))
              .slice(0, 6)
              .map((person) => (
                <div key={`${person.id}-${person.job}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden">
                    <Image
                      src={
                        person.profile_path
                          ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                          : "/placeholder.svg?height=200&width=200"
                      }
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{person.name}</h4>
                    <p className="text-xs text-muted-foreground">{person.job}</p>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="similar" className="pt-4">
          <h3 className="text-xl font-semibold mb-4">Similar Movies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similar.map((movie) => (
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
        </TabsContent>
      </Tabs>

      <RatingDialog
        open={isRatingDialogOpen}
        onOpenChange={setIsRatingDialogOpen}
        onSubmit={handleRateMovie}
        title={movie.title}
        type="movie"
      />
    </div>
  )
}
