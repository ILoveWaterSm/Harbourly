import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  coachId: z.string().cuid(),
  year: z.coerce.number().int().min(2024).max(2030),
  month: z.coerce.number().int().min(1).max(12),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()))

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const { coachId, year, month } = parsed.data

  const profile = await prisma.coachProfile.findUnique({
    where: { id: coachId },
    include: {
      availabilityRules: { where: { isActive: true } },
      availabilityExceptions: {
        where: {
          date: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
        },
      },
    },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Coach not found' }, { status: 404 })
  }

  // Build available dates for the month
  const daysInMonth = new Date(year, month, 0).getDate()
  const availableDates: string[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()
    const iso = date.toISOString().slice(0, 10)

    const exception = profile.availabilityExceptions.find(
      (e) => new Date(e.date).toISOString().slice(0, 10) === iso
    )
    if (exception?.isBlocked) continue

    const hasRule = profile.availabilityRules.some((r) => r.dayOfWeek === dayOfWeek)
    if (hasRule) availableDates.push(iso)
  }

  return NextResponse.json({ availableDates, rules: profile.availabilityRules })
}
