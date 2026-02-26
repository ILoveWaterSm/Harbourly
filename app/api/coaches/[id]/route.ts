import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const profile = await prisma.coachProfile.findUnique({
    where: { id: params.id },
    include: {
      verification: { select: { status: true } },
      reviews: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      services: { where: { isActive: true } },
      user: { select: { image: true } },
    },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Coach not found' }, { status: 404 })
  }

  const ratings = profile.reviews.map((r) => r.rating)
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null

  return NextResponse.json({
    id: profile.id,
    displayName: profile.displayName,
    bio: profile.bio,
    games: profile.games,
    ranks: profile.ranks,
    languages: profile.languages,
    pricingFrom: profile.pricingFrom,
    image: profile.user.image,
    timezone: profile.timezone,
    cancellationHours: profile.cancellationHours,
    verificationStatus: profile.verification?.status ?? 'UNVERIFIED',
    averageRating: avg ? Math.round(avg * 10) / 10 : null,
    reviewCount: ratings.length,
    reviews: profile.reviews,
    services: profile.services,
  })
}
