import type { CSSProperties } from 'react'
import { exhibitById, type ExhibitType } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'
import { MobileControls } from './MobileControls'

const states: Record<ExhibitType, string[]> = {
  'muller-lyer': [],
  ponzo: [],
  ebbinghaus: [],
  'cafe-wall': [],
  'checker-shadow': ['影の照明', '色の文脈', '白色光で確認'],
  'necker-cube': [],
  'motion-induced-blindness': [],
  'ames-room': ['固定視点', '横から構造を見る'],
  'parallax-bloom': ['一輪の成立像', '三層を分解'],
  'chromatic-echo-corridor': ['色へ順応', '無彩色へ移動', '補色を比較'],
  'folded-corridor': ['直線回廊の成立像', '壁片を分解'],
  'counterparallax-window': ['連続して歩く', '二状態を静止比較'],
}

export function SpatialExhibitHud() {
  const activeId = useMuseumStore((state) => state.activeExhibitId)
  const step = useMuseumStore((state) => state.spatialStep)
  const error = useMuseumStore((state) => state.alignmentError)
  const reducedMotion = useMuseumStore((state) => state.settings.reducedMotion)
  const setStep = useMuseumStore((state) => state.setSpatialStep)
  const requestViewSpot = useMuseumStore((state) => state.requestViewSpot)
  const leave = useMuseumStore((state) => state.leaveExhibit)
  const openOverlay = useMuseumStore((state) => state.openOverlay)
  const markInteracted = useMuseumStore((state) => state.markInteracted)
  const markRevealed = useMuseumStore((state) => state.markRevealed)
  const recordOutcome = useMuseumStore((state) => state.recordOutcome)
  const recorded = useMuseumStore((state) => activeId ? Boolean(state.outcomes[activeId]) : false)

  if (!activeId) return null
  const exhibit = exhibitById.get(activeId)
  if (!exhibit) return null
  const exhibitStates = states[activeId]
  const currentState = exhibitStates[Math.min(step, exhibitStates.length - 1)]
  const aligned = error !== null && error <= 12

  const advance = () => {
    const next = (step + 1) % exhibitStates.length
    setStep(next)
    markInteracted(activeId)
    if (next === exhibitStates.length - 1) markRevealed(activeId)
  }

  const record = () => {
    recordOutcome(activeId, {
      headline: exhibit.shareHook,
      detail: aligned
        ? `${currentState}で成立。基準視点からの投影誤差は ${Math.round(error ?? 0)} px でした。`
        : `${currentState}を観察。基準視点からの投影誤差は ${Math.round(error ?? 0)} px でした。`,
      metric: exhibit.outcomeKind === 'alignment'
        ? { label: '基準視点からの投影誤差', value: Math.round(error ?? 0), unit: 'px' }
        : undefined,
      sequence: exhibit.outcomeKind === 'sequence' ? exhibitStates : undefined,
      comparison: exhibit.outcomeKind === 'comparison'
        ? [exhibitStates[0]!, exhibitStates[exhibitStates.length - 1]!]
        : undefined,
    })
    if (step === exhibitStates.length - 1) markRevealed(activeId)
  }

  return (
    <>
      <section
        className="spatial-exhibit-hud"
        aria-labelledby="spatial-exhibit-title"
        style={{ '--exhibit-accent': exhibit.accent } as CSSProperties}
      >
        <header>
          <div className="spatial-exhibit-hud__index">
            <span>{String(exhibit.number).padStart(2, '0')}</span>
            <small>/ 12 · {exhibit.presentation.toUpperCase()}</small>
          </div>
          <button className="icon-button" aria-label="空間展示を終了" onClick={leave}>×</button>
        </header>
        <p className="eyebrow">{exhibit.subtitle}{exhibit.isOriginal ? ' — ORIGINAL' : ''}</p>
        <h1 id="spatial-exhibit-title">{exhibit.title}</h1>
        <p className="spatial-exhibit-hud__story">{exhibit.oneSentence}</p>

        <div className="spatial-meter" data-aligned={aligned}>
          <div>
            <span>{aligned ? 'VIEW FOUND' : 'FIND THE VIEW'}</span>
            <strong>{error === null ? '—' : `${Math.round(error)} px`}</strong>
          </div>
          <i style={{ '--alignment': `${Math.max(4, 100 - Math.min(100, error ?? 100))}%` } as CSSProperties} />
          <small>{aligned ? '像が成立しています。少し動いて反転を比べてください。' : 'mint色の鑑賞点へ近づくと投影誤差が縮まります。'}</small>
        </div>

        <div className="spatial-state">
          <span>STATE {step + 1} / {exhibitStates.length}</span>
          <strong>{currentState}</strong>
          {reducedMotion && <small>モーション軽減: 自動移動を止め、静止状態で比較しています。</small>}
        </div>

        <div className="spatial-exhibit-hud__actions">
          <button className="button button--primary" onClick={() => requestViewSpot(activeId)}>鑑賞点へ移動</button>
          <button className="button button--quiet" onClick={advance}>状態を切り替える</button>
          <button className="button button--quiet" onClick={record}>{recorded ? '結果を更新' : '結果を記録'}</button>
          <button className="button button--quiet" onClick={() => openOverlay('hint')}>原理を見る</button>
        </div>
      </section>
      <MobileControls />
    </>
  )
}
