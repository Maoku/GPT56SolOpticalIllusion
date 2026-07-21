import { exhibitById } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'

export function ExhibitPrompt() {
  const focusedId = useMuseumStore((state) => state.focusedExhibitId)
  const enterExhibit = useMuseumStore((state) => state.enterExhibit)
  const openOverlay = useMuseumStore((state) => state.openOverlay)
  const exhibit = focusedId ? exhibitById.get(focusedId) : undefined
  if (!exhibit) return null

  return (
    <section className="exhibit-prompt" aria-live="polite">
      <div><span>{String(exhibit.number).padStart(2, '0')} / 10</span><h2>{exhibit.title}</h2><p>{exhibit.prompt}</p></div>
      <div className="exhibit-prompt__actions">
        <button className="button button--primary" onClick={() => enterExhibit(exhibit.id)}>操作する <kbd>E</kbd></button>
        <button className="button button--quiet" onClick={() => openOverlay('hint')}>見え方のヒント <kbd>H</kbd></button>
      </div>
    </section>
  )
}
