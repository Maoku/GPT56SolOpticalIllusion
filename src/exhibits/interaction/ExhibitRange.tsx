type ExhibitRangeProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

export function ExhibitRange({ label, value, min, max, step = 1, unit = '', onChange }: ExhibitRangeProps) {
  return (
    <label className="exhibit-range">
      <span><strong>{label}</strong><output>{value}{unit}</output></span>
      <input
        type="range" aria-label={label} min={min} max={max} step={step} value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}
