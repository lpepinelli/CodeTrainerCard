export type CardOptions = {
  username: string
  name: string
  role: string
  color: string
  skills: string[]
  pixelate: boolean
  pixelateBlocks: number
  shine: boolean
  float: boolean
  floatShadow: boolean
  autoFlip: boolean
  flipSeconds: number
  includePrivate: boolean
  hideBadges: boolean
}

export const defaultColor = 'BC93FF'
export const defaultPixelateBlocks = 80
export const defaultFlipSeconds = 10

export const defaultOptions: CardOptions = {
  username: '',
  name: '',
  role: '',
  color: defaultColor,
  skills: [],
  pixelate: false,
  pixelateBlocks: defaultPixelateBlocks,
  shine: false,
  float: false,
  floatShadow: false,
  autoFlip: false,
  flipSeconds: defaultFlipSeconds,
  includePrivate: false,
  hideBadges: false
}

export const isHexColor = (value: string) => /^[0-9a-f]{6}$/i.test(value)

// Commas are left readable so the skills list stays legible in a README
const encode = (value: string) => encodeURIComponent(value).replace(/%2C/g, ',')

// Options equal to the API defaults are left out, and defaults of valued flags are written as bare flags, to keep the URL short
export const buildCardUrl = (apiUrl: string, options: CardOptions) => {
  const params: string[] = []
  const flag = (key: string, value?: string) => params.push(value === undefined ? key : `${key}=${encode(value)}`)

  const name = options.name.trim()
  const role = options.role.trim()
  if (name) flag('name', name)
  if (role) flag('role', role)
  if (isHexColor(options.color) && options.color.toUpperCase() !== defaultColor) flag('color', options.color.toUpperCase())
  if (options.skills.length) flag('skills', options.skills.join(','))
  if (options.pixelate) flag('pixelate', options.pixelateBlocks === defaultPixelateBlocks ? undefined : String(options.pixelateBlocks))
  if (options.shine) flag('shine')
  if (options.float) flag('float')
  if (options.float && options.floatShadow) flag('shadow')
  if (options.autoFlip) flag('auto-flip', options.flipSeconds === defaultFlipSeconds ? undefined : String(options.flipSeconds))
  if (options.includePrivate) flag('private')
  if (options.hideBadges) flag('hide-badges')

  const query = params.length ? `?${params.join('&')}` : ''
  return `${apiUrl}/api/card/${encodeURIComponent(options.username.trim())}${query}`
}

const cardWidth = 500

// HTML rather than ![](): Markdown images can't be sized, and at its native 1029px the card fills the README.
// The link goes to the builder rather than the profile the reader is already on, so they can make their own
export const buildMarkdown = (siteUrl: string, cardUrl: string, username: string) =>
  `<a href="${siteUrl}"><img src="${cardUrl}" alt="${username.trim()}'s Code Trainer Card" width="${cardWidth}"></a>`
