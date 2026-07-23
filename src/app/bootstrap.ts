import { exhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'
import { museumModeFromSearch } from './museumMode'

export function applyUrlState(search: string) {
  const exhibitId = new URLSearchParams(search).get('exhibit')
  const exhibit = exhibitCatalog.find((item) => item.id === exhibitId)
  if (!exhibit) return
  const spatial = museumModeFromSearch(search) === 'v2' && exhibit.presentation !== 'lab'
  useMuseumStore.setState({
    stage: spatial ? 'spatial-exhibit' : 'exhibit',
    overlay: 'none',
    activeExhibitId: exhibit.id,
    focusedExhibitId: exhibit.id,
    tutorialSeen: true,
  })
}
