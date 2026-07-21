import { fireEvent, render, screen } from '@testing-library/react'
import { useMuseumStore } from '../state/useMuseumStore'
import { ExhibitExperience } from './ExhibitExperience'

describe('ExhibitExperience', () => {
  beforeEach(() => {
    useMuseumStore.setState({ stage: 'exhibit', activeExhibitId: 'muller-lyer', overlay: 'none', progress: {} })
  })

  it('keeps the hint hidden until explicitly requested', () => {
    render(<ExhibitExperience />)
    expect(screen.queryByText('見え方のヒント', { selector: 'h2' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /ヒントを見る/ }))
    expect(useMuseumStore.getState().overlay).toBe('hint')
  })

  it('records interaction and answer-check progress', () => {
    render(<ExhibitExperience />)
    fireEvent.change(screen.getByRole('slider', { name: '下の線の実長' }), { target: { value: 150 } })
    expect(useMuseumStore.getState().progress['muller-lyer']).toBe('interacted')
    fireEvent.click(screen.getByRole('button', { name: '答え合わせ' }))
    expect(useMuseumStore.getState().progress['muller-lyer']).toBe('revealed')
    expect(screen.getByText(/誤差 10 px/)).toBeInTheDocument()
  })

  it('resets local values and returns to illusion mode', () => {
    render(<ExhibitExperience />)
    const slider = screen.getByRole('slider', { name: '下の線の実長' })
    fireEvent.change(slider, { target: { value: 180 } })
    fireEvent.click(screen.getByRole('button', { name: '答え合わせ' }))
    fireEvent.click(screen.getByRole('button', { name: /リセット/ }))
    expect(screen.getByRole('slider', { name: '下の線の実長' })).toHaveValue('138')
    expect(screen.getByRole('button', { name: '答え合わせ' })).toBeInTheDocument()
  })

  it.each([
    ['checker-shadow', '影の位置'],
    ['necker-cube', '回転'],
    ['motion-induced-blindness', '背景速度'],
    ['ames-room', '人物のレール位置'],
  ] as const)('provides a distinct control for %s', (id, control) => {
    useMuseumStore.setState({ activeExhibitId: id })
    render(<ExhibitExperience />)
    expect(screen.getByRole('slider', { name: control })).toBeInTheDocument()
  })
})
