import { ShieldCheckIcon, StarIcon, CurrencyDollarIcon, UsersIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import CoachApplicationForm from "./CoachApplicationForm";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BecomeACoachPage() {
  const user = await getSession();
  let hasProfile = false;
  if (user) {
    const profile = await prisma.coachProfile.findUnique({ where: { userId: user.id } });
    hasProfile = !!profile;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <ShieldCheckIcon className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold text-primary-text mb-4">Become a verified coach</h1>
          <p className="text-secondary-text text-lg max-w-xl mx-auto">
            Share your skills, build your community, earn fairly. Apply for verification and join the safe harbour.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: ShieldCheckIcon, label: "Verified badge" },
            { icon: StarIcon, label: "Real reviews" },
            { icon: CurrencyDollarIcon, label: "You set your rate" },
            { icon: UsersIcon, label: "Trusted community" },
          ].map((item) => (
            <div key={item.label} className="card p-4 text-center">
              <item.icon className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-text">{item.label}</p>
            </div>
          ))}
        </div>

        {!user ? (
          <div className="card p-10 text-center">
            <h2 className="font-heading font-semibold text-primary-text text-xl mb-3">Sign in to apply</h2>
            <p className="text-secondary-text text-sm mb-6">Create an account or sign in to submit your coach application.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/auth/register" className="btn-primary px-6 py-2.5">Create account</Link>
              <Link href="/auth/login" className="btn-secondary px-6 py-2.5">Sign in</Link>
            </div>
          </div>
        ) : hasProfile ? (
          <div className="card p-10 text-center">
            <ShieldCheckIcon className="h-10 w-10 text-accent mx-auto mb-3" />
            <h2 className="font-heading font-semibold text-primary-text text-xl mb-2">Application submitted!</h2>
            <p className="text-secondary-text text-sm mb-2">
              We&apos;re reviewing your proof. Verification can take up to 48 hours — we appreciate your patience!
            </p>
            <Link href="/dashboard" className="btn-primary text-sm mt-4 px-6 py-2.5 inline-block">Go to dashboard</Link>
          </div>
        ) : (
          <CoachApplicationForm userId={user.id} />
        )}
      </div>
    </div>
  );
}
