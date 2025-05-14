import { searchMulti } from "@/lib/tmdb"
import SearchResults from "@/components/search-results"
import SearchForm from "@/components/search-form"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string }
}) {
  const query = searchParams.query || ""
  const page = Number.parseInt(searchParams.page || "1")

  let results = null
  if (query) {
    results = await searchMulti(query, page)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Movies & TV Shows</h1>
      <SearchForm initialQuery={query} />
      {results && <SearchResults results={results} currentQuery={query} currentPage={page} />}
      {query && !results?.results.length && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">No results found</h2>
          <p className="text-muted-foreground mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  )
}
