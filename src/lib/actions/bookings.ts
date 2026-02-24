"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const createBookingSchema = z.object({
  coachProfileId: z.string().min(1),
  scheduledAt: z.string().min(1),
  durationMinutes: z.coerce.number().int().min(30).max(480),
  notes: z.string().max(500).optional(),
});

export async function createBookingAction(formData: FormData) {
  try {
    const user = await requireAuth();

    const raw = {
      coachProfileId: formData.get("coachProfileId") as string,
      scheduledAt: formData.get("scheduledAt") as string,
      durationMinutes: formData.get("durationMinutes") as string,
      notes: (formData.get("notes") as string) || undefined,
    };

    const result = createBookingSchema.safeParse(raw);
    if (!result.success) {
      return { success: false, error: "Invalid booking data." };
    }

    const { coachProfileId, scheduledAt, durationMinutes, notes } = result.data;

    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachProfileId, verificationStatus: "VERIFIED" },
    });
    if (!coach) {
      return { success: false, error: "Coach not found or not verified." };
    }

    const priceCents = Math.round((coach.rateCents * durationMinutes) / 60);
    const platformFeeCents = Math.round(priceCents * 0.1);
    const totalCents = priceCents + platformFeeCents;

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        coachProfileId,
        scheduledAt: new Date(scheduledAt),
        durationMinutes,
        priceCents,
        platformFeeCents,
        totalCents,
        notes,
        status: "PAYMENT_PENDING",
      },
    });

    return { success: true, bookingId: booking.id };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Please sign in to book a session." };
    }
    return { success: false, error: "Oops, that didn't work. Check your connection and try again." };
  }
}

export async function payBookingAction(bookingId: string) {
  try {
    const user = await requireAuth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, userId: user.id, status: "PAYMENT_PENDING" },
    });
    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    // Demo payment - always succeeds
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          bookingId,
          status: "COMPLETED",
          amountCents: booking.totalCents,
          method: "demo",
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "PAID" },
      }),
    ]);

    return { success: true };
  } catch {
    return { success: false, error: "Oops, that didn't work. Check your connection and try again." };
  }
}

export async function markCompletedAction(bookingId: string) {
  try {
    const user = await requireAuth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, status: "PAID" },
      include: { coachProfile: true },
    });
    if (!booking) {
      return { success: false, error: "Booking not found or not paid." };
    }

    const isUser = booking.userId === user.id;
    const isCoach = booking.coachProfile.userId === user.id;
    if (!isUser && !isCoach) {
      return { success: false, error: "Not authorized." };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Oops, that didn't work. Check your connection and try again." };
  }
}

export async function sendMessageAction(bookingId: string, content: string) {
  try {
    const user = await requireAuth();

    if (!content.trim()) {
      return { success: false, error: "Message cannot be empty." };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { coachProfile: true },
    });
    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    const isParticipant = booking.userId === user.id || booking.coachProfile.userId === user.id;
    if (!isParticipant) {
      return { success: false, error: "Not authorized." };
    }

    const message = await prisma.message.create({
      data: { bookingId, senderId: user.id, content: content.trim() },
      include: { sender: { select: { name: true } } },
    });

    return { success: true, message };
  } catch {
    return { success: false, error: "Oops, that didn't work. Check your connection and try again." };
  }
}

export async function submitReviewAction(formData: FormData) {
  try {
    const user = await requireAuth();

    const bookingId = formData.get("bookingId") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    if (!bookingId || !rating || !comment) {
      return { success: false, error: "All fields required." };
    }
    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be 1-5." };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, userId: user.id, status: "COMPLETED" },
    });
    if (!booking) {
      return { success: false, error: "Can only review completed bookings." };
    }

    const existing = await prisma.review.findUnique({ where: { bookingId } });
    if (existing) {
      return { success: false, error: "You've already reviewed this booking." };
    }

    await prisma.review.create({
      data: {
        bookingId,
        userId: user.id,
        coachProfileId: booking.coachProfileId,
        rating,
        comment,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Oops, that didn't work. Check your connection and try again." };
  }
}

export async function submitDisputeAction(formData: FormData) {
  try {
    const user = await requireAuth();

    const bookingId = formData.get("bookingId") as string;
    const reason = formData.get("reason") as string;
    const evidenceUrl = (formData.get("evidenceUrl") as string) || undefined;

    if (!bookingId || !reason) {
      return { success: false, error: "Reason is required." };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { coachProfile: true },
    });
    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    const isParticipant = booking.userId === user.id || booking.coachProfile.userId === user.id;
    if (!isParticipant) {
      return { success: false, error: "Not authorized." };
    }

    const existing = await prisma.dispute.findUnique({ where: { bookingId } });
    if (existing) {
      return { success: false, error: "A dispute already exists for this booking." };
    }

    await prisma.$transaction([
      prisma.dispute.create({
        data: { bookingId, userId: user.id, reason, evidenceUrl, status: "OPEN" },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "DISPUTED" },
      }),
    ]);

    return { success: true };
  } catch {
    return { success: false, error: "Oops, that didn't work. Check your connection and try again." };
  }
}
