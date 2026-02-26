import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, MessageSquare, Star, Search } from 'lucide-react'

export const metadata = { title: 'My Dashboard' }

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const recentBookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    include: {
      service: true,
      coach: { select: { name: true } },
      review: { select: { id: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const stats = {
    total: await prisma.booking.count({ where: { customerId: session.user.id } }),
    upcoming: await prisma.booking.count({
      where: {
        customerId: session.user.id,
        status: 'CONFIRMED',
        slotStartUtc: { gte: new Date() },
      },
    }),
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="font-sora font-bold text-3xl text-text-primary">
              Welcome back, {session.user.name?.split(' ')[0] ?? 'Player'}!
            </h1>
            <p className="text-text-secondary mt-1">Manage your sessions and track your progress.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Calendar, label: 'Total sessions', value: stats.total },
              { icon: Calendar, label: 'Upcoming sessions', value: stats.upcoming },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card p-5">
                <Icon className="w-5 h-5 text-accent mb-2" aria-hidden="true" />
                <p className="text-2xl font-sora font-bold text-text-primary">{value}</p>
                <p className="text-xs text-text-secondary mt-0.5">{label}</p>
              </div>
            ))}
            <div className="card p-5 flex items-center">
              <Link href="/browse" className="btn-primary w-full gap-2 justify-center">
                <Search className="w-4 h-4" />
                Find a coach
              </Link>
            </div>
          </div>

          {/* Recent bookings */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-sora font-semibold text-text-primary">Recent Bookings</h2>
            </div>
            {recentBookings.length === 0 ? (
              <div className="p-10 text-center">
                <Calendar className="w-10 h-10 text-border mx-auto mb-3" aria-hidden="true" />
                <p className="text-text-secondary text-sm">No bookings yet.</p>
                <Link href="/browse" className="btn-primary mt-4 inline-flex">
                  Browse coaches
                </Link>
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
                        with {booking.coach.name} ·{' '}
                        {new Date(booking.slotStartUtc).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-success/10 text-success'
                          : booking.status === 'COMPLETED'
                          ? 'bg-accent/10 text-accent-dark'
                          : booking.status === 'CANCELLED'
                          ? 'bg-error/10 text-error'
                          : 'bg-border/40 text-text-secondary'
                      }`}
                    >
                      {booking.status.replace('_', ' ')}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/customer/bookings/${booking.id}`}
                        className="btn-ghost text-xs px-2 py-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Link>
                      {booking.status === 'COMPLETED' && !booking.review && (
                        <Link
                          href={`/customer/bookings/${booking.id}/review`}
                          className="btn-ghost text-xs px-2 py-1 text-accent"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
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
