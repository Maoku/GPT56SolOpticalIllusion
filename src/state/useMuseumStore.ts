import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { isV2Museum } from '../app/museumMode'
import { exhibitById, type ExhibitType } from '../exhibits/exhibitCatalog'
import {
  createExhibitOutcome,
  isExhibitOutcome,
  type ExhibitOutcome,
  type OutcomeDraft,
} from './outcomes'

export type AppStage = 'title' | 'exploring' | 'exhibit' | 'spatial-exhibit'
export type Overlay = 'none' | 'settings' | 'hint' | 'map' | 'passport' | 'tutorial'
export type ExhibitProgress = 'unvisited' | 'interacted' | 'revealed'
export type QualityPreset = 'low' | 'high'

export type MuseumSettings = {
  volume: number
  lookSensitivity: number
  reducedMotion: boolean
  quality: QualityPreset
}

export type CameraRequest = {
  nonce: number
  position: [number, number, number]
  target: [number, number, number]
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
  outcomes: Partial<Record<ExhibitType, ExhibitOutcome>>
  lastVisitedExhibitId: ExhibitType | null
  spatialStep: number
  alignmentError: number | null
  cameraRequest: CameraRequest | null
  enterMuseum: () => void
  returnToTitle: () => void
  openOverlay: (overlay: Exclude<Overlay, 'none'>) => void
  closeOverlay: () => void
  focusExhibit: (id: ExhibitType | null) => void
  enterExhibit: (id: ExhibitType) => void
  leaveExhibit: () => void
  setSpatialStep: (step: number) => void
  setAlignmentError: (error: number | null) => void
  requestViewSpot: (id: ExhibitType) => void
  markInteracted: (id: string) => void
  markRevealed: (id: string) => void
  recordOutcome: (id: ExhibitType, draft?: OutcomeDraft) => void
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
export const MUSEUM_STORAGE_VERSION = 3

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

type PersistedMuseumState = Pick<
  MuseumState,
  'progress' | 'settings' | 'tutorialSeen' | 'outcomes' | 'lastVisitedExhibitId'
>

export function migrateMuseumState(persisted: unknown): PersistedMuseumState {
  const source = (persisted && typeof persisted === 'object' ? persisted : {}) as Partial<PersistedMuseumState>
  const progress = Object.fromEntries(
    Object.entries(source.progress ?? {}).filter(
      ([id, value]) =>
        exhibitById.has(id as ExhibitType) &&
        (value === 'unvisited' || value === 'interacted' || value === 'revealed'),
    ),
  )
  const outcomes = Object.fromEntries(
    Object.entries(source.outcomes ?? {}).filter(
      ([id, outcome]) => exhibitById.has(id as ExhibitType) && isExhibitOutcome(outcome),
    ),
  ) as Partial<Record<ExhibitType, ExhibitOutcome>>
  const lastVisitedExhibitId =
    source.lastVisitedExhibitId && exhibitById.has(source.lastVisitedExhibitId)
      ? source.lastVisitedExhibitId
      : null
  return {
    progress,
    settings: { ...defaultSettings, ...(source.settings ?? {}) },
    tutorialSeen: Boolean(source.tutorialSeen),
    outcomes,
    lastVisitedExhibitId,
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
      outcomes: {},
      lastVisitedExhibitId: null,
      spatialStep: 0,
      alignmentError: null,
      cameraRequest: null,
      enterMuseum: () =>
        set((state) => ({ stage: 'exploring', overlay: state.tutorialSeen ? 'none' : 'tutorial' })),
      returnToTitle: () =>
        set({
          stage: 'title',
          overlay: 'none',
          activeExhibitId: null,
          focusedExhibitId: null,
          spatialStep: 0,
          alignmentError: null,
        }),
      openOverlay: (overlay) =>
        set((state) => ({ overlay, previousOverlay: state.overlay })),
      closeOverlay: () => set({ overlay: 'none', previousOverlay: 'none' }),
      focusExhibit: (focusedExhibitId) => set({ focusedExhibitId }),
      enterExhibit: (activeExhibitId) => {
        const exhibit = exhibitById.get(activeExhibitId)
        const spatial = isV2Museum() && exhibit?.presentation !== 'lab'
        set({
          stage: spatial ? 'spatial-exhibit' : 'exhibit',
          activeExhibitId,
          overlay: 'none',
          spatialStep: 0,
          alignmentError: null,
          lastVisitedExhibitId: activeExhibitId,
        })
      },
      leaveExhibit: () =>
        set({
          stage: 'exploring',
          activeExhibitId: null,
          overlay: 'none',
          spatialStep: 0,
          alignmentError: null,
        }),
      setSpatialStep: (spatialStep) => set({ spatialStep }),
      setAlignmentError: (alignmentError) => set({ alignmentError }),
      requestViewSpot: (id) => {
        const viewSpot = exhibitById.get(id)?.viewSpots?.[0]
        if (!viewSpot) return
        set((state) => ({
          cameraRequest: {
            nonce: (state.cameraRequest?.nonce ?? 0) + 1,
            position: viewSpot.position,
            target: viewSpot.target,
          },
        }))
      },
      markInteracted: (id) =>
        set((state) => ({ progress: nextProgress(state.progress, id, 'interacted') })),
      markRevealed: (id) =>
        set((state) => ({ progress: nextProgress(state.progress, id, 'revealed') })),
      recordOutcome: (id, draft = {}) =>
        set((state) => {
          const exhibit = exhibitById.get(id)
          if (!exhibit) return state
          return {
            outcomes: {
              ...state.outcomes,
              [id]: createExhibitOutcome(exhibit, draft, state.outcomes[id]),
            },
            lastVisitedExhibitId: id,
            progress: nextProgress(state.progress, id, 'interacted'),
          }
        }),
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
        outcomes: state.outcomes,
        lastVisitedExhibitId: state.lastVisitedExhibitId,
      }),
    },
  ),
)
