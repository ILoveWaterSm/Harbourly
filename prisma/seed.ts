import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up
  await prisma.adminAuditLog.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.proofMedia.deleteMany();
  await prisma.coachProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: "admin@habourly.test",
      passwordHash: await hashPassword("AdminPass123!"),
      name: "Admin User",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin:", admin.email);

  const player = await prisma.user.create({
    data: {
      email: "player@habourly.test",
      passwordHash: await hashPassword("PlayerPass123!"),
      name: "Alex Player",
      role: "USER",
    },
  });
  console.log("✅ Player:", player.email);

  const coachUser1 = await prisma.user.create({
    data: {
      email: "coach1@habourly.test",
      passwordHash: await hashPassword("CoachPass123!"),
      name: "Jordan Rivera",
      role: "COACH",
    },
  });
  console.log("✅ Coach 1:", coachUser1.email);

  const coachUser2 = await prisma.user.create({
    data: {
      email: "coach2@habourly.test",
      passwordHash: await hashPassword("CoachPass123!"),
      name: "Sam Chen",
      role: "COACH",
    },
  });
  console.log("✅ Coach 2:", coachUser2.email);

  // Coach 1 - verified
  const coach1Profile = await prisma.coachProfile.create({
    data: {
      userId: coachUser1.id,
      headline: "Diamond Valorant coach · 500+ sessions · All roles",
      bio: "Hey! I'm Jordan, a Diamond-ranked Valorant player with 3+ years of coaching experience. I specialise in aim improvement, crosshair placement, and game sense. My sessions focus on real habits, not quick tricks. Let's build your fundamentals from the ground up.",
      games: ["Valorant", "CS2"],
      languages: ["English", "Spanish"],
      rateCents: 4500,
      verificationStatus: "VERIFIED",
      lastVerifiedAt: new Date("2025-01-15"),
    },
  });

  await prisma.proofMedia.createMany({
    data: [
      {
        coachProfileId: coach1Profile.id,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
        caption: "Diamond rank proof — Season 2024",
      },
      {
        coachProfileId: coach1Profile.id,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=800",
        caption: "Coaching session setup",
      },
    ],
  });

  await prisma.availabilitySlot.createMany({
    data: [
      { coachProfileId: coach1Profile.id, dayOfWeek: 1, startTime: "18:00", endTime: "22:00", timezone: "America/New_York" },
      { coachProfileId: coach1Profile.id, dayOfWeek: 3, startTime: "18:00", endTime: "22:00", timezone: "America/New_York" },
      { coachProfileId: coach1Profile.id, dayOfWeek: 6, startTime: "10:00", endTime: "18:00", timezone: "America/New_York" },
    ],
  });

  // Coach 2 - pending
  await prisma.coachProfile.create({
    data: {
      userId: coachUser2.id,
      headline: "Masters LoL coach · 2 years coaching · Mid/Jungle specialist",
      bio: "I'm Sam, a Masters-tier League of Legends player focused on macro play, wave management, and jungle pathing. I believe in data-driven improvement and give every student personalised drills.",
      games: ["League of Legends", "DOTA 2"],
      languages: ["English", "Chinese"],
      rateCents: 3500,
      verificationStatus: "PENDING",
    },
  });

  // Create a completed booking with review
  const booking = await prisma.booking.create({
    data: {
      userId: player.id,
      coachProfileId: coach1Profile.id,
      status: "COMPLETED",
      scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      durationMinutes: 60,
      priceCents: 4500,
      platformFeeCents: 450,
      totalCents: 4950,
      notes: "Focus on crosshair placement and peeking",
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      status: "COMPLETED",
      amountCents: 4950,
      method: "demo",
    },
  });

  await prisma.message.createMany({
    data: [
      { bookingId: booking.id, senderId: coachUser1.id, content: "Hey! Ready for our session. Let's focus on those angles today." },
      { bookingId: booking.id, senderId: player.id, content: "Awesome, yeah I really struggle with peeks especially on Haven." },
      { bookingId: booking.id, senderId: coachUser1.id, content: "Perfect, we'll do a VOD review then practice drills. See you at 7!" },
    ],
  });

  await prisma.review.create({
    data: {
      bookingId: booking.id,
      userId: player.id,
      coachProfileId: coach1Profile.id,
      rating: 5,
      comment: "Jordan is an incredible coach. Super patient, explains everything clearly, and gave me actual drills I could practice. My crosshair placement improved noticeably after just one session. Highly recommend!",
    },
  });

  // Create a paid booking (active)
  const activeBooking = await prisma.booking.create({
    data: {
      userId: player.id,
      coachProfileId: coach1Profile.id,
      status: "PAID",
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      durationMinutes: 90,
      priceCents: 6750,
      platformFeeCents: 675,
      totalCents: 7425,
      notes: "Want to work on movement and positioning",
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: activeBooking.id,
      status: "COMPLETED",
      amountCents: 7425,
      method: "demo",
    },
  });

  // Add more coaches for the browse page
  const extraCoachUsers = [
    { email: "coach3@habourly.test", name: "Maya Thompson", game: "Fortnite", headline: "Champion Fortnite player · Building & editing coach", rate: 5000 },
    { email: "coach4@habourly.test", name: "Dev Patel", game: "Apex Legends", headline: "Predator Apex coach · Movement & aim specialist", rate: 4000 },
    { email: "coach5@habourly.test", name: "Zoe Kim", game: "Overwatch 2", headline: "Top 500 OW2 · Support main & team comms coach", rate: 3000 },
  ];

  for (const ec of extraCoachUsers) {
    const u = await prisma.user.create({
      data: {
        email: ec.email,
        passwordHash: await hashPassword("CoachPass123!"),
        name: ec.name,
        role: "COACH",
      },
    });
    await prisma.coachProfile.create({
      data: {
        userId: u.id,
        headline: ec.headline,
        bio: `I'm ${ec.name}, a passionate ${ec.game} coach. I focus on fundamentals, decision-making, and helping you find your own style. My coaching is tailored to your playstyle — no cookie-cutter tips here.`,
        games: [ec.game],
        languages: ["English"],
        rateCents: ec.rate,
        verificationStatus: "VERIFIED",
        lastVerifiedAt: new Date("2025-01-20"),
      },
    });
  }

  // Admin audit log for coach verification
  await prisma.adminAuditLog.create({
    data: {
      adminId: admin.id,
      action: "APPROVE_COACH",
      targetType: "CoachProfile",
      targetId: coach1Profile.id,
      details: { approvedAt: new Date("2025-01-15").toISOString(), note: "Initial seed verification" },
    },
  });

  console.log("✅ Seed complete!");
  console.log("\n📋 Demo accounts:");
  console.log("  Admin:  admin@habourly.test / AdminPass123!");
  console.log("  Player: player@habourly.test / PlayerPass123!");
  console.log("  Coach:  coach1@habourly.test / CoachPass123!  (verified)");
  console.log("  Coach:  coach2@habourly.test / CoachPass123!  (pending)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
