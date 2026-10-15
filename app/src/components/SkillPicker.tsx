import { useState } from 'react'

import { skills } from '../../../api/src/config/skills'
import { maxSkills } from '../../../api/src/templates/card'
import { skillCategories } from '../config/skillCategories'
import SkillSlots from './SkillSlots'
import Toggle from './Toggle'

type SkillPickerProps = {
  selected: string[]
  hideBadges: boolean
  onChange: (changes: { skills: string[]; hideBadges?: boolean }) => void
}

// Keys are short ('ts', 'cpp'), so GitHub's language names are searched too: 'typescript' and 'c++' still find them
const matches = (skill: string, query: string) =>
  [skill, ...skills[skill]].some((name) => name.toLowerCase().includes(query))

function SkillPicker({ selected, hideBadges, onChange }: SkillPickerProps) {
  const [search, setSearch] = useState('')
  const limit = maxSkills(hideBadges)
  const query = search.trim().toLowerCase()
  const groups = Object.entries(skillCategories)
    .map(([category, keys]) => ({ category, keys: keys.filter((skill) => matches(skill, query)) }))
    .filter(({ keys }) => keys.length > 0)

  const toggle = (skill: string) =>
    onChange({ skills: selected.includes(skill) ? selected.filter((item) => item !== skill) : [...selected, skill] })

  // Showing badges again leaves fewer slots, so extra picks are dropped rather than silently cut from the card
  const toggleBadges = (hide: boolean) => onChange({ hideBadges: hide, skills: selected.slice(0, maxSkills(hide)) })

  return (
    <fieldset>
      <legend>Skills {selected.length}/{limit}</legend>
      <p className="hint">
        {selected.length ? 'Drag to change the order on the card. ' : 'None picked: uses your top GitHub languages. '}
        {selected.length > 0 && <button type="button" className="text-button" onClick={() => onChange({ skills: [] })}>Clear</button>}
      </p>
      <Toggle
        label="Hide badges"
        hint={`Gives the badge row to skills, for up to ${maxSkills(true)}`}
        checked={hideBadges}
        onCheckedChange={toggleBadges}
      />
      <SkillSlots selected={selected} limit={limit} onChange={(skills) => onChange({ skills })} />
      <input
        className="skill-search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search skills"
        aria-label="Search skills"
      />
      <div className="skill-list">
        {groups.length === 0 && <p className="hint">No skill matches '{search.trim()}'</p>}
        {groups.map(({ category, keys }) => (
          <section key={category} className="skill-group" aria-label={category}>
            <h3>{category}</h3>
            <div className="chips">
              {keys.map((skill) => {
                const position = selected.indexOf(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    className="chip"
                    aria-pressed={position >= 0}
                    disabled={position < 0 && selected.length >= limit}
                    onClick={() => toggle(skill)}
                  >
                    {position >= 0 && <span className="chip-position">{position + 1}</span>}
                    {skill}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </fieldset>
  )
}

export default SkillPicker
