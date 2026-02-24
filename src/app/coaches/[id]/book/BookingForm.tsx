"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "@/lib/actions/bookings";

interface Props {
  coach: { id: string; name: string; rateCents: number };
  userId: string;
}

export default function BookingForm({ coach, userId: _userId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(60);

  const priceCents = Math.round((coach.rateCents * duration) / 60);
  const platformFeeCents = Math.round(priceCents * 0.1);
  const totalCents = priceCents + platformFeeCents;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.set("coachProfileId", coach.id);
    formData.set("scheduledAt", scheduledAt);
    formData.set("durationMinutes", String(duration));
    formData.set("notes", notes);

    startTransition(async () => {
      const result = await createBookingAction(formData);
      if (result.success && result.bookingId) {
        router.push(`/bookings/${result.bookingId}`);
      } else {
        setError(result.error || "Oops, that didn't work. Check your connection and try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] text-red-700 text-sm">{error}</div>
      )}

      <div>
        <label className="label">Session date &amp; time</label>
        <input
          type="datetime-local"
          className="input"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          required
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div>
        <label className="label">Duration</label>
        <select className="input" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>
      </div>

      <div>
        <label className="label">Notes for coach (optional)</label>
        <textarea
          className="input"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What do you want to focus on?"
        />
      </div>

      {/* Fee breakdown */}
      <div className="bg-gray-50 rounded-[8px] p-4 border border-border space-y-2 text-sm">
        <h3 className="font-semibold text-primary-text mb-3">Fee breakdown</h3>
        <div className="flex justify-between text-secondary-text">
          <span>Session ({duration} min)</span>
          <span>${(priceCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-secondary-text">
          <span>Platform fee (10%)</span>
          <span>${(platformFeeCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-primary-text border-t border-border pt-2">
          <span>Total</span>
          <span>${(totalCents / 100).toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Creating booking..." : "Confirm booking"}
      </button>
    </form>
  );
}
