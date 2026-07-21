import { exhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'

export function applyUrlState(search: string) {
  const exhibitId = new URLSearchParams(search).get('exhibit')
  const exhibit = exhibitCatalog.find((item) => item.id === exhibitId)
  if (!exhibit) return
  useMuseumStore.setState({
    stage: 'exhibit',
    overlay: 'none',
    activeExhibitId: exhibit.id,
    focusedExhibitId: exhibit.id,
    tutorialSeen: true,
  })
}
