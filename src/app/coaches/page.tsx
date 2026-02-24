import { prisma } from "@/lib/prisma";
import CoachCard from "@/components/ui/CoachCard";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

interface SearchParams {
  game?: string;
  maxPrice?: string;
  language?: string;
  sort?: string;
}

async function getCoaches(params: SearchParams) {
  const { game, maxPrice, language, sort } = params;

  const where: Record<string, unknown> = {
    verificationStatus: "VERIFIED",
  };

  if (game) {
    where.games = { has: game };
  }
  if (language) {
    where.languages = { has: language };
  }
  if (maxPrice) {
    where.rateCents = { lte: parseInt(maxPrice) * 100 };
  }

  const orderBy: Record<string, string> = {};
  if (sort === "price_asc") orderBy.rateCents = "asc";
  else if (sort === "price_desc") orderBy.rateCents = "desc";
  else orderBy.lastVerifiedAt = "desc";

  try {
    return await prisma.coachProfile.findMany({
      where,
      orderBy,
      include: {
        user: { select: { name: true, avatarUrl: true } },
        reviews: { select: { rating: true } },
      },
    });
  } catch {
    return [];
  }
}

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const coaches = await getCoaches(params);

  const popularGames = ["League of Legends", "Valorant", "CS2", "Fortnite", "Apex Legends", "Overwatch 2", "Rocket League"];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheckIcon className="h-6 w-6 text-accent" />
            <span className="text-accent text-sm font-semibold">All coaches are verified</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary-text mb-2">Browse Verified Coaches</h1>
          <p className="text-secondary-text text-base">Find your coach. View their proof. Book securely.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <form method="GET" className="card p-4 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="label text-xs">Game</label>
            <select
              name="game"
              defaultValue={params.game || ""}
              className="input text-sm"
            >
              <option value="">All games</option>
              {popularGames.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="label text-xs">Max price ($/hr)</label>
            <input
              type="number"
              name="maxPrice"
              defaultValue={params.maxPrice || ""}
              placeholder="No limit"
              min="0"
              className="input text-sm"
            />
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="label text-xs">Language</label>
            <select
              name="language"
              defaultValue={params.language || ""}
              className="input text-sm"
            >
              <option value="">Any language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Korean">Korean</option>
              <option value="Japanese">Japanese</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="label text-xs">Sort by</label>
            <select
              name="sort"
              defaultValue={params.sort || ""}
              className="input text-sm"
            >
              <option value="">Recently verified</option>
              <option value="price_asc">Price: Low to high</option>
              <option value="price_desc">Price: High to low</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm px-4 py-2">
              Search
            </button>
            <a href="/coaches" className="btn-ghost text-sm px-4 py-2">
              Reset
            </a>
          </div>
        </form>

        {/* Badge legend */}
        <div className="flex items-center gap-4 mb-6 text-xs text-secondary-text">
          <span className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 px-2 py-0.5 rounded-full border border-green-200 text-xs font-semibold">
              <ShieldCheckIcon className="h-3 w-3 text-green-600" />
              Verified
            </span>
            = passed identity &amp; proof check
          </span>
        </div>

        {/* Results */}
        {coaches.length === 0 ? (
          <div className="text-center py-20">
            <ShieldCheckIcon className="h-12 w-12 text-border mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-primary-text text-lg mb-2">No coaches found</h3>
            <p className="text-secondary-text text-sm mb-4">Try adjusting your filters or check back soon.</p>
            <a href="/coaches" className="btn-secondary text-sm">Clear filters</a>
          </div>
        ) : (
          <>
            <p className="text-secondary-text text-sm mb-4">{coaches.length} verified coach{coaches.length !== 1 ? "es" : ""} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
