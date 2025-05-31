import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import WatchlistTabs from "@/components/watchlist-tabs"
import { getUserWatchlists, getUserRatings } from "@/lib/user-data"

export default async function WatchlistPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const [movieWatchlist, tvWatchlist, movieRatings, tvRatings] = await Promise.all([
    getUserWatchlists(session.user.id, "movie"),
    getUserWatchlists(session.user.id, "tv"),
    getUserRatings(session.user.id, "movie"),
    getUserRatings(session.user.id, "tv"),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
        <p className="text-muted-foreground">Manage your movies and TV shows</p>
      </div>

      <WatchlistTabs
        movieWatchlist={movieWatchlist}
        tvWatchlist={tvWatchlist}
        movieRatings={movieRatings}
        tvRatings={tvRatings}
      />
    </div>
  )
}
