import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import ProfileHeader from "@/components/profile-header"
import WatchlistTabs from "@/components/watchlist-tabs"
import { getUserWatchlists, getUserRatings } from "@/lib/user-data"

export default async function ProfilePage() {
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
      <ProfileHeader user={session.user} />
      <WatchlistTabs
        movieWatchlist={movieWatchlist}
        tvWatchlist={tvWatchlist}
        movieRatings={movieRatings}
        tvRatings={tvRatings}
      />
    </div>
  )
}
