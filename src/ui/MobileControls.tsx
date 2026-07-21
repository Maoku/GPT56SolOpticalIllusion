import type { PointerEvent } from 'react'
import { usePlayerInputStore } from '../state/usePlayerInputStore'

const directions = [
  ['forward', '↑', '前へ'], ['left', '←', '左へ'], ['backward', '↓', '後ろへ'], ['right', '→', '右へ'],
] as const

export function MobileControls() {
  const setDirection = usePlayerInputStore((state) => state.setDirection)
  const handle = (direction: (typeof directions)[number][0], pressed: boolean) => (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (pressed) event.currentTarget.setPointerCapture(event.pointerId)
    setDirection(direction, pressed)
  }
  return (
    <div className="mobile-controls" aria-label="移動コントローラー">
      {directions.map(([direction, glyph, label]) => (
        <button
          key={direction} className={`mobile-controls__${direction}`} aria-label={label}
          onPointerDown={handle(direction, true)} onPointerUp={handle(direction, false)}
          onPointerCancel={handle(direction, false)} onContextMenu={(event) => event.preventDefault()}
        >{glyph}</button>
      ))}
      <span className="mobile-look-hint">右側をドラッグして見る</span>
    </div>
  )
}
