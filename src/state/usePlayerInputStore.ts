import { create } from 'zustand'

type Direction = 'forward' | 'backward' | 'left' | 'right'
type PlayerInputState = Record<Direction, boolean> & {
  setDirection: (direction: Direction, pressed: boolean) => void
  clear: () => void
}

export const usePlayerInputStore = create<PlayerInputState>((set) => ({
  forward: false,
  backward: false,
  left: false,
  right: false,
  setDirection: (direction, pressed) => set({ [direction]: pressed }),
  clear: () => set({ forward: false, backward: false, left: false, right: false }),
}))
