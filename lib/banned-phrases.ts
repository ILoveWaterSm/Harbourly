/**
 * Banned phrase detection for coach profiles and service descriptions.
 * Prevents misleading or deceptive marketing claims.
 */

const BANNED_PHRASES: readonly string[] = [
  'guaranteed rank',
  'guaranteed win',
  'guaranteed victory',
  'rank guarantee',
  'win guarantee',
  'carry service',
  'boosting',
  'account boosting',
  'elo boosting',
  'mmr boosting',
  'rank boosting',
  'duo boosting',
  'win trading',
  'account sharing',
  'guaranteed improvement',
  '100% win rate',
  'never lose',
  'instant rank up',
] as const

export function detectBannedPhrases(text: string): string[] {
  const lower = text.toLowerCase()
  return BANNED_PHRASES.filter((phrase) => lower.includes(phrase))
}

export function containsBannedPhrase(text: string): boolean {
  return detectBannedPhrases(text).length > 0
}

export function sanitizeContentFlags(text: string): string[] {
  return detectBannedPhrases(text)
}
