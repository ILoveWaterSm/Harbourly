import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { FileCheck, Gamepad2, ClipboardList, DollarSign, Calendar, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Become a Coach' }

const steps = [
  { icon: FileCheck, title: 'Create your account', description: 'Sign up as a coach and complete your profile with your bio, games, and pricing.' },
  { icon: Gamepad2, title: 'Submit verification', description: 'Provide identity verification and gameplay proof so players can trust you.' },
  { icon: ClipboardList, title: 'Pass the skill quiz', description: 'Complete a short game-specific quiz to demonstrate your coaching knowledge.' },
  { icon: Calendar, title: 'Set your schedule', description: 'Configure your weekly availability and players can start booking your time.' },
  { icon: DollarSign, title: 'Get paid', description: 'Sessions are paid via Stripe Connect. Receive payouts after each completed session.' },
]

export default function BecomeACoachPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="bg-accent-gradient py-20 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-sora font-bold text-4xl text-white mb-4">
              Share your skills. Earn on your schedule.
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Join Habourly as a verified coach and help players reach their potential.
              Set your own prices, manage your own time.
            </p>
            <Link
              href="/signup?role=coach"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent-dark font-semibold rounded-button hover:bg-white/90 transition-colors"
            >
              Apply to Coach
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="py-16 px-4 max-w-4xl mx-auto">
          <h2 className="font-sora font-bold text-2xl text-center text-text-primary mb-10">
            How to get started
          </h2>
          <div className="space-y-4">
            {steps.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="card p-5 flex items-start gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold font-sora">
                  {i + 1}
                </div>
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-sora font-semibold text-text-primary mb-1">{title}</h3>
                    <p className="text-sm text-text-secondary">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface border-t border-border py-10 px-4 text-center">
          <p className="text-text-secondary mb-4 text-sm">
            Questions? Read our{' '}
            <Link href="/faq" className="text-accent hover:underline">
              FAQ
            </Link>{' '}
            or check the{' '}
            <Link href="/verification-standard" className="text-accent hover:underline">
              Verification Standard
            </Link>
            .
          </p>
          <Link href="/signup?role=coach" className="btn-primary">
            Apply Now
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
