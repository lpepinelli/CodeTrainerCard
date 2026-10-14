import assert from 'node:assert/strict'
import { test } from 'node:test'

import { buildCardUrl, buildMarkdown, defaultOptions } from '../src/cardUrl.ts'

const apiUrl = 'https://api.test'

test('default options produce a bare card URL', () => {
  assert.equal(buildCardUrl(apiUrl, { ...defaultOptions, username: ' octocat ' }), 'https://api.test/api/card/octocat')
})

test('every option is passed in the format the API reads', () => {
  const url = buildCardUrl(apiUrl, {
    ...defaultOptions,
    username: 'octocat',
    name: 'Mona Lisa',
    role: 'Front & Back',
    color: 'ff8a8a',
    skills: ['ts', 'react', 'go'],
    pixelate: true,
    pixelateBlocks: 32,
    shine: true,
    autoFlip: true,
    flipSeconds: 5,
    includePrivate: true,
    hideBadges: true
  })
  assert.equal(
    url,
    'https://api.test/api/card/octocat?name=Mona%20Lisa&role=Front%20%26%20Back&color=FF8A8A&skills=ts,react,go&pixelate=32&shine&auto-flip=5&private&hide-badges'
  )
})

test('valued flags at their API default are written as bare flags', () => {
  const url = buildCardUrl(apiUrl, { ...defaultOptions, username: 'octocat', pixelate: true, autoFlip: true })
  assert.equal(url, 'https://api.test/api/card/octocat?pixelate&auto-flip')
})

test('invalid or default colors are left out', () => {
  assert.equal(buildCardUrl(apiUrl, { ...defaultOptions, username: 'octocat', color: 'zzz' }), 'https://api.test/api/card/octocat')
  assert.equal(buildCardUrl(apiUrl, { ...defaultOptions, username: 'octocat', color: 'bc93ff' }), 'https://api.test/api/card/octocat')
})

test('disabled effects are left out even when their values changed', () => {
  const url = buildCardUrl(apiUrl, { ...defaultOptions, username: 'octocat', pixelateBlocks: 16, flipSeconds: 30 })
  assert.equal(url, 'https://api.test/api/card/octocat')
})

test('markdown links the card to the GitHub profile', () => {
  assert.equal(
    buildMarkdown('https://api.test/api/card/octocat', 'octocat'),
    "[![octocat's Developer Trainer Card](https://api.test/api/card/octocat)](https://github.com/octocat)"
  )
})
