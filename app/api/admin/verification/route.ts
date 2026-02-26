import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { logAuditEvent } from '@/lib/audit'

const updateSchema = z.object({
  submissionId: z.string().cuid(),
  status: z.enum(['VERIFIED', 'REJECTED', 'NEEDS_MORE_INFO']),
  adminNotes: z.string().max(2000).optional(),
})

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { submissionId, status, adminNotes } = parsed.data

  const submission = await prisma.verificationSubmission.update({
    where: { id: submissionId },
    data: {
      status,
      adminNotes: adminNotes ?? null,
      reviewedAt: new Date(),
      reviewedBy: session.user.id,
      ...(status === 'VERIFIED' ? { lastVerifiedAt: new Date() } : {}),
    },
  })

  await logAuditEvent({
    actorId: session.user.id,
    action: status === 'VERIFIED' ? 'VERIFICATION_APPROVED' : 'VERIFICATION_REJECTED',
    entityType: 'VerificationSubmission',
    entityId: submissionId,
    metadata: { status, adminNotes },
  })

  return NextResponse.json({ submission })
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const statusFilter = searchParams.get('status') ?? 'PENDING'

  const submissions = await prisma.verificationSubmission.findMany({
    where: { status: statusFilter as 'PENDING' },
    include: {
      coach: {
        select: {
          id: true,
          displayName: true,
          bio: true,
          games: true,
        },
      },
    },
    orderBy: { submittedAt: 'asc' },
  })

  return NextResponse.json({ submissions })
}
