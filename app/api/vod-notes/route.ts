import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { vodNoteSchema } from '@/lib/validators'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = vodNoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { bookingId, summary, tags, timestampsJson, homeworkJson } = parsed.data

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking || booking.coachId !== session.user.id) {
    return NextResponse.json({ error: 'Booking not found or not your booking' }, { status: 404 })
  }

  const existing = await prisma.vodNote.findUnique({ where: { bookingId } })
  if (existing) {
    const updated = await prisma.vodNote.update({
      where: { bookingId },
      data: { summary, tags, timestampsJson, homeworkJson },
    })
    return NextResponse.json({ vodNote: updated })
  }

  const vodNote = await prisma.vodNote.create({
    data: { bookingId, summary, tags, timestampsJson, homeworkJson },
  })

  return NextResponse.json({ vodNote }, { status: 201 })
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get('bookingId')
  if (!bookingId) {
    return NextResponse.json({ error: 'bookingId required' }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (
    !booking ||
    (booking.customerId !== session.user.id && booking.coachId !== session.user.id)
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const vodNote = await prisma.vodNote.findUnique({ where: { bookingId } })
  return NextResponse.json({ vodNote: vodNote ?? null })
}
