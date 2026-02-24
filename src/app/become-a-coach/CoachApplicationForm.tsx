"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyAsCoachAction } from "@/lib/actions/coach";

const GAMES = ["League of Legends", "Valorant", "CS2", "Fortnite", "Apex Legends", "Overwatch 2", "Rocket League", "DOTA 2", "Minecraft", "Other"];
const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Korean", "Japanese", "Chinese"];

export default function CoachApplicationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [proofUrls, setProofUrls] = useState<string[]>([""]);

  function toggleGame(game: string) {
    setSelectedGames((prev) => prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game]);
  }
  function toggleLanguage(lang: string) {
    setSelectedLanguages((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("games", JSON.stringify(selectedGames));
    formData.set("languages", JSON.stringify(selectedLanguages));
    formData.set("proofUrls", JSON.stringify(proofUrls.filter(Boolean)));

    startTransition(async () => {
      const result = await applyAsCoachAction(formData);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Oops, that didn't work. Check your connection and try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-6">
      <h2 className="font-heading text-xl font-bold text-primary-text">Coach Application</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] text-red-700 text-sm">{error}</div>
      )}

      <div>
        <label className="label">Headline <span className="text-error">*</span></label>
        <input name="headline" type="text" className="input" placeholder="e.g. Diamond Valorant coach, 3 years coaching" required maxLength={120} />
      </div>

      <div>
        <label className="label">Bio <span className="text-error">*</span></label>
        <textarea name="bio" className="input" rows={4} placeholder="Tell players about your experience, coaching style, and what you'll teach." required maxLength={1000} />
      </div>

      <div>
        <label className="label">Games <span className="text-error">*</span></label>
        <div className="flex flex-wrap gap-2 mt-1">
          {GAMES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => toggleGame(g)}
              className={`text-sm px-3 py-1.5 rounded-[6px] border transition-colors ${selectedGames.includes(g) ? "bg-accent text-[#0B0F14] border-accent font-semibold" : "border-border text-secondary-text hover:border-accent hover:text-accent"}`}
            >
              {g}
            </button>
          ))}
        </div>
        {selectedGames.length === 0 && <p className="text-xs text-secondary-text mt-1">Select at least one game.</p>}
      </div>

      <div>
        <label className="label">Languages</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => toggleLanguage(l)}
              className={`text-sm px-3 py-1.5 rounded-[6px] border transition-colors ${selectedLanguages.includes(l) ? "bg-accent text-[#0B0F14] border-accent font-semibold" : "border-border text-secondary-text hover:border-accent hover:text-accent"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Hourly rate (USD) <span className="text-error">*</span></label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text text-sm">$</span>
          <input name="rate" type="number" className="input pl-7" placeholder="50" min="5" max="500" required />
        </div>
      </div>

      <div>
        <label className="label">Proof URLs</label>
        <p className="text-xs text-secondary-text mb-2">Add links to your gameplay clips, rank screenshots, or profile pages.</p>
        {proofUrls.map((url, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="url"
              className="input text-sm flex-1"
              placeholder="https://..."
              value={url}
              onChange={(e) => {
                const newUrls = [...proofUrls];
                newUrls[i] = e.target.value;
                setProofUrls(newUrls);
              }}
            />
            {proofUrls.length > 1 && (
              <button type="button" onClick={() => setProofUrls(proofUrls.filter((_, j) => j !== i))} className="btn-ghost text-red-500 px-2">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setProofUrls([...proofUrls, ""])} className="text-accent text-sm hover:text-accent-dark">+ Add another proof link</button>
      </div>

      <button
        type="submit"
        disabled={isPending || selectedGames.length === 0}
        className="btn-primary w-full py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Submitting application..." : "Submit application"}
      </button>
    </form>
  );
}
