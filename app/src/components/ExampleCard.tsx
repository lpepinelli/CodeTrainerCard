import { useState } from 'react'
import type { PointerEvent } from 'react'

type ExampleCardProps = {
  username: string
  side: 'left' | 'right'
}

const maxTilt = 16

// Tilts toward the cursor, measured on the button because the card inside it is already rotated
const followPointer = (event: PointerEvent<HTMLButtonElement>) => {
  const box = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - box.left) / box.width - 0.5
  const y = (event.clientY - box.top) / box.height - 0.5
  event.currentTarget.style.setProperty('--tilt-x', `${-y * maxTilt * 2}deg`)
  event.currentTarget.style.setProperty('--tilt-y', `${x * maxTilt * 2}deg`)
}

function ExampleCard({ username, side }: ExampleCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      className={`example ${side}`}
      aria-pressed={flipped}
      aria-label={`Flip ${username}'s card`}
      onClick={() => setFlipped(!flipped)}
      onPointerMove={followPointer}
    >
      <span className="example-tilt">
        <span className={flipped ? 'example-faces flipped' : 'example-faces'}>
          <img src={`/examples/${username}.svg`} alt={`${username}'s Code Trainer Card`} />
          <img className="example-back" src={`/examples/${username}-back.svg`} alt="" />
        </span>
      </span>
    </button>
  )
}

export default ExampleCard
