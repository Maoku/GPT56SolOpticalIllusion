import type { CSSProperties } from 'react'
import { exhibitById } from '../exhibits/exhibitCatalog'
import { nextSpatialStep } from '../scene/interaction/spatialExperience'
import { useMuseumStore } from '../state/useMuseumStore'
import { MobileControls } from './MobileControls'

export function SpatialExhibitHud() {
  const activeId = useMuseumStore((state) => state.activeExhibitId)
  const error = useMuseumStore((state) => state.alignmentError)
  const hintVisible = useMuseumStore((state) => state.spatialHintVisible)
  const step = useMuseumStore((state) => state.spatialStep)
  const setStep = useMuseumStore((state) => state.setSpatialStep)
  const markInteracted = useMuseumStore((state) => state.markInteracted)
  const markRevealed = useMuseumStore((state) => state.markRevealed)
  const progress = useMuseumStore((state) => activeId ? state.progress[activeId] : undefined)
  const leave = useMuseumStore((state) => state.leaveExhibit)
  const openOverlay = useMuseumStore((state) => state.openOverlay)

  if (!activeId) return null
  const exhibit = exhibitById.get(activeId)
  if (!exhibit) return null
  const alignmentExhibit = exhibit.outcomeKind === 'alignment'
  const aligned = alignmentExhibit && error !== null && error <= 12
  const operate = () => {
    const next = nextSpatialStep(activeId, step)
    if (next === null) return
    setStep(next)
    markInteracted(activeId)
    if (next > 0) markRevealed(activeId)
  }
  const operationLabel = activeId === 'checker-shadow'
    ? '照明を切り替える'
    : activeId === 'counterparallax-window'
      ? '通常視差と逆視差を切り替える'
      : undefined

  return (
    <>
      <section
        className="spatial-exhibit-hud"
        aria-labelledby="spatial-exhibit-title"
        style={{ '--exhibit-accent': exhibit.accent } as CSSProperties}
      >
        <div className="spatial-exhibit-hud__identity">
          <span>{String(exhibit.number).padStart(2, '0')}</span>
          <div>
            <small>{exhibit.subtitle}</small>
            <h1 id="spatial-exhibit-title">{exhibit.title}</h1>
          </div>
        </div>
        <div className="spatial-exhibit-hud__prompt">
          <strong>{exhibit.prompt}</strong>
          <span>{exhibit.interaction.instructions}</span>
          {aligned && <em>像が重なる位置です。少し横へ動いて比べてください。</em>}
        </div>
        {hintVisible && (
          <div className="spatial-exhibit-hud__hint" aria-live="polite">
            <span>{exhibit.hint.summary}</span>
            <button onClick={() => openOverlay('hint')}>詳しい解説</button>
          </div>
        )}
        {progress === 'revealed' && (
          <div className="spatial-exhibit-hud__result" role="status">
            <span>観察をパスポートへ自動記録しました。</span>
            {alignmentExhibit && error !== null && <output>投影誤差 {Math.round(error)} px</output>}
            <button onClick={() => openOverlay('hint')}>種明かしを見る</button>
          </div>
        )}
        <div className="spatial-exhibit-hud__keys">
          <span><kbd>H</kbd> ヒント</span>
          <button onClick={leave}><kbd>ESC</kbd> 終了</button>
        </div>
      </section>
      <MobileControls interactionLabel={operationLabel} onInteract={operationLabel ? operate : undefined} />
    </>
  )
}
