"use client";

import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

interface NavbarProps {
  user?: { name: string; role: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:bg-accent-dark transition-colors">
              <ShieldCheckIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-primary-text">Harbourly</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/coaches" className="text-secondary-text hover:text-primary-text text-sm font-medium transition-colors">
              Browse Coaches
            </Link>
            <Link href="/how-it-works" className="text-secondary-text hover:text-primary-text text-sm font-medium transition-colors">
              How It Works
            </Link>
            <Link href="/become-a-coach" className="text-secondary-text hover:text-primary-text text-sm font-medium transition-colors">
              Become a Coach
            </Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="text-secondary-text hover:text-primary-text text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="text-secondary-text hover:text-primary-text text-sm font-medium transition-colors">
                    Admin
                  </Link>
                )}
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" className="btn-ghost text-sm">
                    Sign out
                  </button>
                </form>
                <div className="w-8 h-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-bold text-xs">
                  {user.name[0].toUpperCase()}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-sm">
                  Sign in
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-secondary-text hover:text-primary-text hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-2">
          <Link href="/coaches" className="block py-2 text-sm text-secondary-text hover:text-primary-text font-medium" onClick={() => setMobileOpen(false)}>Browse Coaches</Link>
          <Link href="/how-it-works" className="block py-2 text-sm text-secondary-text hover:text-primary-text font-medium" onClick={() => setMobileOpen(false)}>How It Works</Link>
          <Link href="/become-a-coach" className="block py-2 text-sm text-secondary-text hover:text-primary-text font-medium" onClick={() => setMobileOpen(false)}>Become a Coach</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block py-2 text-sm text-secondary-text hover:text-primary-text font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="block py-2 text-sm text-secondary-text hover:text-primary-text font-medium" onClick={() => setMobileOpen(false)}>Admin</Link>
              )}
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="w-full text-left py-2 text-sm text-secondary-text hover:text-primary-text font-medium">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block py-2 text-sm text-secondary-text hover:text-primary-text font-medium" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link href="/auth/register" className="btn-primary block text-center text-sm mt-2" onClick={() => setMobileOpen(false)}>Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
