import { maxSkills, skills } from '../config/skills'

type SkillPickerProps = {
  selected: string[]
  onChange: (skills: string[]) => void
}

function SkillPicker({ selected, onChange }: SkillPickerProps) {
  const toggle = (skill: string) =>
    onChange(selected.includes(skill) ? selected.filter((item) => item !== skill) : [...selected, skill])

  return (
    <fieldset>
      <legend>Skills {selected.length}/{maxSkills}</legend>
      <p className="hint">
        {selected.length ? 'Shown in the order you pick them. ' : 'None picked: uses your top GitHub languages. '}
        {selected.length > 0 && <button type="button" className="text-button" onClick={() => onChange([])}>Clear</button>}
      </p>
      <div className="chips">
        {skills.map((skill) => {
          const position = selected.indexOf(skill)
          return (
            <button
              key={skill}
              type="button"
              className="chip"
              aria-pressed={position >= 0}
              disabled={position < 0 && selected.length >= maxSkills}
              onClick={() => toggle(skill)}
            >
              {position >= 0 && <span className="chip-position">{position + 1}</span>}
              {skill}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default SkillPicker
