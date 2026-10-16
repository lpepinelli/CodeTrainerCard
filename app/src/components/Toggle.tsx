type Checkbox = {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

type ToggleProps = Checkbox & {
  hint: string
  // A sub-option shown beside the checkbox, only while it is on
  extra?: Checkbox
  range?: {
    min: number
    max: number
    value: number
    unit: string
    onChange: (value: number) => void
  }
}

const CheckboxLabel = ({ label, checked, onCheckedChange }: Checkbox) => (
  <label className="checkbox">
    <input type="checkbox" checked={checked} onChange={(event) => onCheckedChange(event.target.checked)} />
    {label}
  </label>
)

function Toggle({ label, hint, checked, onCheckedChange, extra, range }: ToggleProps) {
  return (
    <div className="toggle">
      <div className="toggle-row">
        <CheckboxLabel label={label} checked={checked} onCheckedChange={onCheckedChange} />
        {extra && checked && <CheckboxLabel {...extra} />}
      </div>
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
