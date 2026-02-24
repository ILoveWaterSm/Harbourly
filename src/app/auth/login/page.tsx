"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result && !result.success) {
        setError(result.error || null);
        setFieldErrors(result.fieldErrors || {});
      }
    });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-accent" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-primary-text">Welcome back</h1>
          <p className="text-secondary-text mt-2 text-sm">Sign in to your safe harbour.</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[6px] text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder="you@example.com"
              />
              {fieldErrors.email && <p className="text-error text-xs mt-1">{fieldErrors.email[0]}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input"
                placeholder="Your password"
              />
              {fieldErrors.password && <p className="text-error text-xs mt-1">{fieldErrors.password[0]}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full text-sm py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-secondary-text mt-6">
            New to Harbourly?{" "}
            <Link href="/auth/register" className="text-accent font-medium hover:text-accent-dark">
              Create account
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-[8px] border border-blue-100">
          <p className="text-xs text-blue-700 font-medium mb-2">Demo accounts:</p>
          <div className="space-y-1 text-xs text-blue-600">
            <div><strong>Admin:</strong> admin@harbourly.test / AdminPass123!</div>
            <div><strong>Player:</strong> player@harbourly.test / PlayerPass123!</div>
            <div><strong>Coach:</strong> coach1@harbourly.test / CoachPass123!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
