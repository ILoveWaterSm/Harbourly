import Link from 'next/link'
import Image from 'next/image'
import VerificationBadge from './VerificationBadge'
import RatingStars from './RatingStars'
import PricePill from './PricePill'
import { Gamepad2 } from 'lucide-react'

export interface CoachCardData {
  id: string
  displayName: string
  image?: string | null
  games: string[]
  languages: string[]
  pricingFrom: number
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED' | 'REJECTED' | 'NEEDS_MORE_INFO'
  averageRating?: number
  reviewCount?: number
  bio: string
}

interface CoachCardProps {
  coach: CoachCardData
}

export default function CoachCard({ coach }: CoachCardProps) {
  return (
    <Link
      href={`/coaches/${coach.id}`}
      className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-card"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 flex-shrink-0">
          {coach.image ? (
            <Image
              src={coach.image}
              alt={coach.displayName}
              fill
              className="rounded-avatar object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-avatar bg-accent-gradient flex items-center justify-center">
              <span className="text-white text-xl font-bold font-sora">
                {coach.displayName[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-sora font-semibold text-text-primary truncate">
            {coach.displayName}
          </h3>
          <div className="mt-1">
            <VerificationBadge status={coach.verificationStatus} size="sm" />
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{coach.bio}</p>

      {/* Games */}
      <div className="flex flex-wrap gap-1.5">
        {coach.games.slice(0, 3).map((game) => (
          <span
            key={game}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent-dark font-medium"
          >
            <Gamepad2 className="w-3 h-3" aria-hidden="true" />
            {game}
          </span>
        ))}
        {coach.games.length > 3 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-background text-text-secondary">
            +{coach.games.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        {coach.averageRating !== undefined ? (
          <RatingStars
            rating={coach.averageRating}
            showValue
            reviewCount={coach.reviewCount}
          />
        ) : (
          <span className="text-xs text-text-secondary">No reviews yet</span>
        )}
        <PricePill priceCents={coach.pricingFrom} suffix="from" variant="accent" />
      </div>
    </Link>
  )
}
