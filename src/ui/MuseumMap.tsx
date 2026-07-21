import { exhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore, type ExhibitProgress } from '../state/useMuseumStore'

const progressLabel: Record<ExhibitProgress, string> = {
  unvisited: '未体験', interacted: '操作済み', revealed: '答え合わせ済み',
}

export function MuseumMap() {
  const progress = useMuseumStore((state) => state.progress)
  const closeOverlay = useMuseumStore((state) => state.closeOverlay)
  const experienced = exhibitCatalog.filter((item) => (progress[item.id] ?? 'unvisited') !== 'unvisited').length
  return (
    <div className="modal-backdrop">
      <section className="museum-map" role="dialog" aria-modal="true" aria-labelledby="map-title">
        <header className="panel-heading"><div><p className="eyebrow">YOUR VISIT — {experienced} / 10</p><h2 id="map-title">館内マップと展示一覧</h2></div><button className="icon-button" aria-label="マップを閉じる" onClick={closeOverlay}>×</button></header>
        <div className="museum-map__body">
          <div className="floor-map" aria-label="3つの展示ゾーンの概略図">
            <div className="floor-zone floor-zone--lobby"><span>ENTRANCE</span><strong>ロビー</strong></div>
            <div className="floor-zone floor-zone--geometry"><span>01—04</span><strong>形と大きさ</strong></div>
            <div className="floor-zone floor-zone--light"><span>05—07</span><strong>光と運動</strong></div>
            <div className="floor-zone floor-zone--space"><span>08—10</span><strong>空間と残像</strong></div>
          </div>
          <ol className="exhibit-list">
            {exhibitCatalog.map((exhibit) => {
              const state = progress[exhibit.id] ?? 'unvisited'
              return <li key={exhibit.id} data-progress={state}><span className="progress-symbol" aria-hidden="true">{state === 'revealed' ? '◆' : state === 'interacted' ? '◒' : '○'}</span><span><small>{String(exhibit.number).padStart(2, '0')} · {exhibit.zone.toUpperCase()}</small><strong>{exhibit.title}</strong></span><em>{progressLabel[state]}</em></li>
            })}
          </ol>
        </div>
      </section>
    </div>
  )
}
