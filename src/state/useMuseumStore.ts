import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { isV2Museum } from '../app/museumMode'
import { exhibitById, type ExhibitType } from '../exhibits/exhibitCatalog'

export type AppStage = 'title' | 'exploring' | 'exhibit' | 'spatial-exhibit'
export type Overlay = 'none' | 'settings' | 'hint' | 'map' | 'tutorial'
export type ExhibitProgress = 'unvisited' | 'interacted' | 'revealed'
export type QualityPreset = 'low' | 'high'

export type MuseumSettings = {
  volume: number
  lookSensitivity: number
  reducedMotion: boolean
  quality: QualityPreset
}

type MuseumState = {
  stage: AppStage
  overlay: Overlay
  previousOverlay: Overlay
  focusedExhibitId: ExhibitType | null
  activeExhibitId: ExhibitType | null
  progress: Record<string, ExhibitProgress>
  settings: MuseumSettings
  tutorialSeen: boolean
  enterMuseum: () => void
  returnToTitle: () => void
  openOverlay: (overlay: Exclude<Overlay, 'none'>) => void
  closeOverlay: () => void
  focusExhibit: (id: ExhibitType | null) => void
  enterExhibit: (id: ExhibitType) => void
  leaveExhibit: () => void
  markInteracted: (id: string) => void
  markRevealed: (id: string) => void
  updateSettings: (settings: Partial<MuseumSettings>) => void
  finishTutorial: () => void
  replayTutorial: () => void
}

export const defaultSettings: MuseumSettings = {
  volume: 0.55,
  lookSensitivity: 0.7,
  reducedMotion: false,
  quality: 'high',
}

export const MUSEUM_STORAGE_KEY = 'parallax-museum-v2'
export const LEGACY_STORAGE_KEY = 'parallax-museum-session'
export const MUSEUM_STORAGE_VERSION = 2

const progressRank: Record<ExhibitProgress, number> = {
  unvisited: 0,
  interacted: 1,
  revealed: 2,
}

function nextProgress(
  progress: Record<string, ExhibitProgress>,
  id: string,
  requested: ExhibitProgress,
) {
  const current = progress[id] ?? 'unvisited'
  if (progressRank[current] >= progressRank[requested]) return progress
  return { ...progress, [id]: requested }
}

type PersistedMuseumState = Pick<MuseumState, 'progress' | 'settings' | 'tutorialSeen'>

export function migrateMuseumState(persisted: unknown): PersistedMuseumState {
  const source = (persisted && typeof persisted === 'object' ? persisted : {}) as Partial<PersistedMuseumState>
  const progress = Object.fromEntries(
    Object.entries(source.progress ?? {}).filter(
      ([id, value]) =>
        exhibitById.has(id as ExhibitType) &&
        (value === 'unvisited' || value === 'interacted' || value === 'revealed'),
    ),
  )
  return {
    progress,
    settings: { ...defaultSettings, ...(source.settings ?? {}) },
    tutorialSeen: Boolean(source.tutorialSeen),
  }
}

const museumStorage = createJSONStorage(() => ({
  getItem: (name: string) =>
    window.localStorage.getItem(name) ??
    (name === MUSEUM_STORAGE_KEY ? window.sessionStorage.getItem(LEGACY_STORAGE_KEY) : null),
  setItem: (name: string, value: string) => window.localStorage.setItem(name, value),
  removeItem: (name: string) => window.localStorage.removeItem(name),
}))

export const useMuseumStore = create<MuseumState>()(
  persist(
    (set) => ({
      stage: 'title',
      overlay: 'none',
      previousOverlay: 'none',
      focusedExhibitId: null,
      activeExhibitId: null,
      progress: {},
      settings: defaultSettings,
      tutorialSeen: false,
      enterMuseum: () =>
        set((state) => ({ stage: 'exploring', overlay: state.tutorialSeen ? 'none' : 'tutorial' })),
      returnToTitle: () =>
        set({
          stage: 'title',
          overlay: 'none',
          activeExhibitId: null,
          focusedExhibitId: null,
        }),
      openOverlay: (overlay) =>
        set((state) => ({ overlay, previousOverlay: state.overlay })),
      closeOverlay: () => set({ overlay: 'none', previousOverlay: 'none' }),
      focusExhibit: (focusedExhibitId) => set({ focusedExhibitId }),
      enterExhibit: (activeExhibitId) => {
        const exhibit = exhibitById.get(activeExhibitId)
        const spatial = isV2Museum() && exhibit?.presentation !== 'lab'
        set({ stage: spatial ? 'spatial-exhibit' : 'exhibit', activeExhibitId, overlay: 'none' })
      },
      leaveExhibit: () =>
        set({ stage: 'exploring', activeExhibitId: null, overlay: 'none' }),
      markInteracted: (id) =>
        set((state) => ({ progress: nextProgress(state.progress, id, 'interacted') })),
      markRevealed: (id) =>
        set((state) => ({ progress: nextProgress(state.progress, id, 'revealed') })),
      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
      finishTutorial: () => set({ tutorialSeen: true }),
      replayTutorial: () =>
        set((state) => ({ tutorialSeen: false, overlay: state.stage === 'exploring' ? 'tutorial' : state.overlay })),
    }),
    {
      name: MUSEUM_STORAGE_KEY,
      version: MUSEUM_STORAGE_VERSION,
      storage: museumStorage,
      migrate: (persisted) => migrateMuseumState(persisted),
      partialize: (state) => ({
        progress: state.progress,
        settings: state.settings,
        tutorialSeen: state.tutorialSeen,
      }),
    },
  ),
)
