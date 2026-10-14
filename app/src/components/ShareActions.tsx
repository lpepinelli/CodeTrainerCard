import { useState } from 'react'

import { buildMarkdown } from '../cardUrl'

type ShareActionsProps = {
  cardUrl: string
  username: string
}

function ShareActions({ cardUrl, username }: ShareActionsProps) {
  const [copied, setCopied] = useState('')

  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="share">
      <code className="card-url">{cardUrl || '...'}</code>
      <div className="share-buttons">
        <button type="button" disabled={!cardUrl} onClick={() => copy('url', cardUrl)}>
          {copied === 'url' ? 'Copied!' : 'Copy URL'}
        </button>
        <button type="button" disabled={!cardUrl} onClick={() => copy('markdown', buildMarkdown(cardUrl, username))}>
          {copied === 'markdown' ? 'Copied!' : 'Copy Markdown'}
        </button>
      </div>
    </div>
  )
}

export default ShareActions
