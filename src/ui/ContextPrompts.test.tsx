import { fireEvent, render, screen } from '@testing-library/react'
import { useMuseumStore } from '../state/useMuseumStore'
import { ContextPrompts } from './ContextPrompts'

describe('V2 contextual onboarding', () => {
  beforeEach(() => {
    useMuseumStore.setState({
      contextPromptStep: 0,
      tutorialSeen: false,
      overlay: 'none',
    })
  })

  it('teaches in context without opening a blocking dialog', () => {
    render(<ContextPrompts />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('歩くと、像が変わる。')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '歩いてみる' }))
    expect(useMuseumStore.getState().contextPromptStep).toBe(1)
  })

  it('can be dismissed and remembered', () => {
    render(<ContextPrompts />)
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }))
    expect(useMuseumStore.getState()).toMatchObject({
      contextPromptStep: null,
      tutorialSeen: true,
    })
  })
})
