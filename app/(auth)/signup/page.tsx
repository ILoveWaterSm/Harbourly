'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Gamepad2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { signUpSchema } from '@/lib/validators'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'coach' ? 'COACH' : 'CUSTOMER'

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole as 'CUSTOMER' | 'COACH',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const parsed = signUpSchema.safeParse(form)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Registration failed')
        return
      }

      // Auto sign in after registration
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.ok) {
        router.push(form.role === 'COACH' ? '/coach' : '/customer')
      } else {
        router.push('/login')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-4">
            <div className="w-9 h-9 rounded-button bg-accent-gradient flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-sora font-bold text-xl text-text-primary">Habourly</span>
          </Link>
          <h1 className="font-sora font-bold text-2xl text-text-primary">Create your account</h1>
          <p className="text-sm text-text-secondary mt-1">
            {form.role === 'COACH' ? 'Join as a coach' : 'Start improving your game'}
          </p>
        </div>

        <div className="card p-6">
          {error && (
            <div role="alert" className="mb-4 p-3 bg-error/10 border border-error/20 rounded-button text-sm text-error">
              {error}
            </div>
          )}

          {/* Role toggle */}
          <div className="flex rounded-button border border-border overflow-hidden mb-5">
            {(['CUSTOMER', 'COACH'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  form.role === r
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:bg-background'
                }`}
              >
                {r === 'CUSTOMER' ? 'Player' : 'Coach'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pr-10"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-xs text-text-secondary text-center mt-4">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>

        <p className="text-center text-sm text-text-secondary mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignupForm />
    </Suspense>
  )
}
