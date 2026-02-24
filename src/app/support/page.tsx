import { ShieldCheckIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold text-primary-text mb-4">Support</h1>
          <p className="text-secondary-text text-lg">We&apos;ve got your back. Here&apos;s how we can help.</p>
        </div>

        <div className="space-y-6 mb-10">
          <div className="card p-6">
            <h2 className="font-heading font-semibold text-primary-text text-lg mb-2">How disputes work</h2>
            <p className="text-secondary-text text-sm leading-relaxed mb-3">
              If something goes wrong with a booking, you can open a dispute from the booking page. Submit a reason and optional evidence link. Our team reviews all disputes within 72 hours.
            </p>
            <p className="text-xs text-secondary-text bg-gray-50 rounded p-3">
              &quot;Your dispute has been submitted. Our team will review the evidence and update you within 72 hours.&quot;
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-heading font-semibold text-primary-text text-lg mb-2">Contact us</h2>
            <p className="text-secondary-text text-sm mb-3">
              For anything else, reach out at <a href="mailto:support@harbourly.gg" className="text-accent hover:text-accent-dark">support@harbourly.gg</a>
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheckIcon className="h-5 w-5 text-accent" />
              <h2 className="font-heading font-semibold text-primary-text text-lg">Platform safety</h2>
            </div>
            <p className="text-secondary-text text-sm leading-relaxed">
              Harbourly enforces zero-tolerance policies against scam coaches, fake reviews, and fraudulent claims. All admin actions are audit-logged for full transparency.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/coaches" className="btn-primary px-8 py-3">Browse verified coaches</Link>
        </div>
      </div>
    </div>
  );
}
