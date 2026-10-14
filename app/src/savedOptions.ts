import { defaultOptions } from './cardUrl'
import type { CardOptions } from './cardUrl'

const storageKey = 'cardOptions'

// Storage can be unavailable (private mode, blocked site data) or hold options from an older version, so fall back to defaults
export const loadOptions = (): CardOptions => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    return saved && typeof saved === 'object' ? { ...defaultOptions, ...saved } : defaultOptions
  } catch {
    return defaultOptions
  }
}

export const saveOptions = (options: CardOptions) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(options))
  } catch {}
}
