const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_API_URL = "https://api.themoviedb.org/3"

// Helper function to make API requests
async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  if (!TMDB_API_KEY) {
    console.error("TMDB API key is missing. Please add it to your environment variables.")
    // Return mock data instead of throwing an error
    return getMockData(endpoint)
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  })

  try {
    const response = await fetch(`${TMDB_API_URL}${endpoint}?${queryParams.toString()}`, {
      next: { revalidate: 60 * 60 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} ${response.statusText}`)
      return getMockData(endpoint)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching from TMDB:", error)
    return getMockData(endpoint)
  }
}

// Mock data function to return fallback data when API fails
function getMockData(endpoint: string) {
  // Basic mock data structure
  const mockMovies = {
    results: Array(10)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        title: `Sample Movie ${i + 1}`,
        name: `Sample Show ${i + 1}`,
        poster_path: null,
        backdrop_path: null,
        overview: "This is a sample description for when the API is unavailable.",
        release_date: "2023-01-01",
        first_air_date: "2023-01-01",
        vote_average: 7.5,
        popularity: 100,
        genre_ids: [28, 12, 16],
        media_type: endpoint.includes("/movie") ? "movie" : "tv",
      })),
    page: 1,
    total_pages: 1,
    total_results: 10,
  }

  // For detailed endpoints like /movie/{id}
  if (endpoint.match(/\/movie\/\d+$/) || endpoint.match(/\/tv\/\d+$/)) {
    const isMovie = endpoint.includes("/movie/")
    return {
      id: 1,
      title: isMovie ? "Sample Movie" : undefined,
      name: isMovie ? undefined : "Sample TV Show",
      poster_path: null,
      backdrop_path: null,
      overview: "This is a sample description for when the API is unavailable.",
      release_date: isMovie ? "2023-01-01" : undefined,
      first_air_date: isMovie ? undefined : "2023-01-01",
      vote_average: 7.5,
      popularity: 100,
      genres: [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
      ],
      runtime: isMovie ? 120 : undefined,
      number_of_seasons: isMovie ? undefined : 3,
      number_of_episodes: isMovie ? undefined : 24,
      status: "Released",
      tagline: "Sample tagline",
      budget: isMovie ? 100000000 : undefined,
      revenue: isMovie ? 300000000 : undefined,
      production_companies: [{ id: 1, name: "Sample Studio", logo_path: null }],
      created_by: isMovie ? undefined : [{ id: 1, name: "Sample Creator", profile_path: null }],
      networks: isMovie ? undefined : [{ id: 1, name: "Sample Network", logo_path: null }],
      seasons: isMovie
        ? undefined
        : [
            {
              id: 1,
              name: "Season 1",
              poster_path: null,
              season_number: 1,
              episode_count: 8,
              air_date: "2023-01-01",
            },
          ],
    }
  }

  // For credits endpoints
  if (endpoint.includes("/credits")) {
    return {
      cast: Array(5)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          name: `Actor ${i + 1}`,
          character: `Character ${i + 1}`,
          profile_path: null,
          order: i,
        })),
      crew: Array(5)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          name: `Crew Member ${i + 1}`,
          job: i === 0 ? "Director" : `Job ${i}`,
          department: i === 0 ? "Directing" : `Department ${i}`,
          profile_path: null,
        })),
    }
  }

  // For similar/recommendations endpoints
  if (endpoint.includes("/similar") || endpoint.includes("/recommendations")) {
    return mockMovies
  }

  // Default to mock movies/shows list
  return mockMovies
}

// Get trending movies
export async function getTrendingMovies(timeWindow: "day" | "week" = "week") {
  return fetchFromTMDB(`/trending/movie/${timeWindow}`)
}

// Get trending TV shows
export async function getTrendingShows(timeWindow: "day" | "week" = "week") {
  return fetchFromTMDB(`/trending/tv/${timeWindow}`)
}

// Get movies by genre
export async function getMoviesByGenre(genreId: number, page = 1) {
  return fetchFromTMDB("/discover/movie", {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: "popularity.desc",
  })
}

// Get TV shows by genre
export async function getTvShowsByGenre(genreId: number, page = 1) {
  return fetchFromTMDB("/discover/tv", {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: "popularity.desc",
  })
}

// Get movie details
export async function getMovieDetails(movieId: number) {
  return fetchFromTMDB(`/movie/${movieId}`)
}

// Get TV show details
export async function getTvDetails(tvId: number) {
  return fetchFromTMDB(`/tv/${tvId}`)
}

// Get movie credits
export async function getMovieCredits(movieId: number) {
  return fetchFromTMDB(`/movie/${movieId}/credits`)
}

// Get TV show credits
export async function getTvCredits(tvId: number) {
  return fetchFromTMDB(`/tv/${tvId}/credits`)
}

// Get similar movies
export async function getSimilarMovies(movieId: number) {
  return fetchFromTMDB(`/movie/${movieId}/similar`)
}

// Get similar TV shows
export async function getSimilarTvShows(tvId: number) {
  return fetchFromTMDB(`/tv/${tvId}/similar`)
}

// Search for movies, TV shows, and people
export async function searchMulti(query: string, page = 1) {
  return fetchFromTMDB("/search/multi", {
    query,
    page: page.toString(),
  })
}

// Get movie recommendations
export async function getMovieRecommendations(movieId: number) {
  return fetchFromTMDB(`/movie/${movieId}/recommendations`)
}

// Get TV show recommendations
export async function getTvRecommendations(tvId: number) {
  return fetchFromTMDB(`/tv/${tvId}/recommendations`)
}

// Get movie genres
export async function getMovieGenres() {
  return fetchFromTMDB("/genre/movie/list")
}

// Get TV show genres
export async function getTvGenres() {
  return fetchFromTMDB("/genre/tv/list")
}

// Get upcoming movies
export async function getUpcomingMovies() {
  return fetchFromTMDB("/movie/upcoming")
}

// Get now playing movies
export async function getNowPlayingMovies() {
  return fetchFromTMDB("/movie/now_playing")
}

// Get top rated movies
export async function getTopRatedMovies() {
  return fetchFromTMDB("/movie/top_rated")
}

// Get top rated TV shows
export async function getTopRatedTvShows() {
  return fetchFromTMDB("/tv/top_rated")
}
