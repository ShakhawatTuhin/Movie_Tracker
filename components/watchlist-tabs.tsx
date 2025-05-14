"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Film, X, Check, Clock, Pause, ThumbsUp } from "lucide-react"
import { useSupabase } from "@/lib/supabase-provider"
import { toast } from "@/components/ui/use-toast"
import type { MovieWatchlistItem, TvWatchlistItem, MovieRatingItem, TvRatingItem } from "@/types/user"

interface WatchlistTabsProps {
  movieWatchlist: MovieWatchlistItem[]
  tvWatchlist: TvWatchlistItem[]
  movieRatings: MovieRatingItem[]
  tvRatings: TvRatingItem[]
}

export default function WatchlistTabs({ movieWatchlist, tvWatchlist, movieRatings, tvRatings }: WatchlistTabsProps) {
  const { supabase } = useSupabase()
  const [activeMovieWatchlist, setActiveMovieWatchlist] = useState(movieWatchlist)
  const [activeTvWatchlist, setActiveTvWatchlist] = useState(tvWatchlist)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const updateMovieStatus = async (movieId: number, status: string) => {
    setIsUpdating(`movie-${movieId}`)

    try {
      const { error } = await supabase.from("movie_watchlist").update({ status }).eq("movie_id", movieId)

      if (error) throw error

      setActiveMovieWatchlist((prev) => prev.map((item) => (item.movie_id === movieId ? { ...item, status } : item)))

      toast({
        title: "Status updated",
        description: "Your watchlist has been updated",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const updateTvStatus = async (tvId: number, status: string) => {
    setIsUpdating(`tv-${tvId}`)

    try {
      const { error } = await supabase.from("tv_watchlist").update({ status }).eq("tv_id", tvId)

      if (error) throw error

      setActiveTvWatchlist((prev) => prev.map((item) => (item.tv_id === tvId ? { ...item, status } : item)))

      toast({
        title: "Status updated",
        description: "Your watchlist has been updated",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const removeFromMovieWatchlist = async (movieId: number) => {
    setIsUpdating(`movie-${movieId}`)

    try {
      const { error } = await supabase.from("movie_watchlist").delete().eq("movie_id", movieId)

      if (error) throw error

      setActiveMovieWatchlist((prev) => prev.filter((item) => item.movie_id !== movieId))

      toast({
        title: "Removed from watchlist",
        description: "The movie has been removed from your watchlist",
      })
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove from watchlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const removeFromTvWatchlist = async (tvId: number) => {
    setIsUpdating(`tv-${tvId}`)

    try {
      const { error } = await supabase.from("tv_watchlist").delete().eq("tv_id", tvId)

      if (error) throw error

      setActiveTvWatchlist((prev) => prev.filter((item) => item.tv_id !== tvId))

      toast({
        title: "Removed from watchlist",
        description: "The TV show has been removed from your watchlist",
      })
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove from watchlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "watching":
        return <Film className="h-4 w-4 text-blue-500" />
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />
      case "on_hold":
        return <Pause className="h-4 w-4 text-yellow-500" />
      case "dropped":
        return <X className="h-4 w-4 text-red-500" />
      case "plan_to_watch":
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "watching":
        return "Watching"
      case "completed":
        return "Completed"
      case "on_hold":
        return "On Hold"
      case "dropped":
        return "Dropped"
      case "plan_to_watch":
      default:
        return "Plan to Watch"
    }
  }

  return (
    <Tabs defaultValue="movies" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="movies">Movies Watchlist</TabsTrigger>
        <TabsTrigger value="tv">TV Shows Watchlist</TabsTrigger>
        <TabsTrigger value="movie-ratings">Movie Ratings</TabsTrigger>
        <TabsTrigger value="tv-ratings">TV Show Ratings</TabsTrigger>
      </TabsList>

      <TabsContent value="movies" className="mt-6">
        {activeMovieWatchlist.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Your movie watchlist is empty</h3>
            <p className="text-muted-foreground mb-4">Start adding movies to keep track of what you want to watch</p>
            <Button asChild>
              <Link href="/movies">Browse Movies</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMovieWatchlist.map((item) => (
              <Card key={item.movie_id} className="flex overflow-hidden">
                <div className="w-1/3 relative">
                  <Link href={`/movies/${item.movie_id}`}>
                    <Image
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "/placeholder.svg?height=450&width=300"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </div>
                <CardContent className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link href={`/movies/${item.movie_id}`} className="hover:underline">
                        <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      </Link>
                      <Badge className="flex items-center space-x-1">
                        {getStatusIcon(item.status)}
                        <span>{getStatusLabel(item.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.release_date?.split("-")[0] || "TBA"}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Select
                      defaultValue={item.status}
                      onValueChange={(value) => updateMovieStatus(item.movie_id, value)}
                      disabled={isUpdating === `movie-${item.movie_id}`}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plan_to_watch">Plan to Watch</SelectItem>
                        <SelectItem value="watching">Watching</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromMovieWatchlist(item.movie_id)}
                      disabled={isUpdating === `movie-${item.movie_id}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="tv" className="mt-6">
        {activeTvWatchlist.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Your TV show watchlist is empty</h3>
            <p className="text-muted-foreground mb-4">Start adding TV shows to keep track of what you want to watch</p>
            <Button asChild>
              <Link href="/tv">Browse TV Shows</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTvWatchlist.map((item) => (
              <Card key={item.tv_id} className="flex overflow-hidden">
                <div className="w-1/3 relative">
                  <Link href={`/tv/${item.tv_id}`}>
                    <Image
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "/placeholder.svg?height=450&width=300"
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </div>
                <CardContent className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link href={`/tv/${item.tv_id}`} className="hover:underline">
                        <h3 className="font-medium line-clamp-1">{item.name}</h3>
                      </Link>
                      <Badge className="flex items-center space-x-1">
                        {getStatusIcon(item.status)}
                        <span>{getStatusLabel(item.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.first_air_date?.split("-")[0] || "TBA"}
                      {item.number_of_seasons &&
                        ` • ${item.number_of_seasons} season${item.number_of_seasons !== 1 ? "s" : ""}`}
                    </p>
                    {item.status === "watching" && (
                      <p className="text-xs mt-2">
                        <span className="font-medium">Current episode:</span> {item.current_episode || 1}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Select
                      defaultValue={item.status}
                      onValueChange={(value) => updateTvStatus(item.tv_id, value)}
                      disabled={isUpdating === `tv-${item.tv_id}`}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plan_to_watch">Plan to Watch</SelectItem>
                        <SelectItem value="watching">Watching</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromTvWatchlist(item.tv_id)}
                      disabled={isUpdating === `tv-${item.tv_id}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="movie-ratings" className="mt-6">
        {movieRatings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">You haven't rated any movies yet</h3>
            <p className="text-muted-foreground mb-4">
              Rate movies to keep track of your opinions and get better recommendations
            </p>
            <Button asChild>
              <Link href="/movies">Browse Movies</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {movieRatings.map((item) => (
              <Card key={item.movie_id} className="flex overflow-hidden">
                <div className="w-1/3 relative">
                  <Link href={`/movies/${item.movie_id}`}>
                    <Image
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "/placeholder.svg?height=450&width=300"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </div>
                <CardContent className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link href={`/movies/${item.movie_id}`} className="hover:underline">
                        <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      </Link>
                      <Badge className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{item.rating}/10</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.release_date?.split("-")[0] || "TBA"}</p>
                    {item.review && (
                      <p className="text-sm mt-2 line-clamp-2 italic text-muted-foreground">"{item.review}"</p>
                    )}
                  </div>

                  <div className="flex justify-end items-center mt-4">
                    <Button asChild variant="ghost" size="sm" className="gap-2">
                      <Link href={`/movies/${item.movie_id}`}>
                        <ThumbsUp className="h-4 w-4" />
                        <span>Edit Rating</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="tv-ratings" className="mt-6">
        {tvRatings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">You haven't rated any TV shows yet</h3>
            <p className="text-muted-foreground mb-4">
              Rate TV shows to keep track of your opinions and get better recommendations
            </p>
            <Button asChild>
              <Link href="/tv">Browse TV Shows</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tvRatings.map((item) => (
              <Card key={item.tv_id} className="flex overflow-hidden">
                <div className="w-1/3 relative">
                  <Link href={`/tv/${item.tv_id}`}>
                    <Image
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "/placeholder.svg?height=450&width=300"
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </div>
                <CardContent className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link href={`/tv/${item.tv_id}`} className="hover:underline">
                        <h3 className="font-medium line-clamp-1">{item.name}</h3>
                      </Link>
                      <Badge className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{item.rating}/10</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.first_air_date?.split("-")[0] || "TBA"}
                      {item.number_of_seasons &&
                        ` • ${item.number_of_seasons} season${item.number_of_seasons !== 1 ? "s" : ""}`}
                    </p>
                    {item.review && (
                      <p className="text-sm mt-2 line-clamp-2 italic text-muted-foreground">"{item.review}"</p>
                    )}
                  </div>

                  <div className="flex justify-end items-center mt-4">
                    <Button asChild variant="ghost" size="sm" className="gap-2">
                      <Link href={`/tv/${item.tv_id}`}>
                        <ThumbsUp className="h-4 w-4" />
                        <span>Edit Rating</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
