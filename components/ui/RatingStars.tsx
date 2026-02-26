import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  reviewCount?: number
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 'sm',
  showValue = false,
  reviewCount,
}: RatingStarsProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${maxRating} stars`}>
        {Array.from({ length: maxRating }, (_, i) => {
          const filled = i < Math.floor(rating)
          const partial = !filled && i < rating
          return (
            <Star
              key={i}
              className={`${starSize} ${
                filled
                  ? 'text-yellow-400 fill-yellow-400'
                  : partial
                  ? 'text-yellow-400 fill-yellow-200'
                  : 'text-border fill-border'
              }`}
              aria-hidden="true"
            />
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-text-primary ml-1">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-text-secondary">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}
