export type MuseumMode = 'v1' | 'v2'

export function museumModeFromSearch(search: string): MuseumMode {
  return new URLSearchParams(search).get('museum') === 'v2' ? 'v2' : 'v1'
}

export function getMuseumMode(): MuseumMode {
  if (typeof window === 'undefined') return 'v1'
  return museumModeFromSearch(window.location.search)
}

export function isV2Museum() {
  return getMuseumMode() === 'v2'
}
