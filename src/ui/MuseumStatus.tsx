import type { CSSProperties } from 'react'
import { getMuseumMode } from '../app/museumMode'
import { getExhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'

export function MuseumStatus() {
  const progress = useMuseumStore((state) => state.progress)
  const openOverlay = useMuseumStore((state) => state.openOverlay)
  const catalog = getExhibitCatalog(getMuseumMode())
  const experienced = catalog.filter((item) => (progress[item.id] ?? 'unvisited') !== 'unvisited').length
  return (
    <button className="museum-status" onClick={() => openOverlay('map')} aria-label={`館内マップを開く、${experienced} / ${catalog.length} 展示を体験済み`}>
      <span className="museum-status__ring" style={{ '--progress': `${(experienced / catalog.length) * 100}%` } as CSSProperties}><i>{experienced}</i></span>
      <span><small>PROGRESS</small><strong>館内マップ</strong></span>
    </button>
  )
}

export function CompletionMessage() {
  const progress = useMuseumStore((state) => state.progress)
  const catalog = getExhibitCatalog(getMuseumMode())
  const complete = catalog.every((item) => (progress[item.id] ?? 'unvisited') !== 'unvisited')
  if (!complete) return null
  return <div className="completion-message" role="status"><span aria-hidden="true">✦</span><div><strong>視界がひらけました</strong><small>{catalog.length} / {catalog.length} の展示を体験しました。答え合わせがまだの作品もマップから確認できます。</small></div></div>
}
