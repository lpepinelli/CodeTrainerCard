import { useSyncExternalStore } from 'react'
import type { ComponentType } from 'react'

import Builder from './components/Builder'
import Guide from './components/Guide'
import TitleScreen from './components/TitleScreen'

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const getHash = () => window.location.hash

const screens: Record<string, ComponentType> = {
  '#builder': Builder,
  '#guide': Guide
}

function App() {
  const Screen = screens[useSyncExternalStore(subscribe, getHash)] ?? TitleScreen
  return <Screen />
}

export default App
