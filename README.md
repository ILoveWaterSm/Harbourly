# Habourly

The trusted marketplace for verified gaming coaches. Connect with skilled, identity-verified coaches for 1-on-1 sessions, VOD reviews, and personalised improvement plans.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom brand tokens
- **Fonts**: Sora (headings) + Inter (body/UI) via `next/font`
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth v4 (Credentials provider, extendable to OAuth)
- **Payments**: Stripe (Checkout + PaymentIntents + Stripe Connect)
- **Storage**: S3-compatible interface (filesystem mock for dev)
- **Email**: Resend interface (mock for dev)
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Linting**: ESLint + Prettier

## Quick Start

### 1. Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)

### 2. Clone & Install

```bash
git clone <repo-url>
cd Harbourly
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values. At minimum you need:
- `DATABASE_URL`
- `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

### 4. Start the Database

```bash
docker compose up -d
```

### 5. Run Database Migrations & Seed

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 6. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Seed Accounts

After seeding, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@habourly.com | Admin123! |
| Coach (Verified) | coach1@example.com | Coach123! |
| Coach (Pending) | coach2@example.com | Coach123! |
| Coach (Rejected) | coach3@example.com | Coach123! |
| Player | player1@example.com | Player123! |
| Player | player2@example.com | Player123! |

## Project Structure

```
app/
  (public)/          # Public marketing pages
  (auth)/            # Login & signup
  (dashboard)/       # Protected dashboards
    customer/        # Player dashboard
    coach/           # Coach dashboard
    admin/           # Admin console
  api/               # Route handlers
    auth/            # NextAuth + registration
    coaches/         # Coach browse/profile API
    bookings/        # Booking management
    reviews/         # Review submission
    disputes/        # Dispute management
    vod-notes/       # VOD review notes
    stripe/webhook/  # Stripe event handler
    admin/           # Admin-only endpoints

components/
  ui/                # Shared UI components
  Providers.tsx      # NextAuth SessionProvider

lib/
  auth.ts            # NextAuth configuration
  prisma.ts          # Prisma singleton
  stripe.ts          # Stripe client
  validators.ts      # Zod schemas
  banned-phrases.ts  # Content moderation
  policies.ts        # Cancellation policy logic
  storage.ts         # S3-compatible storage
  email.ts           # Email provider
  audit.ts           # Audit log helper

prisma/
  schema.prisma      # Database schema
  seed.ts            # Seed data

tests/
  banned-phrases.test.ts
  validators.test.ts

types/
  next-auth.d.ts     # NextAuth type extensions
```

## Running Tests

```bash
# Unit tests
npm test

# Unit tests in watch mode
npm run test:watch
```

## Brand Design Tokens

| Token | Value |
|-------|-------|
| Background | `#F9FAFB` |
| Surface | `#FFFFFF` |
| Text Primary | `#111827` |
| Text Secondary | `#6B7280` |
| Borders | `#D1D5DB` |
| Accent | `#22C55E` |
| Accent Dark | `#166534` |
| Success | `#10B981` |
| Error | `#EF4444` |

## Verification Standard

Every coach on Habourly must complete:
1. **Identity verification** – Government-issued ID
2. **Gameplay proof** – Screenshots/clips from official rank ladders
3. **Skill quiz** – Game-specific coaching knowledge assessment

Coaches may **not** claim guaranteed ranks, wins, or offer boosting services.

## Deployment

### Stripe Webhook

Configure a Stripe webhook endpoint pointing to:
```
https://your-domain.com/api/stripe/webhook
```

Events to enable:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

### Database

Run migrations in production:
```bash
npx prisma migrate deploy
```
