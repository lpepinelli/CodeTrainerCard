import { useEffect, useState } from 'react'

import { buildCardUrl } from './cardUrl'
import type { CardOptions } from './cardUrl'
import { apiUrl } from './config/api'
import { loadOptions, saveOptions } from './savedOptions'
import type { CardSide } from './renderPreview'
import CardPreview from './components/CardPreview'
import DevTools from './components/DevTools'
import Logo from './components/Logo'
import OptionsForm from './components/OptionsForm'
import ShareActions from './components/ShareActions'

// A new username means fetching GitHub data, so the preview waits for typing to settle; every other option renders locally right away
const usernameDelay = 600

const urlFor = (options: CardOptions) => options.username.trim() ? buildCardUrl(apiUrl, options) : ''

function App() {
  const [options, setOptions] = useState(loadOptions)
  const [previewUsername, setPreviewUsername] = useState(options.username.trim())
  const [side, setSide] = useState<CardSide>('auto')

  useEffect(() => saveOptions(options), [options])

  useEffect(() => {
    const timeout = setTimeout(() => setPreviewUsername(options.username.trim()), usernameDelay)
    return () => clearTimeout(timeout)
  }, [options.username])

  const cardUrl = urlFor(options)

  return (
    <div className="page">
      <header className="title">
        <Logo />
        <div>
          <h1>Code Trainer Card</h1>
          <p>Build your card and drop it in your GitHub README</p>
        </div>
      </header>
      <main className="layout">
        <section className="panel preview-panel" aria-label="Preview">
          <CardPreview username={previewUsername} url={urlFor({ ...options, username: previewUsername })} side={side} />
          <ShareActions cardUrl={cardUrl} username={options.username} />
        </section>
        <section className="panel" aria-label="Options">
          <OptionsForm options={options} onChange={setOptions} />
        </section>
      </main>
      {import.meta.env.DEV && <DevTools side={side} onSideChange={setSide} />}
    </div>
  )
}

export default App
