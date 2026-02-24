import Link from "next/link";
import VerifiedBadge from "./VerifiedBadge";
import { StarIcon } from "@heroicons/react/20/solid";

interface CoachCardProps {
  coach: {
    id: string;
    headline: string;
    bio: string;
    games: string[];
    languages: string[];
    rateCents: number;
    lastVerifiedAt?: Date | string | null;
    verificationStatus: string;
    user: { name: string; avatarUrl?: string | null };
    reviews?: { rating: number }[];
  };
}

export default function CoachCard({ coach }: CoachCardProps) {
  const avgRating = coach.reviews?.length
    ? coach.reviews.reduce((sum, r) => sum + r.rating, 0) / coach.reviews.length
    : null;

  const initials = coach.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/coaches/${coach.id}`} className="block group">
      <div className="card p-6 hover:shadow-md hover:border-green-200 transition-all duration-200 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            {coach.user.avatarUrl ? (
              <img
                src={coach.user.avatarUrl}
                alt={coach.user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center text-green-700 font-bold text-lg">
                {initials}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-primary-text text-base group-hover:text-accent-dark transition-colors line-clamp-1">
              {coach.user.name}
            </h3>
            <p className="text-secondary-text text-sm line-clamp-1 mt-0.5">{coach.headline}</p>
            <div className="mt-1.5">
              {coach.verificationStatus === "VERIFIED" && (
                <VerifiedBadge lastVerifiedAt={coach.lastVerifiedAt} size="sm" />
              )}
            </div>
          </div>
        </div>

        <p className="text-secondary-text text-sm line-clamp-2 mb-4 flex-1">{coach.bio}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {coach.games.slice(0, 3).map((game) => (
            <span
              key={game}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-border"
            >
              {game}
            </span>
          ))}
          {coach.games.length > 3 && (
            <span className="text-xs text-secondary-text">+{coach.games.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            {avgRating !== null ? (
              <>
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-semibold text-primary-text">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-secondary-text">({coach.reviews?.length})</span>
              </>
            ) : (
              <span className="text-xs text-secondary-text">No reviews yet</span>
            )}
          </div>
          <span className="text-base font-bold text-accent-dark">
            ${(coach.rateCents / 100).toFixed(0)}<span className="text-xs font-normal text-secondary-text">/hr</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
