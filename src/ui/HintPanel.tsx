import { useEffect, useRef } from 'react'
import { exhibitById } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'

export function HintPanel() {
  const activeId = useMuseumStore((state) => state.activeExhibitId)
  const focusedId = useMuseumStore((state) => state.focusedExhibitId)
  const closeOverlay = useMuseumStore((state) => state.closeOverlay)
  const closeButton = useRef<HTMLButtonElement>(null)
  const exhibit = exhibitById.get(activeId ?? focusedId ?? 'muller-lyer')

  useEffect(() => { closeButton.current?.focus() }, [])
  if (!exhibit) return null
  return (
    <div className="modal-backdrop">
      <aside className="hint-panel" role="dialog" aria-modal="true" aria-labelledby="hint-title">
        <div className="panel-heading"><div><p className="eyebrow">A WAY OF SEEING</p><h2 id="hint-title">見え方のヒント</h2></div><button ref={closeButton} className="icon-button" aria-label="ヒントを閉じる" onClick={closeOverlay}>×</button></div>
        <p className="hint-panel__title">{exhibit.title}</p>
        <p className="hint-panel__summary">{exhibit.hint.summary}</p>
        <div className="hint-panel__explanation"><span>WHY?</span><p>{exhibit.hint.explanation}</p></div>
        <p className="hint-panel__note">ヒントを閉じても操作状態はそのままです。答え合わせは展示画面から選べます。</p>
        <button className="button button--primary" onClick={closeOverlay}>自分の目で確かめる</button>
      </aside>
    </div>
  )
}
