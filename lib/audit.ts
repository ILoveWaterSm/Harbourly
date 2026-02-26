import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export type AuditAction =
  | 'USER_SIGNUP'
  | 'USER_LOGIN'
  | 'USER_SUSPENDED'
  | 'COACH_PROFILE_CREATED'
  | 'COACH_PROFILE_UPDATED'
  | 'SERVICE_CREATED'
  | 'SERVICE_UPDATED'
  | 'BOOKING_CREATED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_COMPLETED'
  | 'PAYMENT_SUCCEEDED'
  | 'PAYMENT_REFUNDED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'
  | 'REVIEW_SUBMITTED'
  | 'VERIFICATION_SUBMITTED'
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'

export interface AuditLogEntry {
  actorId?: string
  action: AuditAction
  entityType: string
  entityId: string
  metadata?: Record<string, unknown>
}

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        metadataJson: entry.metadata
        ? (entry.metadata as unknown as Prisma.InputJsonValue)
        : undefined,
      },
    })
  } catch (err) {
    console.error('[AuditLog] Failed to write audit log:', err)
  }
}
