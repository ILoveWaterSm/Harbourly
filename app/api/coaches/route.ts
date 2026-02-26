import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { coachSearchSchema } from '@/lib/validators'
import { VerificationStatus } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const params = Object.fromEntries(searchParams.entries())
  const parsed = coachSearchSchema.safeParse(params)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query params' }, { status: 400 })
  }

  const { game, language, minPrice, maxPrice, minRating, verifiedOnly, page, limit } = parsed.data
  const skip = (page - 1) * limit

  const profiles = await prisma.coachProfile.findMany({
    where: {
      isActive: true,
      ...(game ? { games: { has: game } } : {}),
      ...(language ? { languages: { has: language } } : {}),
      ...(minPrice !== undefined ? { pricingFrom: { gte: minPrice } } : {}),
      ...(maxPrice !== undefined ? { pricingFrom: { lte: maxPrice } } : {}),
      ...(verifiedOnly
        ? { verification: { is: { status: VerificationStatus.VERIFIED } } }
        : {}),
    },
    skip,
    take: limit,
    include: {
      verification: { select: { status: true } },
      reviews: { select: { rating: true } },
      user: { select: { image: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.coachProfile.count({
    where: {
      isActive: true,
      ...(game ? { games: { has: game } } : {}),
      ...(language ? { languages: { has: language } } : {}),
      ...(minPrice !== undefined ? { pricingFrom: { gte: minPrice } } : {}),
      ...(maxPrice !== undefined ? { pricingFrom: { lte: maxPrice } } : {}),
      ...(verifiedOnly
        ? { verification: { is: { status: VerificationStatus.VERIFIED } } }
        : {}),
    },
  })

  const coaches = profiles
    .map((p) => {
      const ratings = p.reviews.map((r) => r.rating)
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
      if (minRating !== undefined && (avg === null || avg < minRating)) return null
      return {
        id: p.id,
        displayName: p.displayName,
        bio: p.bio,
        games: p.games,
        languages: p.languages,
        pricingFrom: p.pricingFrom,
        image: p.user.image,
        verificationStatus: p.verification?.status ?? 'UNVERIFIED',
        averageRating: avg ? Math.round(avg * 10) / 10 : undefined,
        reviewCount: ratings.length || undefined,
      }
    })
    .filter(Boolean)

  return NextResponse.json({
    coaches,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
