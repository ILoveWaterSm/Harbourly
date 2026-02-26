import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const hash = (p: string) => bcrypt.hash(p, 10)

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@habourly.com' },
    update: {},
    create: {
      email: 'admin@habourly.com',
      name: 'Admin User',
      passwordHash: await hash('Admin123!'),
      role: 'ADMIN',
    },
  })

  // Customers
  const customer1 = await prisma.user.upsert({
    where: { email: 'player1@example.com' },
    update: {},
    create: {
      email: 'player1@example.com',
      name: 'Alex Player',
      passwordHash: await hash('Player123!'),
      role: 'CUSTOMER',
    },
  })

  const customer2 = await prisma.user.upsert({
    where: { email: 'player2@example.com' },
    update: {},
    create: {
      email: 'player2@example.com',
      name: 'Sam Gamer',
      passwordHash: await hash('Player123!'),
      role: 'CUSTOMER',
    },
  })

  // Coaches
  const coachUser1 = await prisma.user.upsert({
    where: { email: 'coach1@example.com' },
    update: {},
    create: {
      email: 'coach1@example.com',
      name: 'Jordan Coach',
      passwordHash: await hash('Coach123!'),
      role: 'COACH',
    },
  })

  const coachUser2 = await prisma.user.upsert({
    where: { email: 'coach2@example.com' },
    update: {},
    create: {
      email: 'coach2@example.com',
      name: 'Riley Pro',
      passwordHash: await hash('Coach123!'),
      role: 'COACH',
    },
  })

  const coachUser3 = await prisma.user.upsert({
    where: { email: 'coach3@example.com' },
    update: {},
    create: {
      email: 'coach3@example.com',
      name: 'Morgan Expert',
      passwordHash: await hash('Coach123!'),
      role: 'COACH',
    },
  })

  // Coach Profiles
  const profile1 = await prisma.coachProfile.upsert({
    where: { userId: coachUser1.id },
    update: {},
    create: {
      userId: coachUser1.id,
      displayName: 'JordanCoaches',
      bio: 'Former Valorant Radiant player with 3 years of competitive experience. I specialise in aim training, agent fundamentals, and map control strategy. My sessions are focused on identifying your specific weaknesses and building drills to fix them. I have helped 200+ students reach their rank goals.',
      games: ['Valorant', 'CS2'],
      ranks: { Valorant: 'Radiant', CS2: 'Global Elite' },
      languages: ['English', 'Spanish'],
      pricingFrom: 3500,
      isActive: true,
      timezone: 'America/New_York',
      cancellationHours: 24,
    },
  })

  const profile2 = await prisma.coachProfile.upsert({
    where: { userId: coachUser2.id },
    update: {},
    create: {
      userId: coachUser2.id,
      displayName: 'RileyPro',
      bio: 'League of Legends Diamond support main with extensive knowledge of the meta. I focus on macro play, vision control, and team communication. Each session includes a VOD review with timestamped notes so you can track your progress.',
      games: ['League of Legends', 'Teamfight Tactics'],
      ranks: { 'League of Legends': 'Diamond I', 'Teamfight Tactics': 'Master' },
      languages: ['English', 'French'],
      pricingFrom: 2500,
      isActive: true,
      timezone: 'Europe/Paris',
      cancellationHours: 12,
    },
  })

  const profile3 = await prisma.coachProfile.upsert({
    where: { userId: coachUser3.id },
    update: {},
    create: {
      userId: coachUser3.id,
      displayName: 'MorganFN',
      bio: 'Fortnite top 200 player specialising in building mechanics, edit speed, and zone management. I offer custom drill plans based on your current skill level.',
      games: ['Fortnite', 'Apex Legends'],
      ranks: { Fortnite: 'Top 200 Arena', 'Apex Legends': 'Predator' },
      languages: ['English'],
      pricingFrom: 2000,
      isActive: true,
      timezone: 'America/Los_Angeles',
      cancellationHours: 24,
    },
  })

  // Verifications
  await prisma.verificationSubmission.upsert({
    where: { coachId: profile1.id },
    update: {},
    create: {
      coachId: profile1.id,
      status: 'VERIFIED',
      idVerified: true,
      gameplayProofProvided: true,
      skillQuizPassed: true,
      skillQuizScore: 92,
      lastVerifiedAt: new Date(),
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      reviewedBy: admin.id,
    },
  })

  await prisma.verificationSubmission.upsert({
    where: { coachId: profile2.id },
    update: {},
    create: {
      coachId: profile2.id,
      status: 'PENDING',
      idVerified: true,
      gameplayProofProvided: true,
      skillQuizPassed: false,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.verificationSubmission.upsert({
    where: { coachId: profile3.id },
    update: {},
    create: {
      coachId: profile3.id,
      status: 'REJECTED',
      adminNotes: 'Gameplay screenshots not from official ranked mode.',
      submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      reviewedBy: admin.id,
    },
  })

  // Services for coach1
  const service1 = await prisma.servicePackage.create({
    data: {
      coachId: profile1.id,
      name: '60-Minute VOD Review',
      description: 'We watch one of your recent ranked games together and I identify your top 3 improvement areas with a personalised drill plan.',
      durationMins: 60,
      priceCents: 4000,
      bundleCount: 1,
    },
  })

  const service2 = await prisma.servicePackage.create({
    data: {
      coachId: profile1.id,
      name: '5-Session Improvement Bundle',
      description: 'Five 60-minute sessions with a structured curriculum, progress tracking, and weekly homework drills.',
      durationMins: 60,
      priceCents: 17500,
      bundleCount: 5,
    },
  })

  // Availability rules for coach1 (Mon–Fri 18:00–22:00)
  for (const day of [1, 2, 3, 4, 5]) {
    await prisma.availabilityRule.create({
      data: {
        coachId: profile1.id,
        dayOfWeek: day,
        startTime: '18:00',
        endTime: '22:00',
      },
    })
  }

  // Sample completed booking + review
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer1.id,
      coachId: coachUser1.id,
      serviceId: service1.id,
      slotStartUtc: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      slotEndUtc: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      status: 'COMPLETED',
      policySnapshot: { cancellationHours: 24, snapshotAt: new Date().toISOString() },
    },
  })

  await prisma.review.create({
    data: {
      bookingId: booking1.id,
      customerId: customer1.id,
      coachId: profile1.id,
      rating: 5,
      text: 'Incredible session. Jordan identified exactly what was holding me back and gave me clear drills to fix my crosshair placement. My aim has improved noticeably in just two weeks of practice.',
    },
  })

  const booking2 = await prisma.booking.create({
    data: {
      customerId: customer2.id,
      coachId: coachUser1.id,
      serviceId: service1.id,
      slotStartUtc: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      slotEndUtc: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      status: 'COMPLETED',
      policySnapshot: { cancellationHours: 24, snapshotAt: new Date().toISOString() },
    },
  })

  await prisma.review.create({
    data: {
      bookingId: booking2.id,
      customerId: customer2.id,
      coachId: profile1.id,
      rating: 5,
      text: 'Best coaching session I\'ve ever had. Jordan is patient, professional, and incredibly knowledgeable. Highly recommend.',
    },
  })

  console.log('Seed complete!')
  console.log({
    admin: admin.email,
    coaches: [coachUser1.email, coachUser2.email, coachUser3.email],
    customers: [customer1.email, customer2.email],
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
