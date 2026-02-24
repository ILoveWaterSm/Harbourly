import Link from "next/link";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
                <ShieldCheckIcon className="h-4 w-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-primary-text">Harbourly</span>
            </Link>
            <p className="text-secondary-text text-sm leading-relaxed">
              Your safe harbour. Verified coaches, real proof, secure bookings.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-primary-text text-sm mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/coaches" className="text-secondary-text hover:text-primary-text text-sm transition-colors">Browse Coaches</Link></li>
              <li><Link href="/how-it-works" className="text-secondary-text hover:text-primary-text text-sm transition-colors">How It Works</Link></li>
              <li><Link href="/become-a-coach" className="text-secondary-text hover:text-primary-text text-sm transition-colors">Become a Coach</Link></li>
              <li><Link href="/pricing" className="text-secondary-text hover:text-primary-text text-sm transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-primary-text text-sm mb-3">Trust</h4>
            <ul className="space-y-2">
              <li><Link href="/verification" className="text-secondary-text hover:text-primary-text text-sm transition-colors">Verification</Link></li>
              <li><Link href="/support" className="text-secondary-text hover:text-primary-text text-sm transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-primary-text text-sm mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-secondary-text hover:text-primary-text text-sm transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="text-secondary-text hover:text-primary-text text-sm transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-secondary-text text-sm">© 2025 Harbourly. All rights reserved.</p>
          <p className="text-secondary-text text-xs">No guaranteed rank boosts. Just real coaching, real proof, fair play.</p>
        </div>
      </div>
    </footer>
  );
}
