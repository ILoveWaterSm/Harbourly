import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookingActions from "./BookingActions";
import ChatPanel from "./ChatPanel";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSession();
  if (!user) redirect("/auth/login");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
      coachProfile: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
      payment: true,
      messages: {
        include: { sender: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
      review: true,
      dispute: true,
    },
  });

  if (!booking) notFound();

  const isUser = booking.userId === user.id;
  const isCoach = booking.coachProfile.userId === user.id;

  if (!isUser && !isCoach && user.role !== "ADMIN") redirect("/dashboard");

  const statusColors: Record<string, string> = {
    PAYMENT_PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    PAID: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    DISPUTED: "bg-red-50 text-red-700 border-red-200",
    CANCELLED: "bg-gray-50 text-gray-600 border-gray-200",
  };
  const statusLabels: Record<string, string> = {
    PAYMENT_PENDING: "Awaiting payment",
    PAID: "Confirmed",
    COMPLETED: "Completed",
    DISPUTED: "In dispute",
    CANCELLED: "Cancelled",
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-secondary-text hover:text-primary-text text-sm">← Dashboard</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h1 className="font-heading text-xl font-bold text-primary-text">Booking Details</h1>
                <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${statusColors[booking.status] || ""}`}>
                  {statusLabels[booking.status] || booking.status}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-text">Coach</span>
                  <div className="flex items-center gap-2">
                    <Link href={`/coaches/${booking.coachProfileId}`} className="text-accent hover:text-accent-dark font-medium">
                      {booking.coachProfile.user.name}
                    </Link>
                    <VerifiedBadge size="sm" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-text">Player</span>
                  <span className="font-medium text-primary-text">{booking.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-text">Scheduled</span>
                  <span className="font-medium text-primary-text">
                    {new Date(booking.scheduledAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-text">Duration</span>
                  <span className="font-medium text-primary-text">{booking.durationMinutes} minutes</span>
                </div>
                {booking.notes && (
                  <div>
                    <span className="text-secondary-text block mb-1">Notes</span>
                    <p className="text-primary-text bg-gray-50 rounded-[6px] px-3 py-2 text-xs">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-heading font-semibold text-primary-text mb-4">Fee Breakdown</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-secondary-text">
                  <span>Session fee</span>
                  <span>${(booking.priceCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary-text">
                  <span>Platform fee (10%)</span>
                  <span>${(booking.platformFeeCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-primary-text border-t border-border pt-2">
                  <span>Total</span>
                  <span>${(booking.totalCents / 100).toFixed(2)}</span>
                </div>
                {booking.payment && (
                  <div className="flex justify-between text-success text-xs pt-1">
                    <span>Payment method</span>
                    <span className="capitalize">{booking.payment.method} · {booking.payment.status}</span>
                  </div>
                )}
              </div>
            </div>

            {booking.dispute && (
              <div className="card p-5 bg-red-50 border-red-200">
                <h3 className="font-semibold text-red-800 mb-1 flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Dispute filed
                </h3>
                <p className="text-red-700 text-sm">{booking.dispute.reason}</p>
                <p className="text-xs text-red-600 mt-2">
                  Your dispute has been submitted. Our team will review the evidence and update you within 72 hours.
                </p>
              </div>
            )}

            <BookingActions
              booking={{
                id: booking.id,
                status: booking.status,
                userId: booking.userId,
                coachUserId: booking.coachProfile.userId,
                hasReview: !!booking.review,
                hasDispute: !!booking.dispute,
              }}
              currentUserId={user.id}
              isUser={isUser}
              isCoach={isCoach}
            />
          </div>

          <div>
            <ChatPanel
              bookingId={booking.id}
              messages={booking.messages.map((m) => ({
                id: m.id,
                content: m.content,
                createdAt: m.createdAt.toISOString(),
                sender: { id: m.sender.id, name: m.sender.name },
              }))}
              currentUserId={user.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
