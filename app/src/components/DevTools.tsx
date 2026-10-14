import type { CardSide } from '../renderPreview'

const sides: CardSide[] = ['auto', 'front', 'back']

type DevToolsProps = {
  side: CardSide
  onSideChange: (side: CardSide) => void
}

// Only rendered under `import.meta.env.DEV`, so production builds drop it
function DevTools({ side, onSideChange }: DevToolsProps) {
  return (
    <aside className="dev-tools" aria-label="Dev tools">
      <span>Dev · card side</span>
      <div>
        {sides.map((option) => (
          <button key={option} type="button" aria-pressed={side === option} onClick={() => onSideChange(option)}>
            {option}
          </button>
        ))}
      </div>
    </aside>
  )
}

export default DevTools
