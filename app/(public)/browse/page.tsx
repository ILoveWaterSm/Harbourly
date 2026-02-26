import { Suspense } from 'react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import BrowsePageClient from './BrowsePageClient'

export const metadata = { title: 'Browse Coaches' }

export default function BrowsePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="font-sora font-bold text-3xl text-text-primary mb-2">
              Browse Coaches
            </h1>
            <p className="text-text-secondary">
              All coaches are identity-verified and skill-tested before they can take bookings.
            </p>
          </div>
          <Suspense fallback={<div className="text-text-secondary">Loading coaches…</div>}>
            <BrowsePageClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
