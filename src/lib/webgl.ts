export function isWebGL2Available() {
  if (typeof document === 'undefined') return false
  if (new URLSearchParams(window.location.search).get('webgl') === 'off') return false
  const canvas = document.createElement('canvas')
  try {
    return canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) !== null
  } catch {
    return false
  }
}
