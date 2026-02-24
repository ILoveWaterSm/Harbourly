"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveCoachAction, rejectCoachAction } from "@/lib/actions/admin";
import { ShieldCheckIcon, ExclamationTriangleIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

interface PendingCoach {
  id: string;
  headline: string;
  bio: string;
  games: string[];
  rateCents: number;
  createdAt: string;
  user: { name: string; email: string; createdAt: string };
  proofMedia: { id: string; type: string; url: string; caption: string | null }[];
}

interface Dispute {
  id: string;
  reason: string;
  evidenceUrl: string | null;
  status: string;
  createdAt: string;
  user: { name: string };
  booking: { id: string; user: { name: string }; coachProfile: { user: { name: string } } };
}

interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
  admin: { name: string };
}

interface Props {
  adminId: string;
  pendingCoaches: PendingCoach[];
  disputes: Dispute[];
  auditLogs: AuditLog[];
}

type Tab = "coaches" | "disputes" | "logs";

export default function AdminPanel({ adminId, pendingCoaches, disputes, auditLogs }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("coaches");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  function handleApprove(coachId: string) {
    startTransition(async () => {
      const result = await approveCoachAction(adminId, coachId);
      if (!result.success) {
        setErrors((prev) => ({ ...prev, [coachId]: result.error || "Error" }));
      } else {
        router.refresh();
      }
    });
  }

  function handleReject(coachId: string) {
    const reason = rejectionReasons[coachId];
    if (!reason?.trim()) {
      setErrors((prev) => ({ ...prev, [coachId]: "Please provide a rejection reason." }));
      return;
    }
    startTransition(async () => {
      const result = await rejectCoachAction(adminId, coachId, reason);
      if (!result.success) {
        setErrors((prev) => ({ ...prev, [coachId]: result.error || "Error" }));
      } else {
        router.refresh();
      }
    });
  }

  const tabs: { id: Tab; label: string; count?: number; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "coaches", label: "Pending Verification", count: pendingCoaches.length, icon: ShieldCheckIcon },
    { id: "disputes", label: "Open Disputes", count: disputes.length, icon: ExclamationTriangleIcon },
    { id: "logs", label: "Audit Logs", icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-primary-text mb-1">Admin Console</h1>
          <p className="text-secondary-text text-sm">Manage verification, disputes, and platform trust.</p>
        </div>

        <div className="flex gap-1 mb-8 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-accent text-accent"
                  : "border-transparent text-secondary-text hover:text-primary-text"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-500"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "coaches" && (
          <div className="space-y-6">
            {pendingCoaches.length === 0 ? (
              <div className="card p-10 text-center">
                <ShieldCheckIcon className="h-10 w-10 text-accent mx-auto mb-3" />
                <p className="text-secondary-text text-sm">No pending verifications.</p>
              </div>
            ) : (
              pendingCoaches.map((coach) => (
                <div key={coach.id} className="card p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-heading font-semibold text-primary-text text-lg">{coach.user.name}</h3>
                      <p className="text-secondary-text text-sm">{coach.user.email}</p>
                      <p className="text-secondary-text text-xs">Applied {new Date(coach.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full font-semibold">
                      Pending
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-primary-text mb-1">{coach.headline}</p>
                    <p className="text-secondary-text text-sm leading-relaxed line-clamp-3">{coach.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {coach.games.map((g) => (
                        <span key={g} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{g}</span>
                      ))}
                    </div>
                    <p className="text-sm text-primary-text mt-2 font-medium">${(coach.rateCents / 100).toFixed(0)}/hr</p>
                  </div>

                  {coach.proofMedia.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-primary-text mb-2">
                        Submitted proof ({coach.proofMedia.length} item{coach.proofMedia.length !== 1 ? "s" : ""}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {coach.proofMedia.map((media) => (
                          <a
                            key={media.id}
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors"
                          >
                            {media.type === "IMAGE" ? "🖼 " : "🎬 "}{media.caption || media.type}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors[coach.id] && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-[6px] text-red-700 text-xs mb-3">
                      {errors[coach.id]}
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => handleApprove(coach.id)}
                      disabled={isPending}
                      className="btn-primary text-sm px-4 py-2 disabled:opacity-60"
                    >
                      ✓ Approve
                    </button>
                    <div className="flex-1 min-w-[200px] flex gap-2">
                      <input
                        type="text"
                        placeholder="Rejection reason..."
                        className="input text-xs flex-1"
                        value={rejectionReasons[coach.id] || ""}
                        onChange={(e) => setRejectionReasons((prev) => ({ ...prev, [coach.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleReject(coach.id)}
                        disabled={isPending}
                        className="btn-destructive text-sm px-3 py-2 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "disputes" && (
          <div className="space-y-4">
            {disputes.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-secondary-text text-sm">No open disputes.</p>
              </div>
            ) : (
              disputes.map((dispute) => (
                <div key={dispute.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-medium text-primary-text text-sm">
                        {dispute.booking.user.name} vs {dispute.booking.coachProfile.user.name}
                      </p>
                      <p className="text-secondary-text text-xs">Filed by {dispute.user.name} · {new Date(dispute.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-full font-semibold">
                      {dispute.status}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-text mb-2">{dispute.reason}</p>
                  {dispute.evidenceUrl && (
                    <a href={dispute.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-accent-dark underline">
                      View evidence ↗
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "logs" && (
          <div className="card overflow-hidden">
            {auditLogs.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-secondary-text text-sm">No audit logs yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <div key={log.id} className="px-5 py-3 flex items-center gap-4 text-sm hover:bg-gray-50">
                    <span className="font-mono text-xs text-secondary-text flex-shrink-0">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                    <span className="font-medium text-primary-text">{log.admin.name}</span>
                    <span className="text-secondary-text">{log.action}</span>
                    <span className="text-xs text-secondary-text">{log.targetType}:{log.targetId.slice(0, 8)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
