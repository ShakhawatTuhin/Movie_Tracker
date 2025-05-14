import Hero from "@/components/hero"
import TrendingMovies from "@/components/trending-movies"
import TrendingShows from "@/components/trending-shows"
import GenreShowcase from "@/components/genre-showcase"
import { getTrendingMovies, getTrendingShows, getMoviesByGenre } from "@/lib/tmdb"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default async function Home() {
  try {
    const [trendingMovies, trendingShows, actionMovies, comedyMovies, dramaMovies] = await Promise.all([
      getTrendingMovies(),
      getTrendingShows(),
      getMoviesByGenre(28), // Action genre ID
      getMoviesByGenre(35), // Comedy genre ID
      getMoviesByGenre(18), // Drama genre ID
    ])

    const showApiWarning = !process.env.TMDB_API_KEY

    return (
      <div className="container mx-auto px-4 py-8">
        {showApiWarning && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Key Missing</AlertTitle>
            <AlertDescription>
              The TMDB API key is missing. Please add it to your environment variables for real movie data. Currently
              showing sample data.
            </AlertDescription>
          </Alert>
        )}

        <Hero />
        <div className="space-y-12 mt-8">
          <TrendingMovies movies={trendingMovies.results.slice(0, 10)} />
          <TrendingShows shows={trendingShows.results.slice(0, 10)} />
          <GenreShowcase title="Action Movies" movies={actionMovies.results.slice(0, 10)} />
          <GenreShowcase title="Comedy Movies" movies={comedyMovies.results.slice(0, 10)} />
          <GenreShowcase title="Drama Movies" movies={dramaMovies.results.slice(0, 10)} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading homepage data:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the movie data. Please try again later or check your API configuration.
          </AlertDescription>
        </Alert>
        <Hero />
      </div>
    )
  }
}
