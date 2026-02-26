'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'

export interface FilterState {
  game: string
  language: string
  minPrice: string
  maxPrice: string
  minRating: string
  verifiedOnly: boolean
}

interface FilterSidebarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableGames: string[]
  availableLanguages: string[]
}

export default function FilterSidebar({
  filters,
  onChange,
  availableGames,
  availableLanguages,
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const update = (key: keyof FilterState, value: string | boolean) => {
    onChange({ ...filters, [key]: value })
  }

  const reset = () => {
    onChange({
      game: '',
      language: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      verifiedOnly: false,
    })
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== '' && v !== false)

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-sora font-semibold text-text-primary">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={reset}
            className="text-xs text-accent hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Verified Only */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => update('verifiedOnly', e.target.checked)}
            className="w-4 h-4 rounded accent-accent"
          />
          <span className="text-sm text-text-primary">Verified coaches only</span>
        </label>
      </div>

      {/* Game */}
      <div>
        <label className="label" htmlFor="filter-game">
          Game
        </label>
        <select
          id="filter-game"
          value={filters.game}
          onChange={(e) => update('game', e.target.value)}
          className="input"
        >
          <option value="">All games</option>
          {availableGames.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="label" htmlFor="filter-lang">
          Language
        </label>
        <select
          id="filter-lang"
          value={filters.language}
          onChange={(e) => update('language', e.target.value)}
          className="input"
        >
          <option value="">All languages</option>
          {availableLanguages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div>
        <p className="label">Price range (USD / session)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={filters.minPrice}
            onChange={(e) => update('minPrice', e.target.value)}
            className="input"
            aria-label="Minimum price"
          />
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => update('maxPrice', e.target.value)}
            className="input"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Min rating */}
      <div>
        <label className="label" htmlFor="filter-rating">
          Minimum rating
        </label>
        <select
          id="filter-rating"
          value={filters.minRating}
          onChange={(e) => update('minRating', e.target.value)}
          className="input"
        >
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden flex items-center gap-2 btn-secondary mb-4"
        onClick={() => setMobileOpen(true)}
      >
        <Filter className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-accent" aria-label="Active filters" />
        )}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-surface w-72 h-full overflow-y-auto p-6 shadow-xl">
            <button
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileOpen(false)}
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 flex-shrink-0">
        <div className="card p-5 sticky top-24">
          <FilterContent />
        </div>
      </aside>
    </>
  )
}
