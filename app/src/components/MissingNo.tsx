import { useMemo } from 'react'

const columns = 7
const rows = 13
const colors = ['#4B4B4B', '#4B4B4B', '#7A7A7A', '#A8A8A8', '#D0D0C8', '#FFFFFF', '#8B63CC', '#BC93FF']

// MissingNo.'s silhouette: a narrow column on the right that widens into a block at the bottom
const inShape = (col: number, row: number) => row >= 5 || col >= 4

// Seeded from the username, so each missing user always gets the same glitch
const seededRandom = (seed: string) => {
  let state = 2166136261
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619)
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 4294967296
  }
}

type MissingNoProps = {
  seed: string
}

function MissingNo({ seed }: MissingNoProps) {
  const cells = useMemo(() => {
    const random = seededRandom(seed)
    return Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, col) => ({ row, col })))
      .flat()
      .filter(({ row, col }) => inShape(col, row))
      .map((cell) => ({ ...cell, color: colors[Math.floor(random() * colors.length)] }))
  }, [seed])

  return (
    <svg className="missingno" viewBox={`0 0 ${columns} ${rows}`} shapeRendering="crispEdges" aria-hidden>
      {cells.map(({ row, col, color }) => <rect key={`${col},${row}`} x={col} y={row} width={1} height={1} fill={color} />)}
    </svg>
  )
}

export default MissingNo
