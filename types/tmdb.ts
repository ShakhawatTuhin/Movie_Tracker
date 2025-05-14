export interface Movie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  release_date: string
  vote_average: number
  popularity: number
  genre_ids: number[]
  media_type?: string
}

export interface TvShow {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  first_air_date: string
  vote_average: number
  popularity: number
  genre_ids: number[]
  media_type?: string
}

export interface Person {
  id: number
  name: string
  profile_path: string | null
  known_for_department: string
  media_type?: string
  known_for?: (Movie | TvShow)[]
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number
  budget: number
  revenue: number
  status: string
  tagline: string
  production_companies: {
    id: number
    name: string
    logo_path: string | null
  }[]
}

export interface TvDetails extends TvShow {
  genres: Genre[]
  number_of_seasons: number
  number_of_episodes: number
  status: string
  tagline: string
  created_by: {
    id: number
    name: string
    profile_path: string | null
  }[]
  networks: {
    id: number
    name: string
    logo_path: string | null
  }[]
  seasons: {
    id: number
    name: string
    poster_path: string | null
    season_number: number
    episode_count: number
    air_date: string
  }[]
}

export interface Credits {
  cast: {
    id: number
    name: string
    character: string
    profile_path: string | null
    order: number
  }[]
  crew: {
    id: number
    name: string
    job: string
    department: string
    profile_path: string | null
  }[]
}

export interface SearchResults {
  page: number
  results: (Movie | TvShow | Person)[]
  total_pages: number
  total_results: number
}
