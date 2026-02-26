import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { AlertCircle, MessageSquare, Scale, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Support & Disputes' }

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-sora font-bold text-4xl text-text-primary text-center mb-4">
            Support & Disputes
          </h1>
          <p className="text-text-secondary text-center mb-10 leading-relaxed">
            We&apos;re here to ensure every session on Habourly is fair. If something went
            wrong, here&apos;s how to get help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {[
              {
                icon: MessageSquare,
                title: 'General support',
                description:
                  'For account issues, billing questions, or general help, contact us and we\'ll respond within 24 hours.',
                action: { label: 'Contact support', href: 'mailto:support@habourly.com' },
              },
              {
                icon: AlertCircle,
                title: 'Open a dispute',
                description:
                  'If you had a session that didn\'t go as expected, open a dispute from your booking dashboard within 48 hours.',
                action: { label: 'Go to dashboard', href: '/customer' },
              },
              {
                icon: Scale,
                title: 'Dispute process',
                description:
                  'Our team reviews evidence from both the player and coach within 5 business days and makes a fair determination.',
              },
              {
                icon: ShieldCheck,
                title: 'Player protection',
                description:
                  'Payments are held in escrow until session completion. You\'re always protected against fraud and no-shows.',
              },
            ].map(({ icon: Icon, title, description, action }) => (
              <div key={title} className="card p-6">
                <Icon className="w-6 h-6 text-accent mb-3" aria-hidden="true" />
                <h3 className="font-sora font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{description}</p>
                {action && (
                  <Link href={action.href} className="text-sm text-accent hover:underline">
                    {action.label} →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="card p-6 bg-accent/5 border-accent/20">
            <h2 className="font-sora font-semibold text-text-primary mb-2">
              Before opening a dispute
            </h2>
            <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
              <li>Try messaging the coach through the booking thread first</li>
              <li>Gather any evidence (screenshots, chat logs, recordings)</li>
              <li>Disputes must be opened within 48 hours of the session end time</li>
              <li>Our team aims to resolve disputes within 5 business days</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
