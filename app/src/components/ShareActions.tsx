import { useState } from 'react'

import { buildMarkdown } from '../cardUrl'
import { siteUrl } from '../config/api'

type ShareActionsProps = {
  cardUrl: string
  username: string
}

function ShareActions({ cardUrl, username }: ShareActionsProps) {
  const [copied, setCopied] = useState(false)
  const markdown = cardUrl && buildMarkdown(siteUrl, cardUrl, username)

  const copy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="share">
      <code className="card-url">{cardUrl || '...'}</code>
      <div className="share-buttons">
        <button type="button" disabled={!markdown} onClick={copy}>
          {copied ? 'Copied!' : 'Copy Markdown'}
        </button>
      </div>
    </div>
  )
}

export default ShareActions
