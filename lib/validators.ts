import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  role: z.enum(['CUSTOMER', 'COACH']).default('CUSTOMER'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const coachProfileSchema = z.object({
  displayName: z.string().min(2).max(80),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(2000),
  games: z.array(z.string()).min(1, 'Select at least one game'),
  ranks: z.record(z.string(), z.string()),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  pricingFrom: z.number().int().min(500, 'Minimum price is $5.00'),
  timezone: z.string(),
  cancellationHours: z.number().int().min(0).max(72),
})

export const servicePackageSchema = z.object({
  name: z.string().min(3).max(80),
  description: z.string().min(20).max(1000),
  durationMins: z.number().int().min(30).max(240),
  priceCents: z.number().int().min(500),
  bundleCount: z.number().int().min(1).max(10),
})

export const bookingSchema = z.object({
  serviceId: z.string().cuid(),
  slotStartUtc: z.string().datetime(),
  notes: z.string().max(500).optional(),
})

export const reviewSchema = z.object({
  bookingId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10, 'Review must be at least 10 characters').max(2000),
})

export const disputeSchema = z.object({
  bookingId: z.string().cuid(),
  reason: z.string().min(20, 'Please provide more detail').max(2000),
})

export const availabilityRuleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:mm'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:mm'),
})

export const vodNoteSchema = z.object({
  bookingId: z.string().cuid(),
  summary: z.string().min(10).max(5000),
  tags: z.array(z.string()),
  timestampsJson: z.array(z.object({ time: z.string(), note: z.string() })),
  homeworkJson: z.array(
    z.object({ drill: z.string(), description: z.string(), tag: z.string() })
  ),
})

export const coachSearchSchema = z.object({
  game: z.string().optional(),
  language: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  verifiedOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CoachProfileInput = z.infer<typeof coachProfileSchema>
export type ServicePackageInput = z.infer<typeof servicePackageSchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type DisputeInput = z.infer<typeof disputeSchema>
export type CoachSearchInput = z.infer<typeof coachSearchSchema>
