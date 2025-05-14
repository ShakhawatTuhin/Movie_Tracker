import { createServerClient } from "@/lib/supabase-server"
import type { MovieWatchlistItem, TvWatchlistItem, MovieRatingItem, TvRatingItem } from "@/types/user"

// Get user's movie watchlist
export async function getUserWatchlists(userId: string, type: "movie" | "tv") {
  const supabase = createServerClient()

  if (type === "movie") {
    const { data, error } = await supabase
      .from("movie_watchlist")
      .select(`
        *,
        movies:movie_id (
          id,
          title,
          poster_path,
          backdrop_path,
          release_date,
          vote_average
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching movie watchlist:", error)
      return []
    }

    return data.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      movie_id: item.movie_id,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at,
      title: item.movies.title,
      poster_path: item.movies.poster_path,
      backdrop_path: item.movies.backdrop_path,
      release_date: item.movies.release_date,
      vote_average: item.movies.vote_average,
    })) as MovieWatchlistItem[]
  } else {
    const { data, error } = await supabase
      .from("tv_watchlist")
      .select(`
        *,
        tv_shows:tv_id (
          id,
          name,
          poster_path,
          backdrop_path,
          first_air_date,
          vote_average,
          number_of_seasons
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching TV watchlist:", error)
      return []
    }

    return data.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      tv_id: item.tv_id,
      status: item.status,
      current_episode: item.current_episode,
      created_at: item.created_at,
      updated_at: item.updated_at,
      name: item.tv_shows.name,
      poster_path: item.tv_shows.poster_path,
      backdrop_path: item.tv_shows.backdrop_path,
      first_air_date: item.tv_shows.first_air_date,
      vote_average: item.tv_shows.vote_average,
      number_of_seasons: item.tv_shows.number_of_seasons,
    })) as TvWatchlistItem[]
  }
}

// Get user's ratings
export async function getUserRatings(userId: string, type: "movie" | "tv") {
  const supabase = createServerClient()

  if (type === "movie") {
    const { data, error } = await supabase
      .from("movie_ratings")
      .select(`
        *,
        movies:movie_id (
          id,
          title,
          poster_path,
          backdrop_path,
          release_date,
          vote_average
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching movie ratings:", error)
      return []
    }

    return data.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      movie_id: item.movie_id,
      rating: item.rating,
      review: item.review,
      created_at: item.created_at,
      updated_at: item.updated_at,
      title: item.movies.title,
      poster_path: item.movies.poster_path,
      backdrop_path: item.movies.backdrop_path,
      release_date: item.movies.release_date,
      vote_average: item.movies.vote_average,
    })) as MovieRatingItem[]
  } else {
    const { data, error } = await supabase
      .from("tv_ratings")
      .select(`
        *,
        tv_shows:tv_id (
          id,
          name,
          poster_path,
          backdrop_path,
          first_air_date,
          vote_average,
          number_of_seasons
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching TV ratings:", error)
      return []
    }

    return data.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      tv_id: item.tv_id,
      rating: item.rating,
      review: item.review,
      created_at: item.created_at,
      updated_at: item.updated_at,
      name: item.tv_shows.name,
      poster_path: item.tv_shows.poster_path,
      backdrop_path: item.tv_shows.backdrop_path,
      first_air_date: item.tv_shows.first_air_date,
      vote_average: item.tv_shows.vote_average,
      number_of_seasons: item.tv_shows.number_of_seasons,
    })) as TvRatingItem[]
  }
}

// Get personalized recommendations for a user
export async function getPersonalizedRecommendations(userId: string) {
  // This would be a more complex function that:
  // 1. Gets the user's watchlist and ratings
  // 2. Finds similar content based on what they've watched and liked
  // 3. Returns a curated list of recommendations

  // For now, we'll return a simple implementation
  const supabase = createServerClient()

  // Get the user's top rated movies
  const { data: topRatedMovies } = await supabase
    .from("movie_ratings")
    .select("movie_id, rating")
    .eq("user_id", userId)
    .order("rating", { ascending: false })
    .limit(5)

  // Get recommendations based on those movies
  // This is a simplified version - a real recommendation engine would be more sophisticated
  if (topRatedMovies && topRatedMovies.length > 0) {
    const recommendationPromises = topRatedMovies.map((movie) =>
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.movie_id}/recommendations?api_key=${process.env.TMDB_API_KEY || "3e837d475d293d67a85682d31a1a738b"}`,
      ).then((res) => res.json()),
    )

    const recommendationsResults = await Promise.all(recommendationPromises)

    // Combine and deduplicate recommendations
    const allRecommendations = recommendationsResults.flatMap((result) => result.results || [])
    const uniqueRecommendations = Array.from(new Map(allRecommendations.map((item) => [item.id, item])).values())

    return uniqueRecommendations.slice(0, 10)
  }

  // Fallback to trending if no personalized recommendations
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_API_KEY || "3e837d475d293d67a85682d31a1a738b"}`,
    { next: { revalidate: 60 * 60 } },
  )
  const data = await response.json()

  return data.results
}
