export type CameraTargetPose = {
  position: [number, number, number]
  target: [number, number, number]
}

export function cameraAnglesForTarget({ position, target }: CameraTargetPose) {
  const deltaX = target[0] - position[0]
  const deltaY = target[1] - position[1]
  const deltaZ = target[2] - position[2]
  return {
    yaw: Math.atan2(-deltaX, -deltaZ),
    pitch: Math.atan2(deltaY, Math.hypot(deltaX, deltaZ)),
  }
}
