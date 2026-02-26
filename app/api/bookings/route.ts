import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { bookingSchema } from '@/lib/validators'
import { createPolicySnapshot } from '@/lib/policies'
import { logAuditEvent } from '@/lib/audit'
import type { Prisma } from '@prisma/client'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { serviceId, slotStartUtc, notes } = parsed.data

  const service = await prisma.servicePackage.findUnique({
    where: { id: serviceId },
    include: { coach: true },
  })

  if (!service || !service.isActive) {
    return NextResponse.json({ error: 'Service not found or inactive' }, { status: 404 })
  }

  const startUtc = new Date(slotStartUtc)
  const endUtc = new Date(startUtc.getTime() + service.durationMins * 60 * 1000)

  const policySnapshot = createPolicySnapshot({
    cancellationHours: service.coach.cancellationHours,
  }) as unknown as Prisma.InputJsonValue

  const booking = await prisma.booking.create({
    data: {
      customerId: session.user.id,
      coachId: service.coach.userId,
      serviceId,
      slotStartUtc: startUtc,
      slotEndUtc: endUtc,
      status: 'PENDING_PAYMENT',
      policySnapshot,
      notes: notes ?? null,
    },
  })

  await logAuditEvent({
    actorId: session.user.id,
    action: 'BOOKING_CREATED',
    entityType: 'Booking',
    entityId: booking.id,
    metadata: { serviceId, slotStartUtc },
  })

  return NextResponse.json({ booking }, { status: 201 })
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') ?? 'customer'

  const where =
    role === 'coach'
      ? { coachId: session.user.id }
      : { customerId: session.user.id }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      service: true,
      coach: { select: { name: true } },
      customer: { select: { name: true } },
      review: { select: { id: true } },
    },
    orderBy: { slotStartUtc: 'desc' },
  })

  return NextResponse.json({ bookings })
}
