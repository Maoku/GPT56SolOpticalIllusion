import { useEffect, useState, type ComponentType, type CSSProperties } from 'react'
import { exhibitById, type ExhibitType } from './exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'
import type { ExhibitModuleProps } from './interaction/types'
import { MullerLyerExhibit } from './mullerLyer/MullerLyerExhibit'
import { PonzoExhibit } from './ponzo/PonzoExhibit'
import { EbbinghausExhibit } from './ebbinghaus/EbbinghausExhibit'
import { CafeWallExhibit } from './cafeWall/CafeWallExhibit'
import { CheckerShadowExhibit } from './checkerShadow/CheckerShadowExhibit'
import { NeckerCubeExhibit } from './neckerCube/NeckerCubeExhibit'
import { MotionInducedBlindnessExhibit } from './motionInducedBlindness/MotionInducedBlindnessExhibit'
import { AmesRoomExhibit } from './amesRoom/AmesRoomExhibit'

const modules: Partial<Record<ExhibitType, ComponentType<ExhibitModuleProps>>> = {
  'muller-lyer': MullerLyerExhibit,
  ponzo: PonzoExhibit,
  ebbinghaus: EbbinghausExhibit,
  'cafe-wall': CafeWallExhibit,
  'checker-shadow': CheckerShadowExhibit,
  'necker-cube': NeckerCubeExhibit,
  'motion-induced-blindness': MotionInducedBlindnessExhibit,
  'ames-room': AmesRoomExhibit,
}

export function ExhibitExperience() {
  const activeId = useMuseumStore((state) => state.activeExhibitId)
  const leaveExhibit = useMuseumStore((state) => state.leaveExhibit)
  const openOverlay = useMuseumStore((state) => state.openOverlay)
  const markInteracted = useMuseumStore((state) => state.markInteracted)
  const markRevealed = useMuseumStore((state) => state.markRevealed)
  const [revealed, setRevealed] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return
      if (event.code === 'KeyR') { setResetKey((key) => key + 1); setRevealed(false) }
      if (event.code === 'KeyH') openOverlay('hint')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openOverlay])

  if (!activeId) return null
  const exhibit = exhibitById.get(activeId)
  if (!exhibit) return null
  const Module = modules[activeId]

  const toggleAnswer = () => {
    setRevealed((current) => {
      if (!current) markRevealed(activeId)
      return !current
    })
  }

  return (
    <section className="exhibit-experience" aria-labelledby="active-exhibit-title" style={{ '--exhibit-accent': exhibit.accent } as CSSProperties}>
      <header className="experience-header">
        <div className="experience-index"><span>{String(exhibit.number).padStart(2, '0')}</span><small>/ 10</small></div>
        <div><p className="eyebrow">{exhibit.subtitle}{exhibit.isOriginal ? ' — ORIGINAL' : ''}</p><h1 id="active-exhibit-title">{exhibit.title}</h1><p>{exhibit.prompt}</p></div>
        <button className="icon-button" aria-label="展示モードを終了" onClick={leaveExhibit}>×</button>
      </header>
      <div className="experience-stage">
        {Module ? <Module key={resetKey} revealed={revealed} onInteract={() => markInteracted(activeId)} /> : <p>この展示は次のフェーズで開室します。</p>}
      </div>
      <footer className="experience-controls">
        <p><span>HOW TO</span>{exhibit.interaction.instructions}</p>
        <div>
          <button className="button button--quiet" onClick={() => openOverlay('hint')}>ヒントを見る <kbd>H</kbd></button>
          <button className="button button--quiet" onClick={() => { setResetKey((key) => key + 1); setRevealed(false) }}>リセット <kbd>R</kbd></button>
          <button className="button button--primary" onClick={toggleAnswer}>{revealed ? '錯視に戻る' : '答え合わせ'}</button>
        </div>
      </footer>
    </section>
  )
}
