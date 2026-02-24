import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { CalendarIcon, ShieldCheckIcon, ClockIcon } from "@heroicons/react/24/solid";

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

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/auth/login");

  const userBookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      coachProfile: {
        include: { user: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  let coachProfile = null;
  let coachBookings = null;
  if (user.role === "COACH") {
    coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: user.id },
    });
    if (coachProfile) {
      coachBookings = await prisma.booking.findMany({
        where: { coachProfileId: coachProfile.id },
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-primary-text mb-1">
            Hey, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-secondary-text text-sm">
            {user.role === "COACH" ? "Manage your coaching sessions." : "Track your bookings and progress."}
          </p>
        </div>

        {user.role === "COACH" && (
          <div className="mb-8">
            {coachProfile ? (
              <div className="card p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="font-heading font-semibold text-primary-text mb-1">Your Coach Profile</h2>
                    <div className="flex items-center gap-2">
                      {coachProfile.verificationStatus === "VERIFIED" ? (
                        <VerifiedBadge lastVerifiedAt={coachProfile.lastVerifiedAt} />
                      ) : coachProfile.verificationStatus === "PENDING" ? (
                        <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full font-semibold">
                          Pending verification
                        </span>
                      ) : (
                        <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-full font-semibold">
                          Verification rejected
                        </span>
                      )}
                    </div>
                    {coachProfile.verificationStatus === "PENDING" && (
                      <p className="text-secondary-text text-xs mt-2">
                        We&#39;re reviewing your proof. Verification can take up to 48 hours — we appreciate your patience!
                      </p>
                    )}
                    {coachProfile.verificationStatus === "REJECTED" && coachProfile.rejectionReason && (
                      <p className="text-red-600 text-xs mt-2">Reason: {coachProfile.rejectionReason}</p>
                    )}
                  </div>
                  <Link href={`/coaches/${coachProfile.id}`} className="btn-secondary text-sm">
                    View profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="card p-6 bg-green-50 border-green-100 text-center">
                <ShieldCheckIcon className="h-8 w-8 text-accent mx-auto mb-3" />
                <h2 className="font-heading font-semibold text-primary-text mb-2">Set up your coach profile</h2>
                <p className="text-secondary-text text-sm mb-4">Apply for verification and start accepting bookings.</p>
                <Link href="/become-a-coach" className="btn-primary text-sm">Apply now</Link>
              </div>
            )}
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-primary-text text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-accent" />
              {user.role === "COACH" ? "My player bookings" : "My bookings"}
            </h2>
            {user.role !== "COACH" && (
              <Link href="/coaches" className="text-accent text-sm hover:text-accent-dark">Browse coaches →</Link>
            )}
          </div>

          {userBookings.length === 0 ? (
            <div className="card p-10 text-center">
              <CalendarIcon className="h-10 w-10 text-border mx-auto mb-3" />
              <p className="text-secondary-text text-sm mb-4">No bookings yet.</p>
              <Link href="/coaches" className="btn-primary text-sm">Find a coach</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userBookings.map((booking) => (
                <Link key={booking.id} href={`/bookings/${booking.id}`} className="card p-4 flex items-center gap-4 hover:border-accent/30 hover:shadow-sm transition-all block">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-primary-text text-sm">
                        Session with {booking.coachProfile.user.name}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[booking.status] || ""}`}>
                        {statusLabels[booking.status] || booking.status}
                      </span>
                    </div>
                    <p className="text-secondary-text text-xs mt-0.5">
                      {new Date(booking.scheduledAt).toLocaleString()} · {booking.durationMinutes} min
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary-text flex-shrink-0">
                    ${(booking.totalCents / 100).toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {user.role === "COACH" && coachBookings && coachProfile && (
          <div>
            <h2 className="font-heading font-semibold text-primary-text text-lg flex items-center gap-2 mb-4">
              <ClockIcon className="h-5 w-5 text-accent" />
              Incoming sessions
            </h2>
            {coachBookings.length === 0 ? (
              <div className="card p-10 text-center">
                <CalendarIcon className="h-10 w-10 text-border mx-auto mb-3" />
                <p className="text-secondary-text text-sm">No incoming sessions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {coachBookings.map((booking) => (
                  <Link key={booking.id} href={`/bookings/${booking.id}`} className="card p-4 flex items-center gap-4 hover:border-accent/30 hover:shadow-sm transition-all block">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-primary-text text-sm">
                          Session with {booking.user.name}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[booking.status] || ""}`}>
                          {statusLabels[booking.status] || booking.status}
                        </span>
                      </div>
                      <p className="text-secondary-text text-xs mt-0.5">
                        {new Date(booking.scheduledAt).toLocaleString()} · {booking.durationMinutes} min
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary-text flex-shrink-0">
                      ${(booking.totalCents / 100).toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
