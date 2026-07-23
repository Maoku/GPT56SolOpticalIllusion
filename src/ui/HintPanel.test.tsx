import { fireEvent, render, screen } from '@testing-library/react'
import { useMuseumStore } from '../state/useMuseumStore'
import { HintPanel } from './HintPanel'

describe('HintPanel accessibility', () => {
  beforeEach(() => useMuseumStore.setState({ stage: 'exhibit', activeExhibitId: 'ponzo', overlay: 'hint' }))

  it('moves focus inside, traps Tab, and closes with Escape', () => {
    render(<HintPanel />)
    const close = screen.getByRole('button', { name: 'ヒントを閉じる' })
    const confirm = screen.getByRole('button', { name: '自分の目で確かめる' })
    expect(close).toHaveFocus()
    confirm.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(close).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(useMuseumStore.getState().overlay).toBe('none')
  })
})
