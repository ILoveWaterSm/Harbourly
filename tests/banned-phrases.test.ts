import { describe, it, expect } from 'vitest'
import { detectBannedPhrases, containsBannedPhrase } from '@/lib/banned-phrases'

describe('detectBannedPhrases', () => {
  it('detects guaranteed rank', () => {
    expect(detectBannedPhrases('I offer guaranteed rank improvement')).toContain('guaranteed rank')
  })

  it('detects boosting', () => {
    expect(detectBannedPhrases('elo boosting service available')).toContain('elo boosting')
  })

  it('detects carry service', () => {
    expect(detectBannedPhrases('Best carry service in the game')).toContain('carry service')
  })

  it('is case-insensitive', () => {
    expect(detectBannedPhrases('GUARANTEED WIN every game')).toContain('guaranteed win')
  })

  it('returns empty array for clean text', () => {
    expect(detectBannedPhrases('I help you improve your mechanics through practice and analysis')).toHaveLength(0)
  })

  it('detects multiple banned phrases', () => {
    const result = detectBannedPhrases('boosting and guaranteed win available')
    expect(result.length).toBeGreaterThan(1)
  })
})

describe('containsBannedPhrase', () => {
  it('returns true for text with banned phrase', () => {
    expect(containsBannedPhrase('account boosting service')).toBe(true)
  })

  it('returns false for clean text', () => {
    expect(containsBannedPhrase('Improve your game with structured coaching sessions')).toBe(false)
  })
})
