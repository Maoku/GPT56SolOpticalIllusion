import { useMuseumStore } from '../state/useMuseumStore'
import { Crosshair } from './Crosshair'
import { ExhibitPrompt } from './ExhibitPrompt'
import { MobileControls } from './MobileControls'
import { CompletionMessage, MuseumStatus } from './MuseumStatus'

export function ExplorationHud() {
  const focused = useMuseumStore((state) => state.focusedExhibitId !== null)
  return (
    <>
      <Crosshair active={focused} />
      <ExhibitPrompt />
      <MuseumStatus />
      <CompletionMessage />
      <MobileControls />
    </>
  )
}
