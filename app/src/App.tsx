import { useEffect, useState } from 'react'

import { buildCardUrl } from './cardUrl'
import type { CardOptions } from './cardUrl'
import { apiUrl } from './config/api'
import { loadOptions, saveOptions } from './savedOptions'
import CardPreview from './components/CardPreview'
import OptionsForm from './components/OptionsForm'
import ShareActions from './components/ShareActions'

// Typing and dragging fire a change per keystroke or step, so the preview waits for them to settle before requesting a new card
const previewDelay = 600

const urlFor = (options: CardOptions) => options.username.trim() ? buildCardUrl(apiUrl, options) : ''

function App() {
  const [options, setOptions] = useState(loadOptions)
  const [previewOptions, setPreviewOptions] = useState(options)

  const changeOptions = (next: CardOptions, instant: boolean) => {
    setOptions(next)
    if (instant) setPreviewOptions(next)
  }

  useEffect(() => saveOptions(options), [options])

  useEffect(() => {
    const timeout = setTimeout(() => setPreviewOptions(options), previewDelay)
    return () => clearTimeout(timeout)
  }, [options])

  const cardUrl = urlFor(options)

  return (
    <div className="page">
      <header className="title">
        <h1>Developer Trainer Card</h1>
        <p>Build your card and drop it in your GitHub README</p>
      </header>
      <main className="layout">
        <section className="panel preview-panel" aria-label="Preview">
          <CardPreview url={urlFor(previewOptions)} />
          <ShareActions cardUrl={cardUrl} username={options.username} />
        </section>
        <section className="panel" aria-label="Options">
          <OptionsForm options={options} onChange={changeOptions} />
        </section>
      </main>
    </div>
  )
}

export default App
