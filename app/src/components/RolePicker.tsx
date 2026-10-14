import { useState } from 'react'

// Every preset fits the card's 15-character role
const roles = [
  'Software Eng.', 'Front-end', 'Back-end', 'Full-stack', 'Mobile', 'DevOps', 'SRE', 'Cloud Engineer', 'Data Engineer',
  'Data Scientist', 'ML Engineer', 'QA Engineer', 'Security', 'Game Dev', 'Embedded', 'UI/UX Designer',
  'Tech Lead', 'Student'
]

const customValue = 'custom'

type RolePickerProps = {
  role: string
  onChange: (role: string) => void
}

function RolePicker({ role, onChange }: RolePickerProps) {
  const [custom, setCustom] = useState(() => role !== '' && !roles.includes(role))

  const choose = (value: string) => {
    setCustom(value === customValue)
    if (value !== customValue) onChange(value)
  }

  return (
    <>
      <label className="field">
        Role
        <select value={custom ? customValue : role} onChange={(event) => choose(event.target.value)}>
          <option value="">None</option>
          {roles.map((preset) => <option key={preset} value={preset}>{preset}</option>)}
          <option value={customValue}>Custom...</option>
        </select>
      </label>
      {custom && (
        <label className="field">
          Custom role
          <input
            value={role}
            maxLength={15}
            placeholder="Up to 15 characters"
            autoFocus
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
      )}
    </>
  )
}

export default RolePicker
