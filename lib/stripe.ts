import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set – Stripe features will not work')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover',
  typescript: true,
})

export const PLATFORM_FEE_PERCENT = Number(process.env.STRIPE_PLATFORM_FEE_PERCENT ?? 15)

export function calculateFee(amountCents: number): number {
  return Math.round((amountCents * PLATFORM_FEE_PERCENT) / 100)
}
