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
    float: true,
    floatShadow: true,
    autoFlip: true,
    flipSeconds: 5,
    includePrivate: true,
    hideBadges: true
  })
  assert.equal(
    url,
    'https://api.test/api/card/octocat?name=Mona%20Lisa&role=Front%20%26%20Back&color=FF8A8A&skills=ts,react,go&pixelate=32&shine&float&shadow&auto-flip=5&private&hide-badges'
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

test('markdown links a sized card to the builder', () => {
  assert.equal(
    buildMarkdown('https://site.test', 'https://api.test/api/card/octocat?skills=ts,go&shine', ' octocat '),
    `<a href="https://site.test"><img src="https://api.test/api/card/octocat?skills=ts,go&shine" alt="octocat's Code Trainer Card" width="500"></a>`
  )
})
