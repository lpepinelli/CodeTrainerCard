import { useEffect, useState } from 'react'

import { renderPreview, UserNotFoundError } from '../renderPreview'
import MissingNo from './MissingNo'
import type { CardSide } from '../renderPreview'

type CardPreviewProps = {
  username: string
  url: string
  side: CardSide
}

function CardPreview({ username, url, side }: CardPreviewProps) {
  const [image, setImage] = useState('')
  const [result, setResult] = useState<{ url: string; error?: 'notFound' | 'failed' }>({ url: '' })

  useEffect(() => {
    if (!username) return
    let current = true
    renderPreview(username, url, side)
      .then((rendered) => {
        if (!current) return
        setImage(rendered)
        setResult({ url })
      })
      .catch((error) => {
        if (!current) return
        setResult({ url, error: error instanceof UserNotFoundError ? 'notFound' : 'failed' })
      })
    return () => {
      current = false
    }
  }, [username, url, side])

  if (!username) {
    return (
      <div className="card-frame">
        <p className="card-message">Enter a GitHub username to see your card</p>
      </div>
    )
  }

  const loading = result.url !== url
  const error = !loading && result.error

  return (
    <div className="card-frame" aria-busy={loading}>
      {image && !error && <img src={image} className={loading ? 'card loading' : 'card'} alt="Card preview" />}
      {loading && !image && <p className="card-message">Loading...</p>}
      {error === 'notFound' && (
        <div className="card-message not-found">
          <MissingNo seed={username.toLowerCase()} />
          <p>A wild MISSINGNO. appeared!</p>
          <p className="not-found-detail">GitHub user '{username}' not found</p>
        </div>
      )}
      {error === 'failed' && <p className="card-message">Couldn't load this card. Try again in a moment.</p>}
    </div>
  )
}

export default CardPreview
