import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { CheckCircle, Info } from 'lucide-react'

export const metadata = { title: 'Pricing & Fees' }

export default function PricingPage() {
  const platformFee = Number(process.env.STRIPE_PLATFORM_FEE_PERCENT ?? 15)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-sora font-bold text-4xl text-text-primary mb-4">
              Transparent pricing
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Habourly charges a simple platform fee on each session. No hidden costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="card p-8 text-center">
              <h2 className="font-sora font-semibold text-text-secondary text-sm uppercase tracking-wider mb-2">
                For Players
              </h2>
              <div className="font-sora font-bold text-5xl text-text-primary mb-2">Free</div>
              <p className="text-text-secondary text-sm mb-6">to sign up and browse coaches</p>
              <ul className="space-y-3 text-left text-sm text-text-secondary">
                {[
                  'Browse all verified coaches',
                  'Read reviews and ratings',
                  'Book sessions at coach-set prices',
                  'Secure escrow payment protection',
                  'VOD reviews and homework notes',
                  'Dispute resolution if needed',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-8 text-center border-accent/30">
              <h2 className="font-sora font-semibold text-text-secondary text-sm uppercase tracking-wider mb-2">
                For Coaches
              </h2>
              <div className="font-sora font-bold text-5xl text-accent mb-2">
                {platformFee}%
              </div>
              <p className="text-text-secondary text-sm mb-6">
                platform fee per completed session
              </p>
              <ul className="space-y-3 text-left text-sm text-text-secondary">
                {[
                  'Free to sign up and get verified',
                  'Set your own prices and availability',
                  `${platformFee}% fee only on completed sessions`,
                  'Stripe Connect payouts',
                  'Profile and booking management',
                  'Dispute protection',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-6 flex gap-3">
            <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm text-text-secondary space-y-1">
              <p className="font-medium text-text-primary">How payments work</p>
              <p>
                When a player books a session, payment is held securely by Stripe. After the
                session is marked complete, the coach receives their payout minus the{' '}
                {platformFee}% platform fee, typically within 2 business days.
              </p>
              <p>
                If a session is cancelled within the free-cancellation window, a full refund is
                issued automatically.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
