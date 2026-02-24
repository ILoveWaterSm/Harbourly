"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { registerAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await registerAction(formData);
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
          <h1 className="font-heading text-2xl font-bold text-primary-text">Join Harbourly</h1>
          <p className="text-secondary-text mt-2 text-sm">Your safe harbour for verified coaching starts here.</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[6px] text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="input"
                placeholder="Your name"
              />
              {fieldErrors.name && <p className="text-error text-xs mt-1">{fieldErrors.name[0]}</p>}
            </div>

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
                autoComplete="new-password"
                required
                className="input"
                placeholder="At least 8 characters"
              />
              {fieldErrors.password && <p className="text-error text-xs mt-1">{fieldErrors.password[0]}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full text-sm py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-secondary-text mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent font-medium hover:text-accent-dark">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-secondary-text mt-4">
          By joining, you agree to our{" "}
          <Link href="/terms" className="hover:text-primary-text underline">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:text-primary-text underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
