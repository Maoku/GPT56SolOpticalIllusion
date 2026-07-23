import { getMuseumMode } from '../app/museumMode'
import { exhibitById, getExhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'

export function ExhibitPrompt() {
  const focusedId = useMuseumStore((state) => state.focusedExhibitId)
  const enterExhibit = useMuseumStore((state) => state.enterExhibit)
  const operateLiveExhibit = useMuseumStore((state) => state.operateLiveExhibit)
  const openOverlay = useMuseumStore((state) => state.openOverlay)
  const progress = useMuseumStore((state) => focusedId ? state.progress[focusedId] : undefined)
  const exhibit = focusedId ? exhibitById.get(focusedId) : undefined
  if (!exhibit) return null
  const total = getExhibitCatalog(getMuseumMode()).length
  const spatial = getMuseumMode() === 'v2' && exhibit.presentation !== 'lab'
  const liveClassic = getMuseumMode() === 'v2' && exhibit.venue === 'classics'

  return (
    <section className="exhibit-prompt" aria-live="polite">
      <div>
        <span>{String(exhibit.number).padStart(2, '0')} / {total}</span>
        <h2>{exhibit.title}</h2>
        <p>{progress === 'unvisited' || !progress ? exhibit.prompt : '観察を自動記録しました。続けて変化を比べられます。'}</p>
      </div>
      <div className="exhibit-prompt__actions">
        {!spatial && (
          <button
            className="button button--primary"
            onClick={() => liveClassic ? operateLiveExhibit(exhibit.id) : enterExhibit(exhibit.id)}
          >
            {liveClassic ? '展示台を操作' : '展示を開く'} <kbd>E</kbd>
          </button>
        )}
        {liveClassic && <button className="button button--quiet" onClick={() => enterExhibit(exhibit.id)}>詳細実験</button>}
        <button className="button button--quiet" onClick={() => openOverlay('hint')}>見え方のヒント <kbd>H</kbd></button>
      </div>
    </section>
  )
}
