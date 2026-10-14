import { composeCard } from '../../api/src/card/composeCard'
import type { CardSource } from '../../api/src/card/composeCard'
import font from '../../api/src/assets/fonts/pokemonFireRed.ttf?inline'
import { cacheFor } from '../../api/src/services/cache'

import { apiUrl } from './config/api'

export class UserNotFoundError extends Error {}

// Each icon is its own chunk, loaded the first time a card uses it, rather than bundling all of them up front
const skillIcons = import.meta.glob<string>('../../api/src/assets/skills/*.svg', { query: '?inline', import: 'default' })

const skillIcon = (key: string) => skillIcons[`../../api/src/assets/skills/${key}.svg`]()

const fetchSource = async (username: string): Promise<CardSource> => {
  const response = await fetch(`${apiUrl}/api/card/${encodeURIComponent(username)}/data`)
  if (response.status === 404) throw new UserNotFoundError(username)
  if (!response.ok) throw new Error(`Card data request failed with ${response.status}`)
  return response.json()
}

const loadSource = cacheFor(10 * 60 * 1000, fetchSource)

// The canvas version of the API's sharp resize: one pixel per block, cropped to a square.
// Browsers resample slightly differently than sharp, so a block's color can be off by a shade
const pixelate = async (image: string, size: number) => {
  const element = new Image()
  element.src = image
  await element.decode()

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  context.imageSmoothingQuality = 'high'

  // Skill SVGs only have a square viewBox, which browsers don't report as a natural size
  if (image.startsWith('data:image/svg')) {
    context.drawImage(element, 0, 0, size, size)
  } else {
    const { naturalWidth: width, naturalHeight: height } = element
    const side = Math.min(width, height)
    context.drawImage(element, (width - side) / 2, (height - side) / 2, side, side, 0, 0, size, size)
  }
  return canvas.toDataURL('image/png')
}

export type CardSide = 'auto' | 'front' | 'back'

const frozenFlip = '.flip, .back { animation: none !important; }'

// Dev tool: the back only exists in the SVG with auto-flip on, so pinning it forces auto-flip and freezes the animation
const pinSide = (svg: string, side: CardSide) => {
  if (side === 'auto') return svg
  const pinned = side === 'back' ? `${frozenFlip} .back { opacity: 1 !important; }` : frozenFlip
  return svg.replace('</style>', `${pinned}</style>`)
}

// Parsing the card URL's own query keeps the preview on exactly the options the API will read
export const renderPreview = async (username: string, cardUrl: string, side: CardSide = 'auto') => {
  const query: Record<string, string> = Object.fromEntries(new URL(cardUrl).searchParams)
  if (side === 'back' && !('auto-flip' in query)) query['auto-flip'] = ''
  const svg = await composeCard(await loadSource(username.toLowerCase()), query, { font, skillIcon, pixelate })
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pinSide(svg, side))}`
}
