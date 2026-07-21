export function isWebGL2Available() {
  if (typeof document === 'undefined') return false
  const canvas = document.createElement('canvas')
  try {
    return canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) !== null
  } catch {
    return false
  }
}
