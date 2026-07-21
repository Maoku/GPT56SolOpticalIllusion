import { useEffect, useRef } from 'react'

export type InputAction =
  | 'move-forward'
  | 'move-backward'
  | 'move-left'
  | 'move-right'
  | 'interact'
  | 'hint'
  | 'reset'
  | 'escape'

export type InputSnapshot = Record<
  'forward' | 'backward' | 'left' | 'right',
  boolean
>

const keyToAction: Record<string, InputAction | undefined> = {
  KeyW: 'move-forward',
  ArrowUp: 'move-forward',
  KeyS: 'move-backward',
  ArrowDown: 'move-backward',
  KeyA: 'move-left',
  ArrowLeft: 'move-left',
  KeyD: 'move-right',
  ArrowRight: 'move-right',
  KeyE: 'interact',
  Enter: 'interact',
  KeyH: 'hint',
  KeyR: 'reset',
  Escape: 'escape',
}

export function actionForKeyboardCode(code: string) {
  return keyToAction[code]
}

export function useUnifiedInput(onAction: (action: InputAction, pressed: boolean) => void) {
  const callback = useRef(onAction)
  callback.current = onAction

  useEffect(() => {
    const handleKey = (event: KeyboardEvent, pressed: boolean) => {
      const action = actionForKeyboardCode(event.code)
      if (!action) return
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return
      event.preventDefault()
      callback.current(action, pressed)
    }

    const onKeyDown = (event: KeyboardEvent) => handleKey(event, true)
    const onKeyUp = (event: KeyboardEvent) => handleKey(event, false)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])
}
