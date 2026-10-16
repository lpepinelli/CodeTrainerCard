import { useState } from 'react'

import { buildMarkdown } from '../cardUrl'
import { siteUrl } from '../config/api'

type ShareActionsProps = {
  cardUrl: string
  username: string
}

function ShareActions({ cardUrl, username }: ShareActionsProps) {
  const [copied, setCopied] = useState<'url' | 'markdown'>()
  const markdown = cardUrl && buildMarkdown(siteUrl, cardUrl, username)

  const copy = async (what: 'url' | 'markdown', text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(what)
    setTimeout(() => setCopied(undefined), 1500)
  }

  return (
    <div className="share">
      <button
        type="button"
        className={copied === 'url' ? 'card-url copied' : 'card-url'}
        disabled={!cardUrl}
        onClick={() => copy('url', cardUrl)}
        data-tooltip={copied === 'url' ? 'Copied!' : 'Click to copy'}
      >
        <code>{cardUrl || '...'}</code>
      </button>
      <div className="share-buttons">
        <button type="button" disabled={!markdown} onClick={() => copy('markdown', markdown)}>
          {copied === 'markdown' ? 'Copied!' : 'Copy Markdown'}
        </button>
      </div>
      <p className="share-help">New to GitHub? <a href="/guide">Where do I paste this?</a></p>
    </div>
  )
}

export default ShareActions
