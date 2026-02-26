import { notFound } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import VerificationBadge from '@/components/ui/VerificationBadge'
import RatingStars from '@/components/ui/RatingStars'
import PricePill from '@/components/ui/PricePill'
import { Shield, Globe, Clock, Gamepad2, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { id: string }
}

async function getCoach(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/coaches/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function CoachProfilePage({ params }: PageProps) {
  const coach = await getCoach(params.id)
  if (!coach) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Profile */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header card */}
              <div className="card p-6">
                <div className="flex items-start gap-5">
                  <div className="w-20 h-20 rounded-avatar bg-accent-gradient flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-3xl font-bold font-sora">
                      {coach.displayName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="font-sora font-bold text-2xl text-text-primary mb-1">
                      {coach.displayName}
                    </h1>
                    <VerificationBadge
                      status={coach.verificationStatus ?? 'UNVERIFIED'}
                      size="md"
                    />
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      {coach.averageRating != null && (
                        <RatingStars
                          rating={coach.averageRating}
                          showValue
                          reviewCount={coach.reviewCount}
                          size="md"
                        />
                      )}
                      <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <Globe className="w-4 h-4" aria-hidden="true" />
                        {(coach.languages ?? []).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="card p-6">
                <h2 className="font-sora font-semibold text-text-primary mb-3">About</h2>
                <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-wrap">
                  {coach.bio}
                </p>
              </div>

              {/* Games & Ranks */}
              {coach.games?.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-sora font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" aria-hidden="true" />
                    Games & Ranks
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {coach.games.map((game: string) => (
                      <div
                        key={game}
                        className="flex items-center gap-2 px-3 py-2 bg-background rounded-button border border-border"
                      >
                        <span className="text-sm font-medium text-text-primary">{game}</span>
                        {coach.ranks?.[game] && (
                          <span className="text-xs text-accent font-semibold">
                            {coach.ranks[game]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {coach.reviews?.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-sora font-semibold text-text-primary mb-4">
                    Reviews ({coach.reviewCount})
                  </h2>
                  <div className="space-y-4">
                    {coach.reviews.slice(0, 5).map(
                      (review: {
                        id: string
                        rating: number
                        text: string
                        createdAt: string
                        customer?: { name?: string }
                      }) => (
                        <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <RatingStars rating={review.rating} />
                            <span className="text-xs text-text-secondary">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {review.text}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Booking sidebar */}
            <div className="space-y-4">
              {/* Packages */}
              {coach.services?.map(
                (service: {
                  id: string
                  name: string
                  description: string
                  durationMins: number
                  priceCents: number
                  bundleCount: number
                }) => (
                  <div key={service.id} className="card p-5">
                    <h3 className="font-sora font-semibold text-text-primary mb-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3 mb-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {service.durationMins} min
                      </span>
                      {service.bundleCount > 1 && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                          {service.bundleCount} sessions
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <PricePill priceCents={service.priceCents} variant="accent" />
                      <Link
                        href={`/coaches/${coach.id}/book?serviceId=${service.id}`}
                        className="btn-primary text-sm"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                )
              )}

              {/* Policy */}
              <div className="card p-4 text-xs text-text-secondary space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-text-primary mb-2">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  Booking policy
                </div>
                <p>Free cancellation {coach.cancellationHours ?? 24}h before the session.</p>
                <p>Payment is held securely and only released after completion.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
