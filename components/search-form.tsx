"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchFormProps {
  initialQuery?: string
}

export default function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (query.trim()) {
      startTransition(() => {
        router.push(`/search?query=${encodeURIComponent(query.trim())}`)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg mx-auto mb-8">
      <Input
        type="search"
        placeholder="Search for movies, TV shows, actors..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-r-none"
      />
      <Button type="submit" disabled={isPending || !query.trim()} className="rounded-l-none">
        {isPending ? (
          "Searching..."
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Search
          </>
        )}
      </Button>
    </form>
  )
}
