import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import BookingForm from "./BookingForm";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSession();
  if (!user) redirect("/auth/login");

  const coach = await prisma.coachProfile.findUnique({
    where: { id, verificationStatus: "VERIFIED" },
    include: { user: { select: { name: true } } },
  });
  if (!coach) notFound();

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-heading text-2xl font-bold text-primary-text mb-2">Book a session</h1>
        <p className="text-secondary-text text-sm mb-8">with <strong>{coach.user.name}</strong></p>
        <BookingForm coach={{ id: coach.id, name: coach.user.name, rateCents: coach.rateCents }} />
      </div>
    </div>
  );
}
