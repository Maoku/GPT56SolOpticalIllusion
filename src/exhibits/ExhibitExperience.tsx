import { lazy, Suspense, useEffect, useState, type ComponentType, type CSSProperties, type LazyExoticComponent } from 'react'
import { getMuseumMode } from '../app/museumMode'
import { exhibitById, getExhibitCatalog, type ExhibitType } from './exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'
import type { ExhibitModuleProps } from './interaction/types'
type LazyModule = LazyExoticComponent<ComponentType<ExhibitModuleProps>>
const modules: Partial<Record<ExhibitType, LazyModule>> = {
  'muller-lyer': lazy(() => import('./mullerLyer/MullerLyerExhibit').then((module) => ({ default: module.MullerLyerExhibit }))),
  ponzo: lazy(() => import('./ponzo/PonzoExhibit').then((module) => ({ default: module.PonzoExhibit }))),
  ebbinghaus: lazy(() => import('./ebbinghaus/EbbinghausExhibit').then((module) => ({ default: module.EbbinghausExhibit }))),
  'cafe-wall': lazy(() => import('./cafeWall/CafeWallExhibit').then((module) => ({ default: module.CafeWallExhibit }))),
  'checker-shadow': lazy(() => import('./checkerShadow/CheckerShadowExhibit').then((module) => ({ default: module.CheckerShadowExhibit }))),
  'necker-cube': lazy(() => import('./neckerCube/NeckerCubeExhibit').then((module) => ({ default: module.NeckerCubeExhibit }))),
  'motion-induced-blindness': lazy(() => import('./motionInducedBlindness/MotionInducedBlindnessExhibit').then((module) => ({ default: module.MotionInducedBlindnessExhibit }))),
  'ames-room': lazy(() => import('./amesRoom/AmesRoomExhibit').then((module) => ({ default: module.AmesRoomExhibit }))),
  'parallax-bloom': lazy(() => import('./parallaxBloom/ParallaxBloomExhibit').then((module) => ({ default: module.ParallaxBloomExhibit }))),
  'chromatic-echo-corridor': lazy(() => import('./chromaticEchoCorridor/ChromaticEchoCorridorExhibit').then((module) => ({ default: module.ChromaticEchoCorridorExhibit }))),
}

export function ExhibitExperience() {
  const activeId = useMuseumStore((state) => state.activeExhibitId)
  const leaveExhibit = useMuseumStore((state) => state.leaveExhibit)
  const openOverlay = useMuseumStore((state) => state.openOverlay)
  const markInteracted = useMuseumStore((state) => state.markInteracted)
  const markRevealed = useMuseumStore((state) => state.markRevealed)
  const recordOutcome = useMuseumStore((state) => state.recordOutcome)
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
  if (!Module) return null
  const total = getExhibitCatalog(getMuseumMode()).length

  const toggleAnswer = () => {
    setRevealed((current) => {
      if (!current) {
        markRevealed(activeId)
        recordOutcome(activeId, {
          headline: exhibit.shareHook,
          detail: exhibit.oneSentence,
        })
      }
      return !current
    })
  }

  return (
    <section className="exhibit-experience" aria-labelledby="active-exhibit-title" style={{ '--exhibit-accent': exhibit.accent } as CSSProperties}>
      <header className="experience-header">
        <div className="experience-index"><span>{String(exhibit.number).padStart(2, '0')}</span><small>/ {total}</small></div>
        <div><p className="eyebrow">{exhibit.subtitle}{exhibit.isOriginal ? ' — ORIGINAL' : ''}</p><h1 id="active-exhibit-title">{exhibit.title}</h1><p>{exhibit.prompt}</p></div>
        <button className="icon-button" aria-label="展示モードを終了" onClick={leaveExhibit}>×</button>
      </header>
      <div className="experience-stage">
        <Suspense fallback={<div className="exhibit-loading" role="status">作品を照明しています…</div>}>
          <Module
            key={resetKey}
            revealed={revealed}
            onInteract={() => markInteracted(activeId)}
            onOutcome={(outcome) => recordOutcome(activeId, outcome)}
          />
        </Suspense>
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
