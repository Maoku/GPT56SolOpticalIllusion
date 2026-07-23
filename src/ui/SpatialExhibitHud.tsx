import type { CSSProperties } from 'react'
import { exhibitById } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'
import { MobileControls } from './MobileControls'

export function SpatialExhibitHud() {
  const activeId = useMuseumStore((state) => state.activeExhibitId)
  const error = useMuseumStore((state) => state.alignmentError)
  const hintVisible = useMuseumStore((state) => state.spatialHintVisible)
  const leave = useMuseumStore((state) => state.leaveExhibit)
  const openOverlay = useMuseumStore((state) => state.openOverlay)

  if (!activeId) return null
  const exhibit = exhibitById.get(activeId)
  if (!exhibit) return null
  const alignmentExhibit = exhibit.outcomeKind === 'alignment'
  const aligned = alignmentExhibit && error !== null && error <= 12

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
        <div className="spatial-exhibit-hud__keys">
          <span><kbd>H</kbd> ヒント</span>
          <button onClick={leave}><kbd>ESC</kbd> 終了</button>
        </div>
      </section>
      <MobileControls />
    </>
  )
}
