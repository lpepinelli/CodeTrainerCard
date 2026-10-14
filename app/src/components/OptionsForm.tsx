import { defaultColor, isHexColor } from '../cardUrl'
import type { CardOptions } from '../cardUrl'
import SkillPicker from './SkillPicker'
import Toggle from './Toggle'

const presetColors = [defaultColor, 'FF8A8A', 'FFB36B', 'FFD966', '7EDC9A', '6FD3E8', '7FB3FF', 'FF9ED2']

type OptionsFormProps = {
  options: CardOptions
  onChange: (options: CardOptions, instant: boolean) => void
}

function OptionsForm({ options, onChange }: OptionsFormProps) {
  const update = (changes: Partial<CardOptions>) => onChange({ ...options, ...changes }, false)
  const updateNow = (changes: Partial<CardOptions>) => onChange({ ...options, ...changes }, true)

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <fieldset>
        <legend>Trainer</legend>
        <label className="field">
          GitHub username
          <input
            value={options.username}
            placeholder="octocat"
            autoFocus
            autoCapitalize="off"
            spellCheck={false}
            onChange={(event) => update({ username: event.target.value })}
          />
        </label>
        <label className="field">
          Name
          <input
            value={options.name}
            maxLength={18}
            placeholder="Your GitHub name"
            onChange={(event) => update({ name: event.target.value })}
          />
        </label>
        <label className="field">
          Role
          <input
            value={options.role}
            maxLength={15}
            placeholder="Front-end"
            onChange={(event) => update({ role: event.target.value })}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Color</legend>
        <div className="swatches">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              className="swatch"
              style={{ background: `#${color}` }}
              aria-label={`#${color}`}
              aria-pressed={options.color.toUpperCase() === color}
              onClick={() => updateNow({ color })}
            />
          ))}
        </div>
        <label className="field hex">
          Hex
          <span className="hex-input">
            #
            <input
              value={options.color}
              maxLength={6}
              spellCheck={false}
              aria-invalid={!isHexColor(options.color)}
              onChange={(event) => update({ color: event.target.value.replace('#', '') })}
            />
            <input
              type="color"
              className="swatch"
              aria-label="Custom color"
              value={`#${isHexColor(options.color) ? options.color : defaultColor}`.toLowerCase()}
              onChange={(event) => update({ color: event.target.value.slice(1).toUpperCase() })}
            />
          </span>
        </label>
      </fieldset>

      <SkillPicker selected={options.skills} onChange={(skills) => updateNow({ skills })} />

      <fieldset>
        <legend>Effects</legend>
        <Toggle
          label="Pixelate"
          hint="Turns the avatar and icons into pixel art"
          checked={options.pixelate}
          onCheckedChange={(pixelate) => updateNow({ pixelate })}
          range={{
            min: 8,
            max: 128,
            value: options.pixelateBlocks,
            unit: 'blocks',
            onChange: (pixelateBlocks) => update({ pixelateBlocks })
          }}
        />
        <Toggle
          label="Shine"
          hint="Holographic shine sweeping across the card"
          checked={options.shine}
          onCheckedChange={(shine) => updateNow({ shine })}
        />
        <Toggle
          label="Auto-flip"
          hint="Flips to the back of the card on a loop"
          checked={options.autoFlip}
          onCheckedChange={(autoFlip) => updateNow({ autoFlip })}
          range={{
            min: 2,
            max: 60,
            value: options.flipSeconds,
            unit: 's on front',
            onChange: (flipSeconds) => update({ flipSeconds })
          }}
        />
        <Toggle
          label="Private commits"
          hint="Adds private contributions to COMMITS"
          checked={options.includePrivate}
          onCheckedChange={(includePrivate) => updateNow({ includePrivate })}
        />
      </fieldset>
    </form>
  )
}

export default OptionsForm
