"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { payBookingAction, markCompletedAction, submitReviewAction, submitDisputeAction } from "@/lib/actions/bookings";

interface Props {
  booking: {
    id: string;
    status: string;
    userId: string;
    coachUserId: string;
    hasReview: boolean;
    hasDispute: boolean;
  };
  currentUserId: string;
  isUser: boolean;
  isCoach: boolean;
}

export default function BookingActions({ booking, isUser, isCoach }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  function handleAction(fn: () => Promise<{ success: boolean; error?: string }>) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await fn();
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Oops, that didn't work. Check your connection and try again.");
      }
    });
  }

  return (
    <div className="card p-6 space-y-4">
      <h2 className="font-heading font-semibold text-primary-text">Actions</h2>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] text-red-700 text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-[6px] text-green-700 text-sm">{success}</div>}

      {booking.status === "PAYMENT_PENDING" && isUser && (
        <button
          onClick={() => handleAction(() => payBookingAction(booking.id))}
          disabled={isPending}
          className="btn-primary w-full py-2.5 text-sm disabled:opacity-60"
        >
          {isPending ? "Processing..." : "Pay now (Demo)"}
        </button>
      )}

      {booking.status === "PAID" && (isUser || isCoach) && (
        <button
          onClick={() => handleAction(() => markCompletedAction(booking.id))}
          disabled={isPending}
          className="btn-primary w-full py-2.5 text-sm disabled:opacity-60"
        >
          {isPending ? "Updating..." : "Mark as completed"}
        </button>
      )}

      {booking.status === "COMPLETED" && isUser && !booking.hasReview && (
        <>
          <button
            onClick={() => setShowReview(!showReview)}
            className="btn-secondary w-full py-2.5 text-sm"
          >
            Leave a review
          </button>
          {showReview && (
            <div className="space-y-3 border border-border rounded-[8px] p-4">
              <div>
                <label className="label text-xs">Rating</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`text-2xl ${n <= rating ? "text-yellow-400" : "text-gray-200"} hover:text-yellow-300 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label text-xs">Comment</label>
                <textarea
                  className="input text-sm"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                />
              </div>
              <button
                onClick={() => {
                  const fd = new FormData();
                  fd.set("bookingId", booking.id);
                  fd.set("rating", String(rating));
                  fd.set("comment", comment);
                  handleAction(async () => {
                    const r = await submitReviewAction(fd);
                    if (r.success) setSuccess("Review submitted! Thanks for your feedback.");
                    return r;
                  });
                }}
                disabled={isPending || !comment.trim()}
                className="btn-primary w-full text-sm py-2 disabled:opacity-60"
              >
                Submit review
              </button>
            </div>
          )}
        </>
      )}

      {(booking.status === "PAID" || booking.status === "COMPLETED") && !booking.hasDispute && (isUser || isCoach) && (
        <>
          <button
            onClick={() => setShowDispute(!showDispute)}
            className="btn-ghost w-full text-sm border border-red-200 text-red-600 hover:bg-red-50"
          >
            Open dispute
          </button>
          {showDispute && (
            <div className="space-y-3 border border-red-200 rounded-[8px] p-4 bg-red-50">
              <div>
                <label className="label text-xs">Reason</label>
                <textarea
                  className="input text-sm"
                  rows={3}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Describe the issue..."
                />
              </div>
              <div>
                <label className="label text-xs">Evidence URL (optional)</label>
                <input
                  type="url"
                  className="input text-sm"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <button
                onClick={() => {
                  const fd = new FormData();
                  fd.set("bookingId", booking.id);
                  fd.set("reason", disputeReason);
                  if (evidenceUrl) fd.set("evidenceUrl", evidenceUrl);
                  handleAction(async () => {
                    const r = await submitDisputeAction(fd);
                    if (r.success) setSuccess("Your dispute has been submitted. Our team will review the evidence and update you within 72 hours.");
                    return r;
                  });
                }}
                disabled={isPending || !disputeReason.trim()}
                className="btn-destructive w-full text-sm py-2 disabled:opacity-60"
              >
                Submit dispute
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
