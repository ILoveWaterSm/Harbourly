'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import CoachCard, { type CoachCardData } from '@/components/ui/CoachCard'
import FilterSidebar, { type FilterState } from '@/components/ui/FilterSidebar'
import EmptyState from '@/components/ui/EmptyState'
import { Users, Loader2 } from 'lucide-react'

const AVAILABLE_GAMES = [
  'Valorant', 'League of Legends', 'Fortnite', 'Apex Legends',
  'CS2', 'Overwatch 2', 'Rocket League', 'Teamfight Tactics',
]
const AVAILABLE_LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Korean', 'Japanese']

interface CoachListResponse {
  coaches: CoachCardData[]
  total: number
  page: number
  totalPages: number
}

export default function BrowsePageClient() {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    game: searchParams.get('game') ?? '',
    language: searchParams.get('language') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    minRating: searchParams.get('minRating') ?? '',
    verifiedOnly: searchParams.get('verifiedOnly') === 'true',
  })
  const [coaches, setCoaches] = useState<CoachCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchCoaches = useCallback(async (f: FilterState, p: number) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (f.game) params.set('game', f.game)
    if (f.language) params.set('language', f.language)
    if (f.minPrice) params.set('minPrice', String(Number(f.minPrice) * 100))
    if (f.maxPrice) params.set('maxPrice', String(Number(f.maxPrice) * 100))
    if (f.minRating) params.set('minRating', f.minRating)
    if (f.verifiedOnly) params.set('verifiedOnly', 'true')
    params.set('page', String(p))

    try {
      const res = await fetch(`/api/coaches?${params.toString()}`)
      if (res.ok) {
        const data: CoachListResponse = await res.json()
        setCoaches(data.coaches)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCoaches(filters, page)
  }, [filters, page, fetchCoaches])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="flex gap-8">
      <FilterSidebar
        filters={filters}
        onChange={handleFilterChange}
        availableGames={AVAILABLE_GAMES}
        availableLanguages={AVAILABLE_LANGUAGES}
      />

      <div className="flex-1 min-w-0">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-secondary">
            {loading ? 'Loading…' : `${total} coach${total !== 1 ? 'es' : ''} found`}
          </p>
        </div>

        {/* Coach grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : coaches.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No coaches found"
            description="Try adjusting your filters to find more coaches."
            action={{ label: 'Clear filters', onClick: () => handleFilterChange({
              game: '', language: '', minPrice: '', maxPrice: '', minRating: '', verifiedOnly: false,
            }) }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-text-secondary">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
