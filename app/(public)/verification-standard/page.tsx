import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { ShieldCheck, FileCheck, Gamepad2, ClipboardList, CheckCircle, XCircle } from 'lucide-react'

export const metadata = { title: 'Verification Standard' }

export default function VerificationStandardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="bg-accent-gradient py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <ShieldCheck className="w-12 h-12 text-white mx-auto mb-4" aria-hidden="true" />
            <h1 className="font-sora font-bold text-4xl text-white mb-4">
              Habourly Verification Standard
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Every coach on our platform completes a rigorous three-part verification process
              before they can accept bookings.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: FileCheck,
                title: 'Identity Verification',
                description:
                  'We verify a government-issued ID to confirm the coach is who they say they are. No anonymous coaches.',
              },
              {
                icon: Gamepad2,
                title: 'Gameplay Proof',
                description:
                  'Coaches must submit verified screenshots or clips from official rank ladders proving their claimed rank.',
              },
              {
                icon: ClipboardList,
                title: 'Skill Assessment',
                description:
                  'A game-specific quiz tests coaching knowledge: communication, pedagogy, and game-specific mechanics.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-6 text-center">
                <Icon className="w-8 h-8 text-accent mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-sora font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <div className="card p-8 mb-8">
            <h2 className="font-sora font-bold text-xl text-text-primary mb-6">
              What &quot;Verified&quot; means for you
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Coach's real identity is confirmed",
                'Claimed rank is independently verified',
                'Coaching knowledge is tested',
                'No misleading or deceptive claims',
                'Bound by our Code of Conduct',
                'Can lose verification status for violations',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8 border-error/20">
            <h2 className="font-sora font-bold text-xl text-text-primary mb-4">
              What coaches are NOT allowed to claim
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                '"Guaranteed rank improvement"',
                '"Guaranteed win rate"',
                '"Boosting" or "carry services"',
                '"100% win rate" claims',
                'Account sharing',
                'Deceptive before/after rank claims',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
