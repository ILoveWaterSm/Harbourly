import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { StarIcon, ShieldCheckIcon, CalendarIcon, LanguageIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";

export default async function CoachProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coach = await prisma.coachProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, avatarUrl: true, createdAt: true } },
      proofMedia: true,
      availabilitySlots: true,
      reviews: {
        include: { user: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!coach) notFound();

  const user = await getSession();
  const avgRating = coach.reviews.length
    ? coach.reviews.reduce((sum, r) => sum + r.rating, 0) / coach.reviews.length
    : null;

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const initials = coach.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile header */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {coach.user.avatarUrl ? (
              <img src={coach.user.avatarUrl} alt={coach.user.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-border flex-shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center text-green-700 font-bold text-2xl flex-shrink-0">
                {initials}
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-heading text-2xl font-bold text-primary-text">{coach.user.name}</h1>
                {coach.verificationStatus === "VERIFIED" && (
                  <VerifiedBadge lastVerifiedAt={coach.lastVerifiedAt} size="md" />
                )}
              </div>
              <p className="text-secondary-text text-base mb-3">{coach.headline}</p>

              <div className="flex flex-wrap gap-4 text-sm text-secondary-text mb-4">
                {avgRating !== null && (
                  <span className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <strong className="text-primary-text">{avgRating.toFixed(1)}</strong>
                    <span>({coach.reviews.length} review{coach.reviews.length !== 1 ? "s" : ""})</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CurrencyDollarIcon className="h-4 w-4 text-accent" />
                  <strong className="text-primary-text">${(coach.rateCents / 100).toFixed(0)}/hr</strong>
                </span>
                {coach.languages.length > 0 && (
                  <span className="flex items-center gap-1">
                    <LanguageIcon className="h-4 w-4" />
                    {coach.languages.join(", ")}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {coach.games.map((game) => (
                  <span key={game} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-border">
                    {game}
                  </span>
                ))}
              </div>

              {user && user.role === "USER" && coach.verificationStatus === "VERIFIED" ? (
                <Link
                  href={`/coaches/${coach.id}/book`}
                  className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Book a session
                </Link>
              ) : !user ? (
                <Link href="/auth/login" className="btn-primary text-sm px-6 py-2.5">
                  Sign in to book
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <div className="card p-6">
              <h2 className="font-heading font-semibold text-primary-text text-lg mb-3">About</h2>
              <p className="text-secondary-text text-sm leading-relaxed whitespace-pre-wrap">{coach.bio}</p>
            </div>

            {/* Proof media */}
            {coach.proofMedia.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheckIcon className="h-5 w-5 text-accent" />
                  <h2 className="font-heading font-semibold text-primary-text text-lg">Verified proof</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {coach.proofMedia.map((media) => (
                    <div key={media.id} className="rounded-[8px] overflow-hidden border border-border bg-gray-50">
                      {media.type === "IMAGE" ? (
                        <img src={media.url} alt={media.caption || "Proof"} className="w-full h-40 object-cover" />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                          <a href={media.url} target="_blank" rel="noopener noreferrer"
                            className="text-accent hover:text-accent-dark text-sm font-medium">
                            View video proof ↗
                          </a>
                        </div>
                      )}
                      {media.caption && (
                        <p className="text-xs text-secondary-text p-2">{media.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-6">
              <h2 className="font-heading font-semibold text-primary-text text-lg mb-4">
                Reviews {coach.reviews.length > 0 && `(${coach.reviews.length})`}
              </h2>
              {coach.reviews.length === 0 ? (
                <p className="text-secondary-text text-sm">No reviews yet. Be the first to review after a completed session.</p>
              ) : (
                <div className="space-y-4">
                  {coach.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {review.user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary-text">{review.user.name}</p>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <StarIcon key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-secondary-text">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-secondary-text text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Pricing */}
            <div className="card p-5">
              <h3 className="font-heading font-semibold text-primary-text text-sm mb-3">Pricing</h3>
              <div className="text-3xl font-bold text-accent-dark mb-1">
                ${(coach.rateCents / 100).toFixed(0)}
                <span className="text-sm font-normal text-secondary-text">/hr</span>
              </div>
              <p className="text-xs text-secondary-text mb-4">Platform fee (10%) added at checkout</p>
              {user && user.role === "USER" && coach.verificationStatus === "VERIFIED" && (
                <Link href={`/coaches/${coach.id}/book`} className="btn-primary w-full text-sm text-center block">
                  Book now
                </Link>
              )}
            </div>

            {/* Availability */}
            {coach.availabilitySlots.length > 0 && (
              <div className="card p-5">
                <h3 className="font-heading font-semibold text-primary-text text-sm mb-3 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-accent" />
                  Availability
                </h3>
                <div className="space-y-2">
                  {coach.availabilitySlots.map((slot) => (
                    <div key={slot.id} className="flex justify-between text-xs">
                      <span className="font-medium text-primary-text">{days[slot.dayOfWeek]}</span>
                      <span className="text-secondary-text">{slot.startTime} &ndash; {slot.endTime}</span>
                    </div>
                  ))}
                  <p className="text-xs text-secondary-text mt-1">{coach.availabilitySlots[0]?.timezone}</p>
                </div>
              </div>
            )}

            {/* Verification info */}
            <div className="card p-5 bg-green-50 border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="h-4 w-4 text-accent" />
                <span className="font-semibold text-green-800 text-sm">Verification status</span>
              </div>
              {coach.verificationStatus === "VERIFIED" ? (
                <>
                  <p className="text-green-700 text-xs">This coach has been verified by the Harbourly team.</p>
                  {coach.lastVerifiedAt && (
                    <p className="text-green-600 text-xs mt-1">
                      Last verified: {new Date(coach.lastVerifiedAt).toLocaleDateString()}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-secondary-text text-xs">Verification pending.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
