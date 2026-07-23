import { getMuseumMode } from '../app/museumMode'
import { exhibitById, getExhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'

export function ExhibitPrompt() {
  const focusedId = useMuseumStore((state) => state.focusedExhibitId)
  const enterExhibit = useMuseumStore((state) => state.enterExhibit)
  const openOverlay = useMuseumStore((state) => state.openOverlay)
  const exhibit = focusedId ? exhibitById.get(focusedId) : undefined
  if (!exhibit) return null
  const total = getExhibitCatalog(getMuseumMode()).length
  const spatial = getMuseumMode() === 'v2' && exhibit.presentation !== 'lab'

  return (
    <section className="exhibit-prompt" aria-live="polite">
      <div><span>{String(exhibit.number).padStart(2, '0')} / {total}</span><h2>{exhibit.title}</h2><p>{exhibit.prompt}</p></div>
      <div className="exhibit-prompt__actions">
        {!spatial && <button className="button button--primary" onClick={() => enterExhibit(exhibit.id)}>展示を開く <kbd>E</kbd></button>}
        <button className="button button--quiet" onClick={() => openOverlay('hint')}>見え方のヒント <kbd>H</kbd></button>
      </div>
    </section>
  )
}
