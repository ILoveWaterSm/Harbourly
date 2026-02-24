"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const coachApplicationSchema = z.object({
  headline: z.string().min(5).max(120),
  bio: z.string().min(20).max(1000),
  rate: z.coerce.number().int().min(5).max(500),
  games: z.string(),
  languages: z.string(),
  proofUrls: z.string(),
});

export async function applyAsCoachAction(formData: FormData) {
  try {
    const user = await requireAuth();

    const raw = {
      headline: formData.get("headline") as string,
      bio: formData.get("bio") as string,
      rate: formData.get("rate") as string,
      games: formData.get("games") as string,
      languages: formData.get("languages") as string,
      proofUrls: formData.get("proofUrls") as string,
    };

    const result = coachApplicationSchema.safeParse(raw);
    if (!result.success) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const { headline, bio, rate, games, languages, proofUrls } = result.data;

    let parsedGames: string[] = [];
    let parsedLanguages: string[] = [];
    let parsedProofUrls: string[] = [];

    try {
      parsedGames = JSON.parse(games);
      parsedLanguages = JSON.parse(languages);
      parsedProofUrls = JSON.parse(proofUrls);
    } catch {
      return { success: false, error: "Invalid data format." };
    }

    if (parsedGames.length === 0) {
      return { success: false, error: "Select at least one game." };
    }

    const existing = await prisma.coachProfile.findUnique({ where: { userId: user.id } });
    if (existing) {
      return { success: false, error: "You already have a coach profile." };
    }

    await prisma.$transaction(async (tx) => {
      const profile = await tx.coachProfile.create({
        data: {
          userId: user.id,
          headline,
          bio,
          games: parsedGames,
          languages: parsedLanguages,
          rateCents: rate * 100,
          verificationStatus: "PENDING",
        },
      });

      if (parsedProofUrls.length > 0) {
        await tx.proofMedia.createMany({
          data: parsedProofUrls.map((url) => ({
            coachProfileId: profile.id,
            type: "IMAGE" as const,
            url,
            caption: "Proof submitted during application",
          })),
        });
      }
    });

    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return { success: false, error: "Please sign in." };
    }
    return { success: false, error: "Oops, that didn't work. Check your connection and try again." };
  }
}
