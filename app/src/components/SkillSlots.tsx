import { useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

const iconUrls = import.meta.glob<string>('../../../api/src/assets/skills/*.svg', { query: '?url', import: 'default', eager: true })

const iconUrl = (skill: string) => iconUrls[`../../../api/src/assets/skills/${skill}.svg`]

const slideMs = 160

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

const slide = (tile: HTMLElement, from: string) => {
  if (reducedMotion()) return
  return tile.animate([{ transform: from }, { transform: 'none' }], { duration: slideMs, easing: 'ease-out' })
}

type Drag = {
  skill: string
  grabX: number
  grabY: number
  pointerX: number
  pointerY: number
}

// Tiles wrap into rows of this many, matching the grid in index.css
const columns = 4

type SkillSlotsProps = {
  selected: string[]
  limit: number
  onChange: (skills: string[]) => void
}

// Pointer events instead of native drag and drop, which doesn't fire for touch on most mobile browsers
function SkillSlots({ selected, limit, onChange }: SkillSlotsProps) {
  const listRef = useRef<HTMLOListElement>(null)
  const positions = useRef(new Map<string, { x: number; y: number }>())
  const drag = useRef<Drag | null>(null)
  const [dragging, setDragging] = useState('')

  const tileFor = (skill: string) => listRef.current?.querySelector<HTMLElement>(`[data-skill="${skill}"]`)

  // Offsets ignore transforms, so the dragged tile is placed relative to its current slot, wherever reordering put it
  const followPointer = () => {
    const current = drag.current
    const tile = current && tileFor(current.skill)
    if (!current || !tile || !listRef.current) return
    const list = listRef.current.getBoundingClientRect()
    const x = current.pointerX - list.left - current.grabX - tile.offsetLeft
    const y = current.pointerY - list.top - current.grabY - tile.offsetTop
    tile.style.transform = `translate(${x}px, ${y}px)`
  }

  // FLIP: tiles that changed slot start from where they were and slide into place
  useLayoutEffect(() => {
    const next = new Map<string, { x: number; y: number }>()
    listRef.current?.querySelectorAll<HTMLElement>('[data-skill]').forEach((tile) => {
      const skill = tile.dataset.skill as string
      const previous = positions.current.get(skill)
      next.set(skill, { x: tile.offsetLeft, y: tile.offsetTop })
      if (!previous || skill === drag.current?.skill) return
      const dx = previous.x - tile.offsetLeft
      const dy = previous.y - tile.offsetTop
      if (dx || dy) slide(tile, `translate(${dx}px, ${dy}px)`)
    })
    positions.current = next
    followPointer()
  })

  const moveTo = (skill: string, index: number) => {
    if (index < 0 || index >= selected.length || selected[index] === skill) return
    const reordered = selected.filter((item) => item !== skill)
    reordered.splice(index, 0, skill)
    onChange(reordered)
  }

  const startDrag = (event: PointerEvent<HTMLLIElement>, skill: string) => {
    if (event.button !== 0) return
    const tile = event.currentTarget.getBoundingClientRect()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      skill,
      grabX: event.clientX - tile.left,
      grabY: event.clientY - tile.top,
      pointerX: event.clientX,
      pointerY: event.clientY
    }
    setDragging(skill)
  }

  const moveDrag = (event: PointerEvent) => {
    const current = drag.current
    if (!current || !listRef.current) return
    current.pointerX = event.clientX
    current.pointerY = event.clientY

    const list = listRef.current.getBoundingClientRect()
    const slotWidth = list.width / columns
    const slotHeight = list.height / Math.ceil(limit / columns)
    const clamp = (value: number, max: number) => Math.min(Math.max(Math.floor(value), 0), max)
    const column = clamp((event.clientX - list.left - current.grabX + slotWidth / 2) / slotWidth, columns - 1)
    const row = clamp((event.clientY - list.top - current.grabY + slotHeight / 2) / slotHeight, Math.ceil(limit / columns) - 1)
    moveTo(current.skill, Math.min(row * columns + column, selected.length - 1))
    followPointer()
  }

  // The tile glides from wherever it was dropped into its slot, staying on top until it lands
  const endDrag = () => {
    const current = drag.current
    const tile = current && tileFor(current.skill)
    drag.current = null
    if (!current || !tile) {
      setDragging('')
      return
    }

    const droppedAt = tile.style.transform
    tile.style.transform = ''
    const landing = droppedAt ? slide(tile, droppedAt) : undefined
    const land = () => setDragging((skill) => (skill === current.skill ? '' : skill))
    if (landing) landing.finished.then(land, land)
    else land()
  }

  const moveWithKeys = (event: KeyboardEvent, skill: string, index: number) => {
    const offset = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key]
    if (!offset) return
    event.preventDefault()
    moveTo(skill, index + offset)
  }

  return (
    <ol className="skill-slots" ref={listRef}>
      {Array.from({ length: limit }, (_, index) => {
        const skill = selected[index]
        if (!skill) return <li key={`empty-${index}`} className="skill-slot empty" aria-hidden />

        return (
          <li
            key={skill}
            className={skill === dragging ? 'skill-slot dragging' : 'skill-slot'}
            data-skill={skill}
            tabIndex={0}
            aria-label={`${skill}, position ${index + 1} of ${selected.length}. Drag or use arrow keys to reorder`}
            onPointerDown={(event) => startDrag(event, skill)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={(event) => moveWithKeys(event, skill, index)}
          >
            <span className="chip-position">{index + 1}</span>
            <img src={iconUrl(skill)} alt="" draggable={false} />
            <span className="skill-slot-name">{skill}</span>
            <button
              type="button"
              className="skill-slot-remove"
              aria-label={`Remove ${skill}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onChange(selected.filter((item) => item !== skill))}
            >
              ×
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export default SkillSlots
