type ToggleProps = {
  label: string
  hint: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  range?: {
    min: number
    max: number
    value: number
    unit: string
    onChange: (value: number) => void
  }
}

function Toggle({ label, hint, checked, onCheckedChange, range }: ToggleProps) {
  return (
    <div className="toggle">
      <label className="checkbox">
        <input type="checkbox" checked={checked} onChange={(event) => onCheckedChange(event.target.checked)} />
        {label}
      </label>
      <p className="hint">{hint}</p>
      {range && checked && (
        <label className="range">
          <input
            type="range"
            min={range.min}
            max={range.max}
            value={range.value}
            aria-label={`${label} ${range.unit}`}
            onChange={(event) => range.onChange(Number(event.target.value))}
          />
          <output>{range.value} {range.unit}</output>
        </label>
      )}
    </div>
  )
}

export default Toggle
