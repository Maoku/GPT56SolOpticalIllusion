import type { CSSProperties } from 'react'
import { exhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'

export function MuseumStatus() {
  const progress = useMuseumStore((state) => state.progress)
  const openOverlay = useMuseumStore((state) => state.openOverlay)
  const experienced = exhibitCatalog.filter((item) => (progress[item.id] ?? 'unvisited') !== 'unvisited').length
  return (
    <button className="museum-status" onClick={() => openOverlay('map')} aria-label={`館内マップを開く、${experienced} / 10 展示を体験済み`}>
      <span className="museum-status__ring" style={{ '--progress': `${experienced * 10}%` } as CSSProperties}><i>{experienced}</i></span>
      <span><small>PROGRESS</small><strong>館内マップ</strong></span>
    </button>
  )
}

export function CompletionMessage() {
  const progress = useMuseumStore((state) => state.progress)
  const complete = exhibitCatalog.every((item) => (progress[item.id] ?? 'unvisited') !== 'unvisited')
  if (!complete) return null
  return <div className="completion-message" role="status"><span aria-hidden="true">✦</span><div><strong>視界がひらけました</strong><small>10 / 10 の展示を体験しました。答え合わせがまだの作品もマップから確認できます。</small></div></div>
}
