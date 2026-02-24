import { ShieldCheckIcon, StarIcon, BoltIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "1",
      title: "Browse verified coaches",
      description: "Every coach on Harbourly has passed our rigorous verification process. View their real proof, gaming credentials, and verified reviews from actual sessions.",
      icon: ShieldCheckIcon,
    },
    {
      step: "2",
      title: "Book & pay securely",
      description: "Pick your time slot, see a transparent fee breakdown before you pay, and book with confidence. Your payment is protected — no surprise charges.",
      icon: BoltIcon,
    },
    {
      step: "3",
      title: "Session & chat",
      description: "Connect with your coach, exchange messages, and complete your session. Both you and the coach can mark it complete.",
      icon: UserGroupIcon,
    },
    {
      step: "4",
      title: "Review & build",
      description: "Leave a verified review tied to your real booking. Help the community find trusted coaches — and level up together.",
      icon: StarIcon,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <ShieldCheckIcon className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold text-primary-text mb-4">How Harbourly works</h1>
          <p className="text-secondary-text text-lg max-w-xl mx-auto">
            A safe harbour from first click to final review. Here&apos;s how.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {steps.map((s) => (
            <div key={s.step} className="card p-8 flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <s.icon className="h-7 w-7 text-accent" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Step {s.step}</span>
                </div>
                <h2 className="font-heading text-xl font-bold text-primary-text mb-2">{s.title}</h2>
                <p className="text-secondary-text text-base leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-10 text-center bg-green-50 border-green-100">
          <h2 className="font-heading text-2xl font-bold text-primary-text mb-3">Ready to start?</h2>
          <p className="text-secondary-text mb-6">Find your safe harbour coach today.</p>
          <Link href="/coaches" className="btn-primary px-8 py-3">Browse verified coaches</Link>
        </div>
      </div>
    </div>
  );
}
