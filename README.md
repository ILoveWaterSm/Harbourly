# Harbourly 🛡️

A verification-first marketplace for gaming coaches. Your safe harbour for real coaching, real proof, and transparent pricing.

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Copy environment variables (already set for local dev)
# The .env file is pre-configured for the Docker Compose Postgres instance

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed demo data
npx prisma db seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@harbourly.test | AdminPass123! |
| Player | player@harbourly.test | PlayerPass123! |
| Coach (verified) | coach1@harbourly.test | CoachPass123! |
| Coach (pending) | coach2@harbourly.test | CoachPass123! |

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin console
│   ├── auth/              # Login/Register
│   ├── bookings/[id]/     # Booking detail
│   ├── coaches/           # Browse + profile
│   ├── dashboard/         # User/Coach dashboard
│   └── api/               # API routes
├── components/
│   ├── layout/            # Navbar, Footer
│   └── ui/                # Reusable components
└── lib/
    ├── actions/           # Server actions
    ├── auth.ts            # Session management
    ├── prisma.ts          # DB client
    └── utils.ts           # Helpers
```

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma 7
- **Styling**: Tailwind CSS v4
- **Auth**: HttpOnly cookie sessions (JWT via jose)
- **Validation**: Zod

## Features

- ✅ Verified coach marketplace with proof gallery
- ✅ Role-based access control (USER / COACH / ADMIN)
- ✅ Booking system with demo payment
- ✅ In-session chat
- ✅ Review system (tied to completed bookings)
- ✅ Dispute management with evidence URLs
- ✅ Admin verification console with audit logs
- ✅ Brand-compliant UI (Sora/Inter fonts, green accent)
