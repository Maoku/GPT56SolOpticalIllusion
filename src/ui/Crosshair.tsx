export function Crosshair({ active }: { active: boolean }) {
  return <span className={`crosshair${active ? ' crosshair--active' : ''}`} aria-hidden="true" />
}
