import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminPanel from "./AdminPanel";

export default async function AdminPage() {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const [pendingCoaches, disputes, auditLogs] = await Promise.all([
    prisma.coachProfile.findMany({
      where: { verificationStatus: "PENDING" },
      include: {
        user: { select: { name: true, email: true, createdAt: true } },
        proofMedia: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.dispute.findMany({
      where: { status: "OPEN" },
      include: {
        booking: {
          include: {
            user: { select: { name: true } },
            coachProfile: { include: { user: { select: { name: true } } } },
          },
        },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.adminAuditLog.findMany({
      include: { admin: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <AdminPanel
      adminId={user.id}
      pendingCoaches={pendingCoaches.map((c) => ({
        id: c.id,
        headline: c.headline,
        bio: c.bio,
        games: c.games,
        rateCents: c.rateCents,
        createdAt: c.createdAt.toISOString(),
        user: { name: c.user.name, email: c.user.email, createdAt: c.user.createdAt.toISOString() },
        proofMedia: c.proofMedia.map((p) => ({ id: p.id, type: p.type, url: p.url, caption: p.caption })),
      }))}
      disputes={disputes.map((d) => ({
        id: d.id,
        reason: d.reason,
        evidenceUrl: d.evidenceUrl,
        status: d.status,
        createdAt: d.createdAt.toISOString(),
        user: { name: d.user.name },
        booking: {
          id: d.booking.id,
          user: { name: d.booking.user.name },
          coachProfile: { user: { name: d.booking.coachProfile.user.name } },
        },
      }))}
      auditLogs={auditLogs.map((l) => ({
        id: l.id,
        action: l.action,
        targetType: l.targetType,
        targetId: l.targetId,
        createdAt: l.createdAt.toISOString(),
        admin: { name: l.admin.name },
      }))}
    />
  );
}
