import Link from "next/link";
import { ShieldCheckIcon, StarIcon, BoltIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";
import CoachCard from "@/components/ui/CoachCard";

async function getTopCoaches() {
  try {
    const coaches = await prisma.coachProfile.findMany({
      where: { verificationStatus: "VERIFIED" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        reviews: { select: { rating: true } },
      },
    });
    return coaches;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const coaches = await getTopCoaches();

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheckIcon className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-green-700">Verification-first marketplace</span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-primary-text mb-6 leading-tight">
            Find your{" "}
            <span className="text-accent">safe harbour.</span>
            <br />
            Level up with verified coaches.
          </h1>
          <p className="text-secondary-text text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Real proof. Verified coaches. Transparent pricing. Book securely and build your skills &mdash; no shady &quot;boosts,&quot; just real progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/coaches" className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2">
              Browse verified coaches
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href="/how-it-works" className="btn-secondary text-base px-8 py-3">
              How it works
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-6 mt-14 pt-8 border-t border-border/60">
            <div className="flex items-center gap-2 text-secondary-text text-sm">
              <ShieldCheckIcon className="h-4 w-4 text-accent" />
              <span>ID-verified coaches</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-text text-sm">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span>Real booking reviews only</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-text text-sm">
              <BoltIcon className="h-4 w-4 text-accent" />
              <span>Dispute protection</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-text text-sm">
              <UserGroupIcon className="h-4 w-4 text-accent" />
              <span>Trusted community</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-primary-text mb-4">How Harbourly works</h2>
          <p className="text-secondary-text text-base max-w-xl mx-auto">Three steps to your first session.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Browse verified coaches",
              desc: "Every coach on Harbourly has passed our verification process. View their proof, ratings, and real reviews.",
              icon: ShieldCheckIcon,
            },
            {
              step: "02",
              title: "Book & pay securely",
              desc: "Choose your slot, see the full fee breakdown, and pay with confidence. Your money is protected.",
              icon: BoltIcon,
            },
            {
              step: "03",
              title: "Level up, then review",
              desc: "Complete your session, mark it done, then leave a verified review. Real feedback, real community.",
              icon: StarIcon,
            },
          ].map((item) => (
            <div key={item.step} className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                <item.icon className="h-6 w-6 text-accent" />
              </div>
              <div className="text-xs font-bold text-accent mb-2">{item.step}</div>
              <h3 className="font-heading font-semibold text-primary-text text-lg mb-3">{item.title}</h3>
              <p className="text-secondary-text text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured coaches */}
      {coaches.length > 0 && (
        <section className="bg-white border-y border-border py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-heading text-3xl font-bold text-primary-text mb-2">Top verified coaches</h2>
                <p className="text-secondary-text text-sm">Vetted, reviewed, and ready to help you build.</p>
              </div>
              <Link href="/coaches" className="btn-secondary text-sm hidden sm:inline-flex">
                See all coaches
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/coaches" className="btn-secondary text-sm">See all coaches</Link>
            </div>
          </div>
        </section>
      )}

      {/* Trust section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="card p-10 sm:p-16 text-center bg-gradient-to-br from-green-50 to-white border-green-100">
          <ShieldCheckIcon className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-heading text-3xl font-bold text-primary-text mb-4">
            We ban &quot;guaranteed rank boosts.&quot;<br />
            <span className="text-accent">On purpose.</span>
          </h2>
          <p className="text-secondary-text text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Harbourly is a trust-first platform. Every coach shows real proof. Every review is tied to a real booking. No hype, no scams &mdash; just fair play and real improvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/verification" className="btn-primary px-8 py-3">
              Learn about verification
            </Link>
            <Link href="/become-a-coach" className="btn-secondary px-8 py-3">
              Apply as a coach
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
