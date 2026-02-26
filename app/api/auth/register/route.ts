import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signUpSchema } from '@/lib/validators'
import { logAuditEvent } from '@/lib/audit'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = signUpSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { name, email, password, role } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  })

  await logAuditEvent({
    actorId: user.id,
    action: 'USER_SIGNUP',
    entityType: 'User',
    entityId: user.id,
    metadata: { role },
  })

  // Fire and forget welcome email
  sendWelcomeEmail(email, name).catch(console.error)

  return NextResponse.json({ userId: user.id }, { status: 201 })
}
