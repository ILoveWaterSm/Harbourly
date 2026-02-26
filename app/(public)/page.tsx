import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { ShieldCheck, Star, MessageSquare, ArrowRight, Gamepad2, Clock, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-accent-gradient py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-sora font-bold text-4xl sm:text-5xl text-white leading-tight mb-6">
              Level up with a verified gaming coach
            </h1>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              Every coach on Habourly is identity-verified and skill-tested.
              Book a 1-on-1 session and start improving today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-accent-dark font-semibold rounded-button text-base hover:bg-white/90 transition-colors shadow-subtle"
              >
                Browse Coaches
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-medium rounded-button text-base hover:bg-white/10 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="bg-surface border-b border-border py-8">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: ShieldCheck, stat: '100%', label: 'Coaches are identity & skill verified' },
              { icon: Star, stat: '4.8★', label: 'Average coach rating' },
              { icon: Users, stat: '10k+', label: 'Sessions completed' },
            ].map(({ icon: Icon, stat, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
                <span className="font-sora font-bold text-2xl text-text-primary">{stat}</span>
                <span className="text-sm text-text-secondary">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How it works preview */}
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <h2 className="font-sora font-bold text-3xl text-center text-text-primary mb-12">
            How Habourly works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: Gamepad2,
                title: 'Find your coach',
                description:
                  'Browse verified coaches by game, rank, language and price. Read reviews from real players.',
              },
              {
                step: '2',
                icon: Clock,
                title: 'Book a session',
                description:
                  "Choose a time that works for you and pay securely. Your payment is only released after the session.",
              },
              {
                step: '3',
                icon: MessageSquare,
                title: 'Improve your game',
                description:
                  'Join your session, get personalised feedback, and receive a VOD review with homework drills.',
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="card p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-accent-gradient text-white font-sora font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <Icon className="w-6 h-6 text-accent mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-sora font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/how-it-works" className="btn-secondary">
              Learn more
            </Link>
          </div>
        </section>

        {/* Featured games */}
        <section className="bg-surface border-t border-border py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-sora font-bold text-2xl text-center text-text-primary mb-8">
              Popular games
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Valorant',
                'League of Legends',
                'Fortnite',
                'Apex Legends',
                'CS2',
                'Overwatch 2',
                'Rocket League',
                'Teamfight Tactics',
              ].map((game) => (
                <Link
                  key={game}
                  href={`/browse?game=${encodeURIComponent(game)}`}
                  className="px-4 py-2 rounded-button border border-border bg-background text-sm font-medium text-text-secondary hover:border-accent hover:text-accent transition-colors"
                >
                  {game}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-sora font-bold text-3xl text-text-primary mb-4">
              Ready to improve?
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Join thousands of players who have improved their skills with Habourly&apos;s
              verified coaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="btn-primary text-base px-6 py-3">
                Create your free account
              </Link>
              <Link href="/become-a-coach" className="btn-secondary text-base px-6 py-3">
                Become a coach
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
