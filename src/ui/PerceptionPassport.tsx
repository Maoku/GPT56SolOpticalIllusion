import { useMemo, useState, type CSSProperties } from 'react'
import {
  exhibitById,
  type PerceptionAxis,
} from '../exhibits/exhibitCatalog'
import { recommendNextExhibit } from '../exhibits/recommendation'
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap'
import {
  buildOutcomeCardSvg,
  buildPassportSvg,
  downloadSvg,
} from '../lib/passportExport'
import { useMuseumStore } from '../state/useMuseumStore'
import type { ExhibitOutcome } from '../state/outcomes'

const axes: {
  id: PerceptionAxis
  label: string
  description: string
  color: string
}[] = [
  { id: 'perspective', label: 'PERSPECTIVE', description: '遠近・視差・固定視点', color: '#7ef4d2' },
  { id: 'context', label: 'CONTEXT', description: '周囲の大きさ・線・影', color: '#ff68bd' },
  { id: 'light', label: 'LIGHT', description: '明るさ・色順応・照明', color: '#ffe08a' },
  { id: 'motion', label: 'MOTION', description: '注視・運動・反転', color: '#69cfff' },
]

function latestForAxis(outcomes: ExhibitOutcome[], axis: PerceptionAxis) {
  return outcomes
    .filter((outcome) => outcome.axis === axis)
    .sort((a, b) => b.recordedAt - a.recordedAt)[0]
}

export function PerceptionPassport() {
  const outcomesById = useMuseumStore((state) => state.outcomes)
  const progress = useMuseumStore((state) => state.progress)
  const lastVisited = useMuseumStore((state) => state.lastVisitedExhibitId)
  const stage = useMuseumStore((state) => state.stage)
  const close = useMuseumStore((state) => state.closeOverlay)
  const enterMuseum = useMuseumStore((state) => state.enterMuseum)
  const enterExhibit = useMuseumStore((state) => state.enterExhibit)
  const requestViewSpot = useMuseumStore((state) => state.requestViewSpot)
  const dialog = useDialogFocusTrap<HTMLElement>(close)
  const [shareStatus, setShareStatus] = useState('')
  const outcomes = useMemo(
    () => Object.values(outcomesById).filter((outcome): outcome is ExhibitOutcome => Boolean(outcome)),
    [outcomesById],
  )
  const next = recommendNextExhibit(progress, lastVisited)
  const representedAxes = new Set(outcomes.map((outcome) => outcome.axis)).size

  const savePassport = () => {
    downloadSvg(buildPassportSvg(outcomesById), 'parallax-perception-passport.svg')
    setShareStatus('パスポート画像を保存しました')
  }

  const sharePassport = async () => {
    const shareData = {
      title: 'PARALLAX — PERCEPTION PASSPORT',
      text: `${outcomes.length}件の錯視実験を記録しました。`,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareStatus('共有先を開きました')
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setShareStatus('来館リンクをコピーしました')
      } else {
        setShareStatus('このブラウザでは共有を利用できません')
      }
    } catch {
      setShareStatus('共有はキャンセルされました')
    }
  }

  const visitNext = () => {
    if (!next) {
      close()
      return
    }
    close()
    if (stage === 'title') enterMuseum()
    enterExhibit(next.id)
    if (next.presentation !== 'lab') requestViewSpot(next.id)
  }

  return (
    <div className="modal-backdrop passport-backdrop">
      <section
        className="perception-passport"
        role="dialog"
        aria-modal="true"
        aria-labelledby="passport-title"
        ref={dialog}
      >
        <header className="passport-heading">
          <div>
            <p className="eyebrow">PARALLAX 2.0 · SESSION OBSERVATION</p>
            <h2 id="passport-title">PERCEPTION PASSPORT</h2>
            <p>今回の実験で、どの手がかりに影響されたかを残す娯楽・学習用の記録です。視力検査や診断ではありません。</p>
          </div>
          <button className="icon-button" aria-label="パスポートを閉じる" onClick={close}>×</button>
        </header>

        <div className="passport-axis-grid">
          {axes.map((axis) => {
            const outcome = latestForAxis(outcomes, axis.id)
            const exhibit = outcome ? exhibitById.get(outcome.exhibitId) : undefined
            return (
              <article
                key={axis.id}
                className="passport-axis"
                style={{ '--axis-color': axis.color } as CSSProperties}
              >
                <header><span>{axis.label}</span><small>{axis.description}</small></header>
                <div className="passport-axis__mark" data-recorded={Boolean(outcome)}>
                  <i>{outcome ? 'REC' : '—'}</i>
                </div>
                {outcome ? (
                  <div>
                    <strong>{outcome.metric ? `${outcome.metric.value}${outcome.metric.unit ?? ''}` : exhibit?.title}</strong>
                    <p>{outcome.metric?.label ?? outcome.headline}</p>
                  </div>
                ) : (
                  <p>この軸の展示結果は、次の実験で追加されます。</p>
                )}
              </article>
            )
          })}
        </div>

        <div className="passport-summary">
          <div>
            <span>FIRST PASSPORT</span>
            <strong>{representedAxes} / 4 AXES</strong>
            <small>{representedAxes === 4 ? '4つの知覚軸がそろいました。' : '4軸を一つずつ体験すると最初のパスポートが完成します。'}</small>
          </div>
          {next && (
            <article className="passport-next">
              <span>RECOMMENDED NEXT</span>
              <strong>{String(next.number).padStart(2, '0')} · {next.title}</strong>
              <small>{next.oneSentence}</small>
              <button className="button button--primary" onClick={visitNext}>この展示へ</button>
            </article>
          )}
        </div>

        {outcomes.length > 0 && (
          <div className="passport-records">
            <span>RECORDED EXHIBITS</span>
            <div>
              {outcomes
                .sort((a, b) => a.exhibitId.localeCompare(b.exhibitId))
                .map((outcome) => {
                  const exhibit = exhibitById.get(outcome.exhibitId)
                  return (
                    <button
                      key={outcome.exhibitId}
                      className="passport-record"
                      onClick={() => downloadSvg(
                        buildOutcomeCardSvg(outcome),
                        `parallax-${outcome.exhibitId}-result.svg`,
                      )}
                    >
                      <span style={{ background: exhibit?.accent }} />
                      <strong>{String(exhibit?.number ?? 0).padStart(2, '0')}</strong>
                      <small>{exhibit?.title}</small>
                      <em>CARD ↓</em>
                    </button>
                  )
                })}
            </div>
          </div>
        )}

        <footer className="passport-actions">
          <span role="status">{shareStatus}</span>
          <div>
            <button className="button button--quiet" onClick={savePassport}>SAVE</button>
            <button className="button button--quiet" onClick={() => void sharePassport()}>SHARE</button>
            <button className="button button--primary" onClick={close}>CONTINUE</button>
          </div>
        </footer>
      </section>
    </div>
  )
}
