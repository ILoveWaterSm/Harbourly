import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { reviewSchema } from '@/lib/validators'
import { logAuditEvent } from '@/lib/audit'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { bookingId, rating, text } = parsed.data

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: { include: { coach: true } } },
  })

  if (!booking || booking.customerId !== session.user.id) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Can only review completed bookings' }, { status: 400 })
  }

  const existing = await prisma.review.findUnique({ where: { bookingId } })
  if (existing) {
    return NextResponse.json({ error: 'Review already submitted' }, { status: 409 })
  }

  const review = await prisma.review.create({
    data: {
      bookingId,
      customerId: session.user.id,
      coachId: booking.service.coach.id,
      rating,
      text,
    },
  })

  await logAuditEvent({
    actorId: session.user.id,
    action: 'REVIEW_SUBMITTED',
    entityType: 'Review',
    entityId: review.id,
  })

  return NextResponse.json({ review }, { status: 201 })
}
