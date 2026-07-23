import { exhibitById } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap'

function ModalHintPanel({ exhibitId }: { exhibitId: NonNullable<ReturnType<typeof useMuseumStore.getState>['activeExhibitId']> }) {
  const closeOverlay = useMuseumStore((state) => state.closeOverlay)
  const dialog = useDialogFocusTrap<HTMLElement>(closeOverlay)
  const exhibit = exhibitById.get(exhibitId)
  if (!exhibit) return null
  return (
    <div className="modal-backdrop">
      <aside className="hint-panel" role="dialog" aria-modal="true" aria-labelledby="hint-title" ref={dialog}>
        <div className="panel-heading"><div><p className="eyebrow">A WAY OF SEEING</p><h2 id="hint-title">見え方のヒント</h2></div><button className="icon-button" aria-label="ヒントを閉じる" onClick={closeOverlay}>×</button></div>
        <p className="hint-panel__title">{exhibit.title}</p>
        <p className="hint-panel__summary">{exhibit.hint.summary}</p>
        <div className="hint-panel__explanation"><span>WHY?</span><p>{exhibit.hint.explanation}</p></div>
        <p className="hint-panel__note">ヒントを閉じても操作状態はそのままです。答え合わせは展示画面から選べます。</p>
        <button className="button button--primary" onClick={closeOverlay}>自分の目で確かめる</button>
      </aside>
    </div>
  )
}

function SpatialHintPanel({ exhibitId }: { exhibitId: NonNullable<ReturnType<typeof useMuseumStore.getState>['activeExhibitId']> }) {
  const closeOverlay = useMuseumStore((state) => state.closeOverlay)
  const exhibit = exhibitById.get(exhibitId)
  if (!exhibit) return null
  return (
    <aside className="spatial-help-drawer" aria-labelledby="spatial-help-title">
      <div className="panel-heading">
        <div><p className="eyebrow">AFTER LOOKING</p><h2 id="spatial-help-title">見え方の解説</h2></div>
        <button className="icon-button" aria-label="ヒントを閉じる" onClick={closeOverlay}>×</button>
      </div>
      <p className="hint-panel__title">{exhibit.title}</p>
      <p className="hint-panel__summary">{exhibit.hint.summary}</p>
      <div className="hint-panel__explanation"><span>WHY?</span><p>{exhibit.hint.explanation}</p></div>
      <button className="button button--primary" onClick={closeOverlay}>作品へ戻る</button>
    </aside>
  )
}

export function HintPanel() {
  const stage = useMuseumStore((state) => state.stage)
  const activeId = useMuseumStore((state) => state.activeExhibitId)
  const focusedId = useMuseumStore((state) => state.focusedExhibitId)
  const exhibitId = activeId ?? focusedId ?? 'muller-lyer'
  return stage === 'spatial-exhibit'
    ? <SpatialHintPanel exhibitId={exhibitId} />
    : <ModalHintPanel exhibitId={exhibitId} />
}
