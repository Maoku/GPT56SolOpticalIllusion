export type MuseumMode = 'v1' | 'v2'

export function museumModeFromSearch(search: string): MuseumMode {
  return new URLSearchParams(search).get('museum') === 'v1' ? 'v1' : 'v2'
}

export function getMuseumMode(): MuseumMode {
  if (typeof window === 'undefined') return 'v2'
  return museumModeFromSearch(window.location.search)
}

export function isV2Museum() {
  return getMuseumMode() === 'v2'
}
