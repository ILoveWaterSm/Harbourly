import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { Search, CalendarCheck, MessageSquare, Star, ShieldCheck, CreditCard } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'How It Works' }

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Browse verified coaches',
    description:
      'Use our filters to find a coach who specialises in your game, speaks your language, and fits your budget. Every coach has a verified rank and identity.',
  },
  {
    icon: CalendarCheck,
    step: '02',
    title: 'Book a session',
    description:
      'Choose a date and time from the coach\'s availability calendar. Select the service package that suits your goals.',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Pay securely',
    description:
      'Your payment is held in escrow via Stripe. The coach only receives the funds after your session is completed — never before.',
  },
  {
    icon: MessageSquare,
    step: '04',
    title: 'Have your session',
    description:
      'Connect with your coach at the agreed time. Use the in-platform messaging to share your Discord, gameplay files, or any notes.',
  },
  {
    icon: Star,
    step: '05',
    title: 'Get your VOD review',
    description:
      'After the session, your coach can upload a VOD review with timestamped notes and personalised homework drills.',
  },
  {
    icon: ShieldCheck,
    step: '06',
    title: 'Leave a review',
    description:
      'Share your experience with the community. If anything went wrong, our dispute process protects both parties fairly.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="bg-accent-gradient py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-sora font-bold text-4xl text-white mb-4">How Habourly works</h1>
            <p className="text-white/80 text-lg leading-relaxed">
              A transparent, safe, and simple way to book gaming coaching.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map(({ icon: Icon, step, title, description }) => (
              <div key={step} className="card p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-button bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                    Step {step}
                  </span>
                  <h3 className="font-sora font-semibold text-text-primary mt-1 mb-2">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface border-t border-border py-12 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-sora font-bold text-2xl text-text-primary mb-4">
              Ready to get started?
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/browse" className="btn-primary">
                Browse Coaches
              </Link>
              <Link href="/signup" className="btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
