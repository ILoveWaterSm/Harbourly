'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Gamepad2 } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const dashboardHref =
    session?.user?.role === 'ADMIN'
      ? '/admin'
      : session?.user?.role === 'COACH'
      ? '/coach'
      : '/customer'

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-40 shadow-subtle">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-button bg-accent-gradient flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-sora font-bold text-lg text-text-primary">Habourly</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/browse" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Browse Coaches
          </Link>
          <Link href="/how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/become-a-coach" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Become a Coach
          </Link>
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href={dashboardHref} className="btn-ghost text-sm">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-secondary text-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-button text-text-secondary hover:text-text-primary focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-border px-4 pb-4 space-y-2">
          <Link href="/browse" className="block py-2 text-sm text-text-secondary hover:text-text-primary">
            Browse Coaches
          </Link>
          <Link href="/how-it-works" className="block py-2 text-sm text-text-secondary hover:text-text-primary">
            How It Works
          </Link>
          <Link href="/become-a-coach" className="block py-2 text-sm text-text-secondary hover:text-text-primary">
            Become a Coach
          </Link>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {session ? (
              <>
                <Link href={dashboardHref} className="btn-secondary text-sm w-full text-center">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn-secondary text-sm w-full"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm w-full text-center">
                  Log In
                </Link>
                <Link href="/signup" className="btn-primary text-sm w-full text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
