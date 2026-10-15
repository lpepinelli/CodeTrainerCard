import { useEffect } from 'react'
import type { ComponentType } from 'react'

import Builder from './components/Builder'
import Guide from './components/Guide'
import TitleScreen from './components/TitleScreen'

const screens: Record<string, ComponentType> = {
  '/builder': Builder,
  '/guide': Guide
}

// Earlier versions linked to #builder and #guide, and those links live on in READMEs and shared messages
const legacyPaths: Record<string, string> = {
  '#builder': '/builder',
  '#guide': '/guide'
}

function App() {
  const legacyPath = legacyPaths[window.location.hash]
  const path = legacyPath ?? (window.location.pathname.replace(/\/+$/, '') || '/')

  useEffect(() => {
    if (legacyPath) history.replaceState(null, '', legacyPath)
  }, [legacyPath])

  const Screen = screens[path] ?? TitleScreen
  return <Screen />
}

export default App
