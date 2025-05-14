export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      movies: {
        Row: {
          id: number
          title: string
          poster_path: string | null
          backdrop_path: string | null
          overview: string | null
          release_date: string | null
          vote_average: number | null
          genres: string[] | null
          popularity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: number
          title: string
          poster_path?: string | null
          backdrop_path?: string | null
          overview?: string | null
          release_date?: string | null
          vote_average?: number | null
          genres?: string[] | null
          popularity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          poster_path?: string | null
          backdrop_path?: string | null
          overview?: string | null
          release_date?: string | null
          vote_average?: number | null
          genres?: string[] | null
          popularity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      movie_watchlist: {
        Row: {
          id: string
          user_id: string
          movie_id: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: number
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      movie_ratings: {
        Row: {
          id: string
          user_id: string
          movie_id: number
          rating: number
          review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: number
          rating: number
          review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: number
          rating?: number
          review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tv_shows: {
        Row: {
          id: number
          name: string
          poster_path: string | null
          backdrop_path: string | null
          overview: string | null
          first_air_date: string | null
          vote_average: number | null
          genres: string[] | null
          popularity: number | null
          number_of_seasons: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: number
          name: string
          poster_path?: string | null
          backdrop_path?: string | null
          overview?: string | null
          first_air_date?: string | null
          vote_average?: number | null
          genres?: string[] | null
          popularity?: number | null
          number_of_seasons?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          poster_path?: string | null
          backdrop_path?: string | null
          overview?: string | null
          first_air_date?: string | null
          vote_average?: number | null
          genres?: string[] | null
          popularity?: number | null
          number_of_seasons?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      tv_watchlist: {
        Row: {
          id: string
          user_id: string
          tv_id: number
          status: string
          current_episode: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tv_id: number
          status: string
          current_episode?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tv_id?: number
          status?: string
          current_episode?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      tv_ratings: {
        Row: {
          id: string
          user_id: string
          tv_id: number
          rating: number
          review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tv_id: number
          rating: number
          review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tv_id?: number
          rating?: number
          review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
