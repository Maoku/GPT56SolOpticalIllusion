import { recommendNextExhibit } from './recommendation'
import type { ExhibitProgress } from '../state/useMuseumStore'

describe('exhibit recommendations', () => {
  it('starts with a spatial anchor', () => {
    expect(recommendNextExhibit({}, null)?.presentation).not.toBe('lab')
  })

  it('does not repeat the previous input form when another option exists', () => {
    const next = recommendNextExhibit(
      { 'muller-lyer': 'interacted' },
      'muller-lyer',
    )
    expect(next?.id).toBe('parallax-bloom')
    expect(next?.interaction.mode).not.toBe('drag')
  })

  it('returns null after all exhibits were visited', () => {
    const completed = Object.fromEntries(
      [
        'muller-lyer', 'ponzo', 'ebbinghaus', 'cafe-wall', 'checker-shadow',
        'necker-cube', 'motion-induced-blindness', 'ames-room', 'parallax-bloom',
        'chromatic-echo-corridor', 'folded-corridor', 'counterparallax-window',
      ].map((id) => [id, 'interacted']),
    ) as Record<string, ExhibitProgress>
    expect(recommendNextExhibit(completed, 'counterparallax-window')).toBeNull()
  })
})
