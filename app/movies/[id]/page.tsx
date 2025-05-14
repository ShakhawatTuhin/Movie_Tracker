import { getMovieDetails, getMovieCredits, getSimilarMovies } from "@/lib/tmdb"
import { MovieDetails } from "@/components/movie-details"
import { notFound } from "next/navigation"

export default async function MoviePage({ params }: { params: { id: string } }) {
  try {
    const movieId = Number.parseInt(params.id)
    const [movie, credits, similar] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getSimilarMovies(movieId),
    ])

    if (!movie) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <MovieDetails movie={movie} credits={credits} similar={similar.results.slice(0, 6)} />
      </div>
    )
  } catch (error) {
    console.error("Error loading movie:", error)
    notFound()
  }
}
