import { useState } from 'react'

type CardPreviewProps = {
  url: string
}

// The new card loads in a hidden <img> so the previous one stays on screen until it is ready
function CardPreview({ url }: CardPreviewProps) {
  const [shownUrl, setShownUrl] = useState('')
  const [failedUrl, setFailedUrl] = useState('')

  if (!url) {
    return (
      <div className="card-frame">
        <p className="card-message">Enter a GitHub username to see your card</p>
      </div>
    )
  }

  const failed = url === failedUrl
  const loading = url !== shownUrl && !failed

  return (
    <div className="card-frame" aria-busy={loading}>
      {shownUrl && !failed && <img src={shownUrl} className={loading ? 'card loading' : 'card'} alt="Card preview" />}
      {loading && <img src={url} hidden alt="" onLoad={() => setShownUrl(url)} onError={() => setFailedUrl(url)} />}
      {loading && !shownUrl && <p className="card-message">Loading...</p>}
      {failed && <p className="card-message">Couldn't load this card. Check the username or try again in a moment.</p>}
    </div>
  )
}

export default CardPreview
