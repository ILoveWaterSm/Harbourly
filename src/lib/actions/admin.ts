"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function approveCoachAction(_adminId: string, coachProfileId: string) {
  try {
    const user = await getSession();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized." };
    }

    const coachProfile = await prisma.coachProfile.findUnique({
      where: { id: coachProfileId },
      select: { userId: true },
    });

    if (!coachProfile) {
      return { success: false, error: "Coach profile not found." };
    }

    await prisma.$transaction([
      prisma.coachProfile.update({
        where: { id: coachProfileId },
        data: {
          verificationStatus: "VERIFIED",
          lastVerifiedAt: new Date(),
          rejectionReason: null,
        },
      }),
      prisma.user.update({
        where: { id: coachProfile.userId },
        data: { role: "COACH" },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminId: user.id,
          action: "APPROVE_COACH",
          targetType: "CoachProfile",
          targetId: coachProfileId,
          details: { approvedAt: new Date().toISOString() },
        },
      }),
    ]);

    return { success: true };
  } catch {
    return { success: false, error: "Oops, that didn't work. Check your connection and try again." };
  }
}

export async function rejectCoachAction(_adminId: string, coachProfileId: string, reason: string) {
  try {
    const user = await getSession();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized." };
    }

    await prisma.$transaction([
      prisma.coachProfile.update({
        where: { id: coachProfileId },
        data: {
          verificationStatus: "REJECTED",
          rejectionReason: reason,
        },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminId: user.id,
          action: "REJECT_COACH",
          targetType: "CoachProfile",
          targetId: coachProfileId,
          details: { reason, rejectedAt: new Date().toISOString() },
        },
      }),
    ]);

    return { success: true };
  } catch {
    return { success: false, error: "Oops, that didn't work. Check your connection and try again." };
  }
}
