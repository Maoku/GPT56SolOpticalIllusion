import { getMuseumMode } from '../app/museumMode'
import { getExhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore, type ExhibitProgress } from '../state/useMuseumStore'
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap'

const progressLabel: Record<ExhibitProgress, string> = {
  unvisited: '未体験', interacted: '操作済み', revealed: '答え合わせ済み',
}

export function MuseumMap() {
  const progress = useMuseumStore((state) => state.progress)
  const closeOverlay = useMuseumStore((state) => state.closeOverlay)
  const enterExhibit = useMuseumStore((state) => state.enterExhibit)
  const requestViewSpot = useMuseumStore((state) => state.requestViewSpot)
  const openOverlay = useMuseumStore((state) => state.openOverlay)
  const dialog = useDialogFocusTrap<HTMLElement>(closeOverlay)
  const mode = getMuseumMode()
  const catalog = getExhibitCatalog(mode)
  const experienced = catalog.filter((item) => (progress[item.id] ?? 'unvisited') !== 'unvisited').length
  return (
    <div className="modal-backdrop">
      <section className="museum-map" role="dialog" aria-modal="true" aria-labelledby="map-title" ref={dialog}>
        <header className="panel-heading">
          <div><p className="eyebrow">YOUR VISIT — {experienced} / {catalog.length}</p><h2 id="map-title">館内マップと展示一覧</h2></div>
          <div className="museum-map__heading-actions">
            {mode === 'v2' && <button className="button button--quiet" onClick={() => openOverlay('passport')}>パスポート</button>}
            <button className="icon-button" aria-label="マップを閉じる" onClick={closeOverlay}>×</button>
          </div>
        </header>
        <div className="museum-map__body">
          <div className={`floor-map ${mode === 'v2' ? 'floor-map--v2' : ''}`} aria-label={`${mode === 'v2' ? 4 : 3}つの展示ゾーンの概略図`}>
            {mode === 'v2' ? (
              <>
                <div className="floor-zone floor-zone--classics"><span>01—04 · 06—07</span><strong>CLASSICS LAB</strong></div>
                <div className="floor-zone floor-zone--arrival"><span>ENTRANCE</span><strong>ARRIVAL ATRIUM</strong></div>
                <div className="floor-zone floor-zone--scale-light"><span>05 · 08</span><strong>SCALE + LIGHT</strong></div>
                <div className="floor-zone floor-zone--signature"><span>09—12</span><strong>SIGNATURE HALL</strong></div>
              </>
            ) : (
              <>
                <div className="floor-zone floor-zone--lobby"><span>ENTRANCE</span><strong>ロビー</strong></div>
                <div className="floor-zone floor-zone--geometry"><span>01—04</span><strong>形と大きさ</strong></div>
                <div className="floor-zone floor-zone--light"><span>05—07</span><strong>光と運動</strong></div>
                <div className="floor-zone floor-zone--space"><span>08—10</span><strong>空間と残像</strong></div>
              </>
            )}
          </div>
          <ol className="exhibit-list">
            {catalog.map((exhibit) => {
              const state = progress[exhibit.id] ?? 'unvisited'
              const visit = () => {
                const search = new URLSearchParams(window.location.search)
                search.set('exhibit', exhibit.id)
                if (mode === 'v1') search.set('museum', 'v1')
                else search.delete('museum')
                window.history.replaceState({}, '', `?${search.toString()}`)
                closeOverlay()
                enterExhibit(exhibit.id)
                if (exhibit.presentation !== 'lab') requestViewSpot(exhibit.id)
              }
              return (
                <li key={exhibit.id} data-progress={state}>
                  <span className="progress-symbol" aria-hidden="true">{state === 'revealed' ? '◆' : state === 'interacted' ? '◒' : '○'}</span>
                  <span><small>{String(exhibit.number).padStart(2, '0')} · {exhibit.venue.toUpperCase()}</small><strong>{exhibit.title}</strong></span>
                  <em>{progressLabel[state]}</em>
                  <button className="museum-map__visit" onClick={visit}>開く</button>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </div>
  )
}
