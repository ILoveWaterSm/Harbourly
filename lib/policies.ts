/**
 * Cancellation policy logic for Habourly bookings.
 */

export interface CancellationPolicy {
  cancellationHours: number
}

export interface PolicySnapshot {
  cancellationHours: number
  snapshotAt: string
}

export function canCancelBooking(
  slotStartUtc: Date,
  policy: CancellationPolicy,
  now: Date = new Date()
): boolean {
  const hoursUntilSlot = (slotStartUtc.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursUntilSlot >= policy.cancellationHours
}

export function getRefundPercent(
  slotStartUtc: Date,
  policy: CancellationPolicy,
  now: Date = new Date()
): number {
  if (canCancelBooking(slotStartUtc, policy, now)) {
    return 100
  }
  const hoursUntilSlot = (slotStartUtc.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (hoursUntilSlot >= policy.cancellationHours / 2) {
    return 50
  }
  return 0
}

export function createPolicySnapshot(policy: CancellationPolicy): PolicySnapshot {
  return {
    cancellationHours: policy.cancellationHours,
    snapshotAt: new Date().toISOString(),
  }
}
