import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AppStage = 'title' | 'exploring' | 'exhibit'
export type Overlay = 'none' | 'settings' | 'hint' | 'map'
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
  focusedExhibitId: string | null
  activeExhibitId: string | null
  progress: Record<string, ExhibitProgress>
  settings: MuseumSettings
  tutorialSeen: boolean
  enterMuseum: () => void
  returnToTitle: () => void
  openOverlay: (overlay: Exclude<Overlay, 'none'>) => void
  closeOverlay: () => void
  focusExhibit: (id: string | null) => void
  enterExhibit: (id: string) => void
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
      enterMuseum: () => set({ stage: 'exploring', overlay: 'none' }),
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
      enterExhibit: (activeExhibitId) =>
        set({ stage: 'exhibit', activeExhibitId, overlay: 'none' }),
      leaveExhibit: () =>
        set({ stage: 'exploring', activeExhibitId: null, overlay: 'none' }),
      markInteracted: (id) =>
        set((state) => ({ progress: nextProgress(state.progress, id, 'interacted') })),
      markRevealed: (id) =>
        set((state) => ({ progress: nextProgress(state.progress, id, 'revealed') })),
      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
      finishTutorial: () => set({ tutorialSeen: true }),
      replayTutorial: () => set({ tutorialSeen: false }),
    }),
    {
      name: 'parallax-museum-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        progress: state.progress,
        settings: state.settings,
        tutorialSeen: state.tutorialSeen,
      }),
    },
  ),
)
