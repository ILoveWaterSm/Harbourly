import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import VerificationBadge from '@/components/ui/VerificationBadge'
import { Users, ShieldCheck, AlertCircle, BookOpen } from 'lucide-react'

export const metadata = { title: 'Admin Console' }

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') redirect('/login')

  const [totalUsers, totalCoaches, pendingVerifications, openDisputes, recentVerifications] =
    await Promise.all([
      prisma.user.count(),
      prisma.coachProfile.count(),
      prisma.verificationSubmission.count({ where: { status: 'PENDING' } }),
      prisma.dispute.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
      prisma.verificationSubmission.findMany({
        where: { status: 'PENDING' },
        include: {
          coach: {
            select: { displayName: true, userId: true },
          },
        },
        orderBy: { submittedAt: 'asc' },
        take: 10,
      }),
    ])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-sora font-bold text-3xl text-text-primary">Admin Console</h1>
            <p className="text-text-secondary mt-1">Manage the Habourly platform</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: 'Total users', value: totalUsers },
              { icon: Users, label: 'Coach profiles', value: totalCoaches },
              { icon: ShieldCheck, label: 'Pending verifications', value: pendingVerifications, alert: pendingVerifications > 0 },
              { icon: AlertCircle, label: 'Open disputes', value: openDisputes, alert: openDisputes > 0 },
            ].map(({ icon: Icon, label, value, alert }) => (
              <div key={label} className={`card p-5 ${alert ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                <Icon className={`w-5 h-5 mb-2 ${alert ? 'text-yellow-600' : 'text-accent'}`} aria-hidden="true" />
                <p className="text-2xl font-sora font-bold text-text-primary">{value}</p>
                <p className="text-xs text-text-secondary mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Pending verifications */}
          <div className="card mb-6">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-sora font-semibold text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" aria-hidden="true" />
                Pending Verifications
              </h2>
              <Link
                href="/admin/verification"
                className="text-sm text-accent hover:underline"
              >
                View all →
              </Link>
            </div>
            {recentVerifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-text-secondary">
                No pending verifications.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentVerifications.map((v) => (
                  <div key={v.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm text-text-primary">
                        {v.coach.displayName}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Submitted{' '}
                        {v.submittedAt
                          ? new Date(v.submittedAt).toLocaleDateString()
                          : 'Unknown date'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <VerificationBadge status={v.status} size="sm" />
                      <Link
                        href={`/admin/verification/${v.id}`}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Users, label: 'Manage Users', href: '/admin/users' },
              { icon: BookOpen, label: 'All Bookings', href: '/admin/bookings' },
              { icon: AlertCircle, label: 'Open Disputes', href: '/admin/disputes' },
            ].map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href} className="card p-5 hover:shadow-md transition-shadow flex items-center gap-3">
                <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                <span className="font-medium text-sm text-text-primary">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
