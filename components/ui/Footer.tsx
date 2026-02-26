import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-button bg-accent-gradient flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-sora font-bold text-text-primary">Habourly</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              The trusted marketplace for verified gaming coaches.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              Platform
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Browse Coaches', href: '/browse' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Pricing & Fees', href: '/pricing' },
                { label: 'FAQ', href: '/faq' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coaches */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              Coaches
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Become a Coach', href: '/become-a-coach' },
                { label: 'Verification Standard', href: '/verification-standard' },
                { label: 'Coach Dashboard', href: '/coach' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              Support
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Support & Disputes', href: '/support' },
                { label: 'Terms & Privacy', href: '/terms' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} Habourly. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary">
            Helping players improve — no shortcuts, just skill.
          </p>
        </div>
      </div>
    </footer>
  )
}
