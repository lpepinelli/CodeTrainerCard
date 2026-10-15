import assert from 'node:assert/strict'
import { test } from 'node:test'

import { skills } from '../../api/src/config/skills.ts'
import { skillCategories } from '../src/config/skillCategories.ts'

test('every skill is listed in exactly one category', () => {
  const listed = Object.values(skillCategories).flat()
  assert.deepEqual([...listed].sort(), Object.keys(skills).sort())
})
