import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Euler, Vector3 } from 'three'
import { getMuseumMode } from '../../app/museumMode'
import { getExhibitCatalog } from '../../exhibits/exhibitCatalog'
import type { ExhibitType } from '../../exhibits/exhibitCatalog'
import { useUnifiedInput, type InputAction } from '../../hooks/useUnifiedInput'
import { useMuseumStore } from '../../state/useMuseumStore'
import { usePlayerInputStore } from '../../state/usePlayerInputStore'
import { resolvePlayerPosition } from '../CollisionWorld'
import { selectFocusedExhibit } from '../focus'

const directionForAction = {
  'move-forward': 'forward',
  'move-backward': 'backward',
  'move-left': 'left',
  'move-right': 'right',
} as const

export function PlayerController() {
  const { camera, gl } = useThree()
  const yaw = useRef(0)
  const pitch = useRef(0)
  const focusedId = useRef<ExhibitType | null>(null)
  const lastTouch = useRef<[number, number] | null>(null)
  const euler = useRef(new Euler(0, 0, 0, 'YXZ'))
  const move = useRef(new Vector3())

  useUnifiedInput((action: InputAction, pressed) => {
    if (action in directionForAction) {
      const direction = directionForAction[action as keyof typeof directionForAction]
      usePlayerInputStore.getState().setDirection(direction, pressed)
      return
    }
    if (!pressed) return
    const state = useMuseumStore.getState()
    if (action === 'interact' && state.stage === 'exploring' && state.focusedExhibitId) {
      state.enterExhibit(state.focusedExhibitId)
    } else if (action === 'hint' && state.stage === 'exploring' && state.focusedExhibitId) {
      state.openOverlay('hint')
    } else if (action === 'escape') {
      if (state.overlay !== 'none') state.closeOverlay()
      else if (state.stage === 'exhibit' || state.stage === 'spatial-exhibit') state.leaveExhibit()
      document.exitPointerLock?.()
    }
  })

  useEffect(() => {
    const canvas = gl.domElement
    const rotate = (deltaX: number, deltaY: number) => {
      const state = useMuseumStore.getState()
      if ((state.stage !== 'exploring' && state.stage !== 'spatial-exhibit') || state.overlay !== 'none') return
      const sensitivity = state.settings.lookSensitivity * 0.0022
      yaw.current -= deltaX * sensitivity
      pitch.current = Math.max(-1.25, Math.min(1.25, pitch.current - deltaY * sensitivity))
    }
    const onPointerDown = () => {
      const state = useMuseumStore.getState()
      if ((state.stage === 'exploring' || state.stage === 'spatial-exhibit') && state.overlay === 'none' && !matchMedia('(pointer: coarse)').matches) {
        void canvas.requestPointerLock()
      }
    }
    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === canvas) rotate(event.movementX, event.movementY)
    }
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch && touch.clientX > window.innerWidth * 0.42) lastTouch.current = [touch.clientX, touch.clientY]
    }
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch || !lastTouch.current) return
      rotate(touch.clientX - lastTouch.current[0], touch.clientY - lastTouch.current[1])
      lastTouch.current = [touch.clientX, touch.clientY]
    }
    const onTouchEnd = () => { lastTouch.current = null }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd)
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl])

  useEffect(() => {
    const unsubscribe = useMuseumStore.subscribe((state) => {
      if ((state.stage !== 'exploring' && state.stage !== 'spatial-exhibit') || state.overlay !== 'none') {
        usePlayerInputStore.getState().clear()
        if (document.pointerLockElement) document.exitPointerLock?.()
      }
    })
    return unsubscribe
  }, [])

  useFrame((_, delta) => {
    const museum = useMuseumStore.getState()
    euler.current.set(pitch.current, yaw.current, 0)
    camera.quaternion.setFromEuler(euler.current)
    if ((museum.stage !== 'exploring' && museum.stage !== 'spatial-exhibit') || museum.overlay !== 'none') return

    const input = usePlayerInputStore.getState()
    const x = Number(input.right) - Number(input.left)
    const z = Number(input.backward) - Number(input.forward)
    if (x !== 0 || z !== 0) {
      move.current.set(x, 0, z).normalize().applyAxisAngle(new Vector3(0, 1, 0), yaw.current)
      const speed = 4.2 * Math.min(delta, 0.05)
      const current: [number, number] = [camera.position.x, camera.position.z]
      const xResolved = resolvePlayerPosition(current, [current[0] + move.current.x * speed, current[1]])
      const zResolved = resolvePlayerPosition(xResolved, [xResolved[0], xResolved[1] + move.current.z * speed])
      camera.position.set(zResolved[0], 1.65, zResolved[1])
    }

    const forward: [number, number] = [-Math.sin(yaw.current), -Math.cos(yaw.current)]
    const focused = museum.stage === 'exploring'
      ? selectFocusedExhibit([camera.position.x, camera.position.z], forward, getExhibitCatalog(getMuseumMode()))
      : null
    const nextId = focused?.id ?? null
    if (nextId !== focusedId.current) {
      focusedId.current = nextId
      museum.focusExhibit(nextId)
    }
  })

  return null
}
