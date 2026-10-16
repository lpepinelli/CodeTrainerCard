import { defaultColor, isHexColor } from '../cardUrl'
import type { CardOptions } from '../cardUrl'
import RolePicker from './RolePicker'
import SkillPicker from './SkillPicker'
import Toggle from './Toggle'

const presetColors = [defaultColor, 'FF8A8A', 'FFB36B', 'FFD966', '7EDC9A', '6FD3E8', '7FB3FF', 'FF9ED2']

type OptionsFormProps = {
  options: CardOptions
  onChange: (options: CardOptions) => void
}

function OptionsForm({ options, onChange }: OptionsFormProps) {
  const update = (changes: Partial<CardOptions>) => onChange({ ...options, ...changes })

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
        <RolePicker role={options.role} onChange={(role) => update({ role })} />
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
              onClick={() => update({ color })}
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

      <SkillPicker selected={options.skills} hideBadges={options.hideBadges} onChange={update} />

      <fieldset>
        <legend>Effects</legend>
        <Toggle
          label="Pixelate"
          hint="Turns the avatar and icons into pixel art"
          checked={options.pixelate}
          onCheckedChange={(pixelate) => update({ pixelate })}
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
          onCheckedChange={(shine) => update({ shine })}
        />
        <Toggle
          label="Float"
          hint="Card bobs gently up and down"
          checked={options.float}
          onCheckedChange={(float) => update({ float })}
          extra={{
            label: 'Shadow',
            checked: options.floatShadow,
            onCheckedChange: (floatShadow) => update({ floatShadow })
          }}
        />
        <Toggle
          label="Auto-flip"
          hint="Flips to the back of the card on a loop"
          checked={options.autoFlip}
          onCheckedChange={(autoFlip) => update({ autoFlip })}
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
          onCheckedChange={(includePrivate) => update({ includePrivate })}
        />
      </fieldset>
    </form>
  )
}

export default OptionsForm
