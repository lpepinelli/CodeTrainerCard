import { useEffect } from 'react'

import { usePageMeta } from '../pageMeta'
import ExampleCard from './ExampleCard'
import Logo from './Logo'
import StarLink from './StarLink'

// Static snapshots, so the landing page never spends API or GitHub rate limit on visitors who aren't building a card
const examples = [
  { username: 'torvalds', side: 'left' },
  { username: 'unclebob', side: 'right' }
] as const

function TitleScreen() {
  usePageMeta({
    path: '/',
    title: 'Code Trainer Card · Pokémon-style GitHub profile card',
    description: 'Turn your GitHub profile into a pixel-art trainer card inspired by Pokémon FireRed. Build yours and drop it in your README.'
  })

  useEffect(() => {
    // Enter anywhere starts, like a console title screen; focused controls keep their own Enter
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.target === document.body) window.location.assign('/builder')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <main className="title-screen">
      <header className="title-screen-head">
        <div className="title">
          <Logo />
          <h1>Code Trainer Card</h1>
        </div>
        <p>The trainer card for devs. Build yours and drop it in your GitHub README</p>
      </header>
      {examples.map(({ username, side }) => (
        <ExampleCard key={username} username={username} side={side} />
      ))}
      <div className="title-actions">
        <a className="start" href="/builder">Press start</a>
        <StarLink />
      </div>
    </main>
  )
}

export default TitleScreen
