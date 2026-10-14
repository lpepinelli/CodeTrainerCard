import { useSyncExternalStore } from 'react'

import Builder from './components/Builder'
import TitleScreen from './components/TitleScreen'

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const isBuilder = () => window.location.hash === '#builder'

function App() {
  return useSyncExternalStore(subscribe, isBuilder) ? <Builder /> : <TitleScreen />
}

export default App
