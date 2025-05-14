export interface MovieWatchlistItem {
  id: string
  user_id: string
  movie_id: number
  status: string
  created_at: string
  updated_at: string
  title: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

export interface TvWatchlistItem {
  id: string
  user_id: string
  tv_id: number
  status: string
  current_episode: number
  created_at: string
  updated_at: string
  name: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  number_of_seasons: number
}

export interface MovieRatingItem {
  id: string
  user_id: string
  movie_id: number
  rating: number
  review: string | null
  created_at: string
  updated_at: string
  title: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

export interface TvRatingItem {
  id: string
  user_id: string
  tv_id: number
  rating: number
  review: string | null
  created_at: string
  updated_at: string
  name: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  number_of_seasons: number
}
