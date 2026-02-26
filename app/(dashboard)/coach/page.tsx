import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import VerificationBadge from '@/components/ui/VerificationBadge'
import { Calendar, DollarSign, Star, Settings, AlertCircle } from 'lucide-react'

export const metadata = { title: 'Coach Dashboard' }

export default async function CoachDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  if (session.user.role !== 'COACH' && session.user.role !== 'ADMIN') redirect('/customer')

  const profile = await prisma.coachProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      verification: true,
      services: { where: { isActive: true } },
    },
  })

  const recentBookings = await prisma.booking.findMany({
    where: { coachId: session.user.id },
    include: {
      service: true,
      customer: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const completedCount = await prisma.booking.count({
    where: { coachId: session.user.id, status: 'COMPLETED' },
  })

  const upcomingCount = await prisma.booking.count({
    where: {
      coachId: session.user.id,
      status: 'CONFIRMED',
      slotStartUtc: { gte: new Date() },
    },
  })

  const verStatus = profile?.verification?.status ?? 'UNVERIFIED'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-sora font-bold text-3xl text-text-primary">
                Coach Dashboard
              </h1>
              <div className="mt-2">
                <VerificationBadge status={verStatus} size="md" />
              </div>
            </div>
            <Link href="/coach/settings" className="btn-secondary gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>

          {/* Verification alert */}
          {verStatus !== 'VERIFIED' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-card flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Complete your verification</p>
                <p className="text-yellow-700 mt-0.5">
                  Submit your verification materials to start accepting bookings.
                </p>
                <Link href="/coach/verification" className="text-accent hover:underline mt-1 inline-block">
                  Start verification →
                </Link>
              </div>
            </div>
          )}

          {/* No profile warning */}
          {!profile && (
            <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-card">
              <p className="text-sm font-medium text-text-primary mb-1">Set up your profile</p>
              <p className="text-sm text-text-secondary">
                Create your coach profile to get discovered by players.
              </p>
              <Link href="/coach/profile/edit" className="btn-primary mt-3 inline-flex text-sm">
                Create profile
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Calendar, label: 'Upcoming sessions', value: upcomingCount },
              { icon: Star, label: 'Completed sessions', value: completedCount },
              {
                icon: DollarSign,
                label: 'Active services',
                value: profile?.services.length ?? 0,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card p-5">
                <Icon className="w-5 h-5 text-accent mb-2" aria-hidden="true" />
                <p className="text-2xl font-sora font-bold text-text-primary">{value}</p>
                <p className="text-xs text-text-secondary mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Recent bookings */}
          <div className="card mb-6">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-sora font-semibold text-text-primary">Recent Bookings</h2>
            </div>
            {recentBookings.length === 0 ? (
              <div className="p-10 text-center">
                <Calendar className="w-10 h-10 text-border mx-auto mb-3" aria-hidden="true" />
                <p className="text-text-secondary text-sm">No bookings yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-text-primary truncate">
                        {booking.service.name}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {booking.customer.name} ·{' '}
                        {new Date(booking.slotStartUtc).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-success/10 text-success'
                          : booking.status === 'COMPLETED'
                          ? 'bg-accent/10 text-accent-dark'
                          : 'bg-border/40 text-text-secondary'
                      }`}
                    >
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
