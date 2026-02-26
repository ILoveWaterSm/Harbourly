'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BookingCalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  availableDates?: Set<string>
  minDate?: Date
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export default function BookingCalendar({
  selectedDate,
  onSelectDate,
  availableDates,
  minDate = new Date(),
}: BookingCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  const startOffset = firstDay.getDay()
  const totalCells = startOffset + lastDay.getDate()
  const rows = Math.ceil(totalCells / 7)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(viewYear, viewMonth)
  )

  const cells = Array.from({ length: rows * 7 }, (_, i) => {
    const dayNum = i - startOffset + 1
    if (dayNum < 1 || dayNum > lastDay.getDate()) return null
    return new Date(viewYear, viewMonth, dayNum)
  })

  return (
    <div className="card p-4 max-w-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 rounded-button text-text-secondary hover:text-text-primary hover:bg-background"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-sora font-semibold text-sm text-text-primary">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="p-1 rounded-button text-text-secondary hover:text-text-primary hover:bg-background"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-xs text-text-secondary font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} />
          }
          const iso = isoDate(date)
          const isPast = date < new Date(isoDate(minDate))
          const isAvailable = availableDates ? availableDates.has(iso) : !isPast
          const isSelected = selectedDate ? isoDate(selectedDate) === iso : false
          const isToday = isoDate(today) === iso

          return (
            <button
              key={iso}
              onClick={() => isAvailable && onSelectDate(date)}
              disabled={!isAvailable}
              className={`h-9 w-full rounded-button text-sm transition-colors ${
                isSelected
                  ? 'bg-accent text-white font-semibold'
                  : isToday
                  ? 'border border-accent text-accent font-medium'
                  : isAvailable
                  ? 'hover:bg-accent/10 text-text-primary'
                  : 'text-border cursor-not-allowed'
              }`}
              aria-label={date.toDateString()}
              aria-pressed={isSelected}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
