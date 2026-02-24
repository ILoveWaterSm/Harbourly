import { ShieldCheckIcon, StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl font-bold text-primary-text mb-4">Transparent pricing</h1>
          <p className="text-secondary-text text-lg max-w-xl mx-auto">
            No hidden fees. No surprises. See exactly what you pay before you book.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="card p-8">
            <h2 className="font-heading text-xl font-bold text-primary-text mb-4">For players</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-secondary-text text-sm">Browsing coaches</span>
                <span className="font-bold text-success">Free</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-secondary-text text-sm">Registration</span>
                <span className="font-bold text-success">Free</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-secondary-text text-sm">Session fee</span>
                <span className="font-bold text-primary-text">Coach&apos;s rate</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-secondary-text text-sm">Platform fee</span>
                <span className="font-bold text-primary-text">10% of session</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[8px] p-4 text-xs text-secondary-text">
              <strong className="text-primary-text">Example:</strong> A 1-hour session at $50/hr = $50 session + $5 platform fee = <strong className="text-primary-text">$55 total</strong>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-heading text-xl font-bold text-primary-text mb-4">For coaches</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-secondary-text text-sm">Applying to coach</span>
                <span className="font-bold text-success">Free</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-secondary-text text-sm">Verification review</span>
                <span className="font-bold text-success">Free</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-secondary-text text-sm">Platform revenue share</span>
                <span className="font-bold text-primary-text">10% per booking</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-[8px] p-4 text-xs text-secondary-text border border-green-100">
              <strong className="text-green-800">Set your own rate.</strong> You choose your hourly rate. We take 10% to keep the platform running, safe, and verified.
            </div>
          </div>
        </div>

        <div className="card p-8 text-center bg-green-50 border-green-100">
          <ShieldCheckIcon className="h-8 w-8 text-accent mx-auto mb-3" />
          <h2 className="font-heading text-xl font-bold text-primary-text mb-2">All bookings include</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {["Verified coach", "Dispute protection", "Chat support", "Review system"].map((f) => (
              <div key={f} className="flex items-center justify-center gap-1.5 text-sm text-green-700 font-medium">
                <StarIcon className="h-4 w-4 text-accent" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/coaches" className="btn-primary px-8 py-3">Browse coaches</Link>
        </div>
      </div>
    </div>
  );
}
