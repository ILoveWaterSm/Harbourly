import { describe, it, expect } from 'vitest'
import { signUpSchema, loginSchema, reviewSchema, bookingSchema } from '@/lib/validators'

describe('signUpSchema', () => {
  it('accepts valid signup data', () => {
    const result = signUpSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Secure123!',
      role: 'CUSTOMER',
    })
    expect(result.success).toBe(true)
  })

  it('rejects weak password', () => {
    const result = signUpSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = signUpSchema.safeParse({
      name: 'Test User',
      email: 'not-an-email',
      password: 'Secure123!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short name', () => {
    const result = signUpSchema.safeParse({
      name: 'A',
      email: 'test@example.com',
      password: 'Secure123!',
    })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'anypassword',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('reviewSchema', () => {
  it('accepts valid review', () => {
    const result = reviewSchema.safeParse({
      bookingId: 'clxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rating: 5,
      text: 'Great session, learned a lot from this coach!',
    })
    expect(result.success).toBe(true)
  })

  it('rejects out-of-range rating', () => {
    const result = reviewSchema.safeParse({
      bookingId: 'clxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rating: 6,
      text: 'Great session!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short review text', () => {
    const result = reviewSchema.safeParse({
      bookingId: 'clxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rating: 4,
      text: 'Good',
    })
    expect(result.success).toBe(false)
  })
})
