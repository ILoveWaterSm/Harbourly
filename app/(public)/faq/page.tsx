'use client'

import { useState } from 'react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How are coaches verified?',
    answer:
      'Every coach submits a government-issued ID, gameplay screenshots from their official rank ladder, and completes a game-specific skill quiz. Our admin team reviews all submissions before approving a coach.',
  },
  {
    question: 'What happens if I\'m unhappy with my session?',
    answer:
      'You can open a dispute within 48 hours of a session ending. Our team reviews evidence from both parties and issues a refund or releases payment based on the outcome.',
  },
  {
    question: 'How does payment work?',
    answer:
      'Your payment is held securely via Stripe when you book. The coach only receives payment after the session is marked complete — protecting both parties.',
  },
  {
    question: 'Can I cancel a booking?',
    answer:
      'Yes. Each coach sets their own cancellation window (typically 24 hours). If you cancel within that window, you receive a full refund. Cancellations after the window may receive a partial refund.',
  },
  {
    question: 'What is a VOD review?',
    answer:
      'After a coaching session, a coach can upload a video-on-demand (VOD) review with timestamped notes on your gameplay and personalised homework drills to practise between sessions.',
  },
  {
    question: 'How much do sessions cost?',
    answer:
      'Coaches set their own prices. Use the filters on the Browse page to find coaches within your budget. Prices start from $5 per session.',
  },
  {
    question: 'Are there any fees for players?',
    answer:
      'No. Players pay only the coach\'s listed price. There are no extra booking fees or platform charges for customers.',
  },
  {
    question: 'How do I become a coach?',
    answer:
      'Sign up for a coach account, complete your profile, and submit your verification materials. Once approved, you can set your availability and start accepting bookings.',
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="flex items-center justify-between w-full py-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium text-text-primary pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-text-secondary flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="pb-4 text-sm text-text-secondary leading-relaxed">{answer}</div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-sora font-bold text-4xl text-text-primary text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-text-secondary text-center mb-10">
            Can&apos;t find what you&apos;re looking for? Visit our{' '}
            <a href="/support" className="text-accent hover:underline">
              support page
            </a>
            .
          </p>
          <div className="card p-6 divide-y divide-border">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
