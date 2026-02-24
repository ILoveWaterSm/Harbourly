import { ShieldCheckIcon, DocumentCheckIcon, UserCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function VerificationPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-primary-text mb-4">Verification process</h1>
          <p className="text-secondary-text text-lg max-w-xl mx-auto">
            How we keep Harbourly a trusted, safe harbour for every player.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: UserCircleIcon, title: "Identity check", desc: "Coaches submit proof of their gaming account and real identity. We cross-reference rank data with game APIs." },
            { icon: DocumentCheckIcon, title: "Proof review", desc: "Our admin team manually reviews gameplay clips, screenshots, and rank history before approving any coach." },
            { icon: ClockIcon, title: "Regular audits", desc: "Verified badges include the last verification date. Coaches are re-reviewed periodically to stay current." },
          ].map((item) => (
            <div key={item.title} className="card p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-3">
                <item.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-primary-text mb-2">{item.title}</h3>
              <p className="text-secondary-text text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary-text mb-4">Our zero-tolerance policies</h2>
          <ul className="space-y-3">
            {[
              "No \"guaranteed rank boost\" claims — ever.",
              "No fake reviews. Every review is tied to a real, completed booking.",
              "No unverified coaches can be booked.",
              "All disputes are reviewed by the Harbourly team within 72 hours.",
            ].map((policy) => (
              <li key={policy} className="flex items-start gap-3 text-sm text-secondary-text">
                <ShieldCheckIcon className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                {policy}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link href="/become-a-coach" className="btn-primary px-8 py-3 mr-4">Apply as a coach</Link>
          <Link href="/coaches" className="btn-secondary px-8 py-3">Browse coaches</Link>
        </div>
      </div>
    </div>
  );
}
