import { getTvDetails, getTvCredits, getSimilarTvShows } from "@/lib/tmdb"
import { TvDetails } from "@/components/tv-details"
import { notFound } from "next/navigation"

export default async function TvShowPage({ params }: { params: { id: string } }) {
  try {
    const tvId = Number.parseInt(params.id)
    const [show, credits, similar] = await Promise.all([
      getTvDetails(tvId),
      getTvCredits(tvId),
      getSimilarTvShows(tvId),
    ])

    if (!show) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <TvDetails show={show} credits={credits} similar={similar.results.slice(0, 6)} />
      </div>
    )
  } catch (error) {
    console.error("Error loading TV show:", error)
    notFound()
  }
}
