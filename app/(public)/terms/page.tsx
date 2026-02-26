import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata = { title: 'Terms & Privacy' }

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-sm">
          <h1 className="font-sora font-bold text-3xl text-text-primary mb-8">
            Terms of Service & Privacy Policy
          </h1>

          <section className="card p-6 mb-6">
            <h2 className="font-sora font-semibold text-xl text-text-primary mb-4">
              Terms of Service
            </h2>
            <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
              <p>
                By using Habourly, you agree to these Terms of Service. Please read them carefully.
              </p>
              <h3 className="font-semibold text-text-primary">1. Platform Use</h3>
              <p>
                Habourly is a marketplace that connects gaming coaches with players. We do not
                employ coaches and are not responsible for the content of coaching sessions.
                Coaches are independent contractors.
              </p>
              <h3 className="font-semibold text-text-primary">2. Payments & Refunds</h3>
              <p>
                All payments are processed via Stripe. Funds are held in escrow until a session
                is completed. Cancellations within the coach&apos;s free-cancellation window receive
                a full refund.
              </p>
              <h3 className="font-semibold text-text-primary">3. Prohibited Conduct</h3>
              <p>
                Users may not engage in fraud, harassment, account sharing, rank manipulation,
                or any activity that violates the laws of their jurisdiction or our community
                guidelines.
              </p>
              <h3 className="font-semibold text-text-primary">4. Disputes</h3>
              <p>
                Disputes must be opened within 48 hours of the session end time. Habourly&apos;s
                decision in dispute resolution is final.
              </p>
              <h3 className="font-semibold text-text-primary">5. Termination</h3>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms,
                with or without notice.
              </p>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-sora font-semibold text-xl text-text-primary mb-4">
              Privacy Policy
            </h2>
            <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
              <p>
                Your privacy matters to us. This policy describes what data we collect and how
                we use it.
              </p>
              <h3 className="font-semibold text-text-primary">Data we collect</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Account information: name, email, password (hashed)</li>
                <li>Profile information: bio, games, avatar</li>
                <li>Booking and payment records (payment details via Stripe)</li>
                <li>Communications in message threads</li>
                <li>Usage data for platform improvement</li>
              </ul>
              <h3 className="font-semibold text-text-primary">How we use it</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>To operate the platform and process bookings</li>
                <li>To verify coach identity and skill</li>
                <li>To send booking confirmations and important notifications</li>
                <li>To resolve disputes and enforce our terms</li>
              </ul>
              <h3 className="font-semibold text-text-primary">Data sharing</h3>
              <p>
                We share data with Stripe for payment processing and AWS for file storage.
                We do not sell your personal data to third parties.
              </p>
              <h3 className="font-semibold text-text-primary">Your rights</h3>
              <p>
                You may request access to, correction of, or deletion of your personal data by
                contacting{' '}
                <a
                  href="mailto:privacy@habourly.com"
                  className="text-accent hover:underline"
                >
                  privacy@habourly.com
                </a>
                .
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
