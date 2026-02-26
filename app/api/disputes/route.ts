import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { disputeSchema } from '@/lib/validators'
import { logAuditEvent } from '@/lib/audit'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = disputeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { bookingId, reason } = parsed.data

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const isParticipant =
    booking.customerId === session.user.id || booking.coachId === session.user.id
  if (!isParticipant) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 48-hour window
  const cutoff = new Date(booking.slotEndUtc.getTime() + 48 * 60 * 60 * 1000)
  if (new Date() > cutoff) {
    return NextResponse.json({ error: 'Dispute window has expired (48 hours after session)' }, { status: 400 })
  }

  const existing = await prisma.dispute.findUnique({ where: { bookingId } })
  if (existing) {
    return NextResponse.json({ error: 'Dispute already opened for this booking' }, { status: 409 })
  }

  const [dispute] = await prisma.$transaction([
    prisma.dispute.create({
      data: { bookingId, openedById: session.user.id, reason },
    }),
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'DISPUTED' },
    }),
  ])

  await logAuditEvent({
    actorId: session.user.id,
    action: 'DISPUTE_OPENED',
    entityType: 'Dispute',
    entityId: dispute.id,
  })

  return NextResponse.json({ dispute }, { status: 201 })
}
