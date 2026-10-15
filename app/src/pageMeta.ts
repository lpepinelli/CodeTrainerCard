import { useEffect } from 'react'

import { siteUrl } from './config/api'

type PageMeta = {
  path: string
  title: string
  description: string
}

// Every screen is served from the same index.html, so each one sets the title, description and canonical URL that search engines index for it
export const usePageMeta = ({ path, title, description }: PageMeta) => {
  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = new URL(path, siteUrl).href
  }, [path, title, description])
}
